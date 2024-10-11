import collections

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers
from .models import User, Shopping, Recipe, FavoriteItem
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
import pandas as pd;

from .serializers import SaveShoppingListSerializer, SaveRecipeSerializer, FavoriteItemSerializer


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
        
class ShoppingListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        shopping_list_id = data.get('id', None)
        if shopping_list_id:
            shopping_list = get_object_or_404(Shopping, id=shopping_list_id)
            serializer = SaveShoppingListSerializer(shopping_list, data=data, partial=True)
        else:
            serializer = SaveShoppingListSerializer(data=data)
        if serializer.is_valid():
            shopping_list = serializer.save()
            user.shoppingLists.add(shopping_list)
            return Response({'message': 'Saved List successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        shopping_list_id = request.query_params.get('id', None)
        user = request.user

        if shopping_list_id:
            shoppingList = get_object_or_404(user.shoppingLists.all(), id=shopping_list_id)
            serializer = SaveShoppingListSerializer(shoppingList)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            shoppingLists = user.shoppingLists.all()
            serializer = SaveShoppingListSerializer(shoppingLists, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)        
    def delete(self, request):
        shopping_list_id = request.data.get('id', None)
        if not shopping_list_id:
            return Response({'error': 'Item ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_anonymous:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            shopping_list = get_object_or_404(Shopping, id=shopping_list_id)
            request.user.shoppingLists.remove(shopping_list)
            shopping_list.delete()
            return Response(status=status.HTTP_200_OK)
        except Shopping.DoesNotExist:
            return Response({'error': 'Item not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class RecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user
        recipeListID = data.get('id', None)
        if recipeListID:
            recipe = get_object_or_404(Recipe, id=recipeListID)
            serializer = SaveRecipeSerializer(recipe, data=data, partial=True)
        else:
            serializer = SaveRecipeSerializer(data=data)
        if serializer.is_valid():
            recipe = serializer.save()
            user.recipes.add(recipe)
            return Response({'message': 'Saved Recipe successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        recipeID = request.query_params.get('id', None)
        user = request.user

        if recipeID:
            recipe = get_object_or_404(user.recipes.all(), id=recipeID)
            serializer = SaveRecipeSerializer(recipe)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            recipes = user.recipes.all()
            serializer = SaveRecipeSerializer(recipes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request):
        recipe_id = request.data.get('id', None)
        if not recipe_id:
            return Response({'error': 'Item ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_anonymous:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            recipe = get_object_or_404(Shopping, id=recipe_id)
            request.user.recipes.remove(recipe)
            recipe.delete()
            return Response(status=status.HTTP_200_OK)
        except FavoriteItem.DoesNotExist:
            return Response({'error': 'Item not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class FavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        serializer = FavoriteItemSerializer(data=data)
        if serializer.is_valid():
            # Associate the favorite item with the current user
            favorite = serializer.save()
            user.favorites.add(favorite)
            return Response({"Message" : "Saved favorited item successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        item_id = request.data.get('id', None)
        if not item_id:
            return Response({'error': 'Item ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_anonymous:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Filter by `favorites` through the User model
            favorite_item = request.user.favorites.get(id=item_id)
            request.user.favorites.remove(favorite_item)
            favorite_item.delete()
            return Response(status=status.HTTP_200_OK)
        except FavoriteItem.DoesNotExist:
            return Response({'error': 'Item not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

'''
class ExportShoppingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shopping_list_id = request.query_params.get('id', None)
        user = request.user

        if shopping_list_id:
            shoppingList = get_object_or_404(user.shoppingLists.all(), id=shopping_list_id)
            serializer = SaveShoppingListSerializer(shoppingList)
            df = pd.DataFrame.from_records(serializer.data.values())
            df.to_excel('ExportedList.xlsx')
            return Response({'message': 'Export successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message','Unable to export: could not find shopping list'}, status=status.HTTP_400_BAD_REQUEST)
        
class ExportRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recipe_id = request.query_params.get('id', None)
        user = request.user

        if recipe_id:
            recipe = get_object_or_404(user.recipes.all(), id=recipe_id)
            serializer = SaveRecipeSerializer(recipe)
            df = pd.DataFrame.from_records(serializer.data.values())
            df.to_excel('ExportedList.xlsx')
            return Response({'message': 'Export successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message','Unable to export: could not find shopping list'}, status=status.HTTP_400_BAD_REQUEST)
'''
