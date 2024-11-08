import collections
import re

from rest_framework import serializers
from .models import User, Grocery, Recipe, FavoritedItem, RecipeItem, GroceryItemUnoptimized, GroceryItemOptimized, \
    DietRestriction, Subheading
from django.core.validators import validate_email
import uuid
from .utils import send_verification_email, send_password_reset_confirmation


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

    def validate(self, data):
        '''
        :param:
            data (dict): Contains 'email' and 'password' fields.

        :return:
            dict: Validated data if all checks pass.

        :raises:
            serializers.ValidationError: If the email format is invalid or if the password
            does not meet complexity requirements or matches the email.

        validation details:
            - Password complexity: Must contain at least 8 characters, including at least:
              - 1 uppercase letter
              - 1 lowercase letter
              - 1 number
              - 1 special character (@$!%*?&)
            - Password must not match the email.
            - Email must be in a valid format.
        '''
        email = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if password is okay
        if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
            errorDict[
                'password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
        if password == email:
            errorDict['password'] += 'Password cannot be the same as email.'
        try:
            validate_email(email)
        except serializers.ValidationError:
            errorDict['email'] = "email is invalid."
        if errorDict:
            raise serializers.ValidationError(errorDict)
        return data

    def create(self, validated_data):
        # This creates the user using the validated data and automatically hashes the password
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate_email(self, value):
        return value.lower()


class UpdateInfoSerializer(serializers.ModelSerializer):
    old_email = serializers.EmailField(required=False)
    old_password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['old_email', 'old_password', 'email', 'password']

    def validate_password(self, value):
        if value:
            if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", value):
                raise serializers.ValidationError(
                    'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
                )
        return value

    def update(self, instance, validated_data):
        old_email = validated_data.get('old_email', None)
        old_password = validated_data.get('old_password', None)
        email = validated_data.get('email', None)
        password = validated_data.get('password', None)

        # Verify old email if email is being changed
        if email and instance.email != old_email:
            raise serializers.ValidationError({'old_email': 'Old email does not match'})

        # Verify old password if password is being changed
        if password and not instance.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Old password does not match'})

        if email:
            instance.email_pending = email
            send_verification_email(instance)

        if password:
            instance.set_password(password)
            send_password_reset_confirmation(instance)

        instance.save()
        return instance




class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'


class GroceryItemOptimizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItemOptimized
        fields = '__all__'

class GroceryItemUnoptimizedSerializer(serializers.ModelSerializer):
    subheading = serializers.PrimaryKeyRelatedField(queryset=Subheading.objects.all(), required=False)

    class Meta:
        model = GroceryItemUnoptimized
        fields = ['name', 'description', 'store', 'quantity', 'units', 'favorited', 'subheading', 'order']


    def create(self, validated_data):
        # Check if 'subheading' is provided
        subheading = validated_data.get('subheading')
        grocery = self.context.get('grocery')
        if not grocery:
            raise serializers.ValidationError("Grocery context is required to assign a default subheading.")

        item_id = validated_data.get('id')

        existing_item = GroceryItemUnoptimized.objects.filter(
            id=item_id,
            subheading__grocery=grocery,
            favorited=True  # Assuming this is a criterion for "favorited"
        ).exists()

        if existing_item:
            raise serializers.ValidationError("This favorited item already exists in the grocery list.")

        if not subheading:
            try:
                default_subheading, created = Subheading.objects.get_or_create(grocery=grocery, name='Default')
            except Exception as e:
                raise serializers.ValidationError(
                    f"An error occurred while retrieving or creating the default subheading: {str(e)}"
                )

            validated_data['subheading'] = default_subheading
        order = validated_data.get('order')
        if order is None:
            # Assign the next available order within the subheading
            last_item = GroceryItemUnoptimized.objects.filter(subheading=validated_data['subheading']).order_by(
                '-order').first()
            if last_item:
                validated_data['order'] = last_item.order + 1
            else:
                validated_data['order'] = 1  # Start ordering from 1

        # Call the parent class's create method to save the instance with the default or provided subheading
        return super().create(validated_data)

class SubheadingSerializer(serializers.ModelSerializer):
    items = GroceryItemUnoptimizedSerializer(many=True, read_only=True)
    recipe = RecipeSerializer(read_only=True)  # Optional: If you want to include recipe details

    class Meta:
        model = Subheading
        fields = ['id', 'name', 'order', 'recipe', 'items']

class GrocerySerializer(serializers.ModelSerializer):
    subheadings = SubheadingSerializer(many=True, read_only=True)

    class Meta:
        model = Grocery
        fields = ['id', 'name', 'creation_time', 'update_time', 'subheadings']

    def validate(self, attrs):
        user = self.context['request'].user
        if user.groups.filter(name='Guest').exists():
            if user.groceries.count() >= 1:
                raise serializers.ValidationError({
                    "error": "Guest User can only have 1 grocery list at a time"
                })
        return attrs

    def create(self, validated_data):
        grocery = Grocery.objects.create(**validated_data)
        return grocery

class RecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeItem
        fields = '__all__'


class FavoritedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritedItem
        fields = '__all__'


class DietRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietRestriction
        fields = '__all__'
