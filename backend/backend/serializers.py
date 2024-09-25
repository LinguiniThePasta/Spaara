import collections
import re

from rest_framework import serializers
from backend.backend.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if the username contains special characters
        if not re.match("^[a-zA-Z0-9_]*$", username):
            errorDict['username'] = 'Username can only contain alphanumeric characters.'
        # Check if password is okay
        if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
            errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
        # Email is already validated by Django, so no need to add that
        if errorDict is not None:
            raise serializers.ValidationError(errorDict)
        return data
    def create(self, validated_data):
        # This simply creates the user using validated data
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def validate(self, data):
        username = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        # Check if the username contains special characters
        if not re.match("^[a-zA-Z0-9_]*$", username):
            errorDict['username'] = 'Username can only contain alphanumeric characters.'
        # Check if password is okay
        if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
            errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
        # Email is already validated by Django, so no need to add that
        if errorDict is not None:
            raise serializers.ValidationError(errorDict)
        return data
