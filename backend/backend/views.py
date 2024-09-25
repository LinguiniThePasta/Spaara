from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers


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
        if not serializer.is_valid(raise_exception=True):
            Response({'errors': e.detail}, status=status.HTTP_401_UNAUTHORIZED)
        user = authenticate(request, email=serializer.data['email'], password=serializer.data['password'])
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return str(serializer.errors)