import collections
import re

from rest_framework import serializers
from .models import User, Grocery, Recipe, FavoritedItem, RecipeItem, GroceryItemUnoptimized, GroceryItemOptimized, \
    DietRestriction
from django.core.validators import validate_email


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
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UpdateInfoSerializer(serializers.ModelSerializer):
    # TODO: Change this so that email and password can be changed separately
    pass

class GrocerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Grocery
        fields = '__all__'

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

class DietRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietRestriction
        fields = '__all__'