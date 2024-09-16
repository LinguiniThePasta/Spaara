from allauth.headless.base.views import APIView
from django.shortcuts import render
import backend.backend.serializers as serializers


class RegisterView(APIView):
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return str(serializer.errors)
class LoginView(APIView):
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            # TODO: figure out JWT with this setup

        return str(serializer.errors)