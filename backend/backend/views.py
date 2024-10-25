from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers
from .models import User, Grocery, Recipe, FavoritedItem, GroceryItemUnoptimized, GroceryItemOptimized, RecipeItem
from rest_framework.permissions import IsAuthenticated

from .serializers import GroceryItemUnoptimizedSerializer, GroceryItemOptimizedSerializer, RecipeItemSerializer, \
    FavoritedItemSerializer, RecipeSerializer, GrocerySerializer


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
        try:
            user = User.objects.get(email=serializer.data['email'])
            if user.check_password(serializer.data['password']):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            return Response({'error': ['Invalid credentials.']}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': ['Invalid credentials.']}, status=status.HTTP_401_UNAUTHORIZED)


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


class GroceryListViewSet(viewsets.ModelViewSet):
    queryset = Grocery.objects.all()
    serializer_class = GrocerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.groceryLists.all()

    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            grocery_list = serializer.save(user=user)
            user.groceryLists.add(grocery_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroceryItemOptimizedViewSet(viewsets.ModelViewSet):
    queryset = GroceryItemOptimized.objects.all()
    serializer_class = GroceryItemOptimizedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        grocery_id = self.request.query_params.get('list_id')

        if grocery_id:
            queryset = queryset.filter(list_id=grocery_id)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        grocery_list_id = data.get('list_id')

        grocery_list = Grocery.objects.get(pk=grocery_list_id)

        serializer = self.get_serializer(grocery_list)
        if serializer.is_valid():
            serializer.save(list=grocery_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        item = self.get_object()
        item.favorited = not item.favorited
        item.save()
        return Response(self.get_serializer(item).data)


class GroceryItemUnoptimizedViewSet(viewsets.ModelViewSet):
    queryset = GroceryItemUnoptimized.objects.all()
    serializer_class = GroceryItemUnoptimizedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        grocery_id = self.request.query_params.get('list_id')

        if grocery_id:
            queryset = queryset.filter(list_id=grocery_id)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        grocery_list_id = data.get('list_id')
        grocery_list = get_object_or_404(Grocery, id=grocery_list_id)

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(list=grocery_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        item = self.get_object()
        item.favorited = not item.favorited
        item.save()
        return Response(self.get_serializer(item).data)


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecipeItemViewSet(viewsets.ModelViewSet):
    queryset = RecipeItem.objects.all()
    serializer_class = RecipeItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        recipe_id = self.request.query_params.get('recipe_id')

        if recipe_id:
            queryset = queryset.filter(list_id=recipe_id)

        return queryset

    def create(self, request, *args, **kwargs):
        recipe_id = request.data.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(recipe=recipe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        item = self.get_object()
        item.favorited = not item.favorited
        item.save()
        return Response(self.get_serializer(item).data)


class FavoritedItemViewSet(viewsets.ModelViewSet):
    queryset = FavoritedItem.objects.all()
    serializer_class = FavoritedItemSerializer
    permission_classes = [IsAuthenticated]