import collections
import re

from rest_framework import serializers
from .models import User, Shopping, Recipe, FavoriteItem
from django.core.validators import validate_email


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def validate(self, data):
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if the username contains special characters
        if not re.match("^[a-zA-Z0-9_]*$", username):
            errorDict['username'] = 'Username can only contain alphanumeric characters.'
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
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if password is okay
        if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
            errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
        try:
            validate_email(email)
        except serializers.ValidationError:
            errorDict['email'] = "email is invalid."
        if errorDict:
            raise serializers.ValidationError(errorDict)
        return data


class UpdateInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'latitude', 'longitude', 'radius']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False, 'validators': []},
            'password': {'write_only': True, 'required': False},
            'radius': {'required': False},
            'latitude': {'required': False},
            'longitude': {'required': False},
        }
    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        if username and username != "":
            if not re.match("^[a-zA-Z0-9_]*$", username):
                errorDict['username'] = 'Username can only contain alphanumeric characters.'
        if password and password != "":
            # Check if password is okay
            if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
                errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
            if email and email != "" and password == email:
                errorDict['password'] += 'Password cannot be the same as email.'
        if email and email != "":
            try:
                validate_email(email)
            except serializers.ValidationError:
                errorDict['email'] = "email is invalid."
            if User.objects.exclude(pk=self.instance.pk).filter(email=email).exists():
                errorDict['email'] += "Email already exists."
        if errorDict:
            raise serializers.ValidationError(errorDict)
        return data
    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.radius = validated_data.get('radius', instance.radius)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        # Save the updated user instance
        instance.save()
        return instance

class SaveShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shopping
        fields = ['id', 'name', 'content']
        extra_kwargs = {
            'id': {'read_only': True, 'required': False},
        }
    def create(self, validated_data):
        shoppingList = Shopping.objects.create(**validated_data)
        return shoppingList
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

class SaveRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['id', 'name', 'content']
        extra_kwargs = {
            'id': {'read_only': True, 'required': False},
        }
    def create(self, validated_data):
        recipe = Recipe.objects.create(**validated_data)
        return recipe
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
    
class FavoriteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteItem
        fields = ['id', 'name', 'price', 'store']
        extra_kwargs = {
            'id': {'read_only': True, 'required': False},
        }
    def create(self, validated_data):
        favoritedItem = FavoriteItem.objects.create(**validated_data)
        return favoritedItem