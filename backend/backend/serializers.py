import collections
import re

from rest_framework import serializers
from .models import User, Grocery, Recipe, FavoritedItem, RecipeItem, GroceryItemUnoptimized, GroceryItemOptimized
from django.core.validators import validate_email
import uuid


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if password is okay
        if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
            errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
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
            username=uuid.uuid4().hex[:20],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


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
            instance.email = email
            instance.username = email  # Assuming username is the same as email

        if password:
            instance.set_password(password)

        instance.save()
        return instance

class GrocerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Grocery
        fields = '__all__'
    def validate(self, attrs):
        user = self.context['request'].user
        if user.groups.filter(name='Guest').exists():
            if user.groceryLists.count() >= 1:
                raise serializers.ValidationError({
                    "error": "Guest User can only have 1 grocery list at a time"
                })
        return attrs

    def create(self, validated_data):
        # Remove any fields that aren't accepted by Grocery.objects.create()
        # If 'user' is passed as part of validated data, remove it here
        validated_data.pop('user', None)  # Adjust as needed

        # Create the grocery instance with the remaining valid fields
        grocery = Grocery.objects.create(**validated_data)

        return grocery
class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'
class GroceryItemOptimizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItemOptimized
        fields = '__all__'

class GroceryItemUnoptimizedSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItemUnoptimized
        fields = '__all__'


class RecipeItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeItem
        fields = '__all__'


class FavoritedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritedItem
        fields = '__all__'