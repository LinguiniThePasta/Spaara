import collections
import re

from rest_framework import serializers
from .models import User
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
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False, 'validators': []},
            'password': {'write_only': True, 'required': False},
        }
    def validate(self, data):
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        errorDict = collections.defaultdict(str)
        if username:
            if not re.match("^[a-zA-Z0-9_]*$", username):
                errorDict['username'] = 'Username can only contain alphanumeric characters.'
        if password:
            # Check if password is okay
            if not re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", password):
                errorDict['password'] = 'Password must have at least 8 characters, 1 uppercase character, 1 lowercase character, 1 number, and 1 special character.'
        if password == email:
            errorDict['password'] += 'Password cannot be the same as email.'
        if email:
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
        instance_username = validated_data.get('username', instance.username)
        instance_email = validated_data.get('email', instance.email)

        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        # Save the updated user instance
        instance.save()
        return instance