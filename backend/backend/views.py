import collections

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers
from .models import User, GroceryList, GroceryItem
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required

class RegisterView(APIView):
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)

        # Check if the serializer is valid and return errors if not
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using email and password
        user = User.objects.get(email=serializer.data['email'])
        if user is not None and user.check_password(serializer.data['password']):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        serializer = serializers.UpdateInfoSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Information Changed successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GROCERY LIST SAVING AND LOADING
class SaveListView(APIView):
    permission_classes = [IsAuthenticated]

    # Save list
    def get(self, request):
        grocery_list_data = request.data.get('grocery_list')
        grocery_list_serializer = serializers.GroceryListSerializer(data=grocery_list_data)

        if grocery_list_serializer.is_valid():
            grocery_list = grocery_list_serializer.save(user = request.user)

            items_data = request.data.get('items', [])
            for item_data in items_data:
                item_serializer = serializers.GroceryItemSerializer(data=item_data)
                if item_serializer.is_valid():
                    item_serializer.save(grocery_list=grocery_list)  # Associate item with the grocery list
                else:
                    return Response(item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    
            return Response(grocery_list_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(grocery_list_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoadListView(APIView):
    permission_classes = [IsAuthenticated]

    # Load list
    def post(self, request):
        def get(self, request, name):
            try:
                # Load the grocery list by name
                grocery_list = GroceryList.objects.get(name=name, user=request.user)  # Ensure it belongs to the logged-in user
                items = grocery_list.items.all()  # Get all items associated with this list
                
                # Serialize the data
                grocery_list_data = {
                    'name': grocery_list.name,
                    'created_at': grocery_list.created_at,
                    'items': [{'name': item.name, 'price': item.price, 'store': item.store} for item in items]
                }
                return Response(grocery_list_data, status=status.HTTP_200_OK)
            except GroceryList.DoesNotExist:
                return Response({'error': 'Grocery list not found'}, status=status.HTTP_404_NOT_FOUND)



