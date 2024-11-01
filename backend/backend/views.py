from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers
from .models import User, Grocery, Recipe, FavoritedItem, GroceryItemUnoptimized, GroceryItemOptimized, RecipeItem, \
    DietRestriction
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import GroceryItemUnoptimizedSerializer, GroceryItemOptimizedSerializer, RecipeItemSerializer, \
    FavoritedItemSerializer, RecipeSerializer, GrocerySerializer, DietRestrictionSerializer
from .utils import send_verification_email, send_delete_confirmation_email
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
import uuid
import rest_framework.mixins as mixins


class RegisterView(APIView):
    def post(self, request):
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email(user)
            return Response({'message': 'User registered successfully. Please check your email to verify your account.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if user.is_active and user.email_pending is not None:
                user.email = user.email_pending
                user.email_pending = ''
                user.save()
                return Response({'message': 'Email updated successfully'}, status=status.HTTP_200_OK)
            elif user.is_active and (user.email_pending is None or user.email == user.email_pending):
                return Response({'message': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.is_active = True
                user.save()
                return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)



class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        email = user.email
        try:
            User.objects.filter(id=user.id).delete()
            send_delete_confirmation_email(email)
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        except:
            return Response({'message': 'Error in deletion'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        if request.data.get('guest', False):
            return self.login_guest_user()

        serializer = serializers.LoginSerializer(data=request.data)

        # Check if the serializer is valid and return errors if not
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using email and password
        try:
            user = User.objects.get(email__iexact=serializer.validated_data['email'])
            if user.check_password(serializer.data['password']):
                if(user.is_active == False):
                    return Response({'error': ['Email must be verified before logging in.']}, status=status.HTTP_401_UNAUTHORIZED)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                })
            return Response({'error': ['Invalid credentials.']}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': ['Invalid credentials.']}, status=status.HTTP_401_UNAUTHORIZED)

    def login_guest_user(self):
        uuid_guest = uuid.uuid4().hex[:20]
        guest_group, _ = Group.objects.get_or_create(name='Guest')
        guest_user = User.objects.create(
            username=f"guest_{uuid_guest}",
            email=f"{uuid_guest}@example.com",
        )
        guest_user.set_unusable_password()
        guest_user.groups.add(guest_group)
        guest_user.save()

        refresh = RefreshToken.for_user(guest_user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': guest_user.username,
        }, status=status.HTTP_201_CREATED)


class SettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_restrictions = request.data.get('user_restrictions', [])
        restrictions = DietRestriction.objects.filter(id__in=user_restrictions)

        if restrictions is None:
            return Response(
                {"error": "Invalid dietary restrictions provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        max_distance = request.data.get('max_distance', 5.00)
        if max_distance < 0:
            return Response(
                {"error": "Invalid distance provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        max_stores = request.data.get('max_stores', 3)
        if max_stores < 0:
            return Response(
                {"error": "Invalid store number provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.diet_restrictions.set(restrictions.all())
        user.max_distance = max_distance
        user.max_stores = max_stores
        user.save()

        return Response(
            {"message": "Settings updated successfully."},
            status=status.HTTP_200_OK
        )

    def get(self, request):
        user = request.user

        user_restrictions = user.diet_restrictions.all()

        all_restrictions = DietRestriction.objects.all()
        all_restrictions_serialized = DietRestrictionSerializer(all_restrictions, many=True).data

        return Response(
            {
                "user_restrictions": [restriction.id for restriction in user_restrictions],
                "all_restrictions": all_restrictions_serialized,
                "max_distance": user.max_distance,
                "max_stores": user.max_stores,
            },
            status=status.HTTP_200_OK
        )


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
        return user.groceries.all()

    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroceryItemOptimizedViewSet(viewsets.ModelViewSet):
    queryset = GroceryItemOptimized.objects.all()
    serializer_class = GroceryItemOptimizedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        grocery_id = self.request.query_params.get('list')

        if grocery_id:
            queryset = queryset.filter(list=grocery_id)

        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        grocery_list_id = data.get('list')

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
        grocery_id = self.request.query_params.get('list')

        if grocery_id:
            queryset = queryset.filter(list=grocery_id)
        else:
            queryset = queryset.filter(list=None)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Creates a new unoptimized grocery item associated with a specific grocery list.

        :param:
            request (Request): The incoming request, expected to contain 'list' as part of the data.

        :return:
            Response: Contains the serialized data of the newly created grocery item with status 201 on success,
                      or error details with status 400 if validation fails.

        creation details:
            - Retrieves the 'list' from request data, which is the grocery list to associate the item with.
            - Validates the data using the serializer.
            - If valid, saves the grocery item with the specified grocery list and returns the created item data.
            - If invalid, returns error messages.
        """
        data = request.data
        grocery_list_id = data.get('list')
        grocery_list = get_object_or_404(Grocery, id=grocery_list_id)

        serializer = self.get_serializer(data=data)
        print(serializer)
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

    """
    Retrieves the queryset of recipe items, optionally filtered by recipe ID.

    :param:
        None

    :return:
        QuerySet: A queryset of RecipeItem instances, filtered by the 'recipe_id' parameter
                  if provided in the request query params.

    query details:
        - Retrieves all recipe items by default.
        - If 'recipe_id' is provided as a query parameter, filters items by the specified recipe ID.

    usage:
        - GET {URL} - retrieves all recipe items
        - GET {URL}?recipe_id={recipe_id} - retrieves all recipe items associated with a specific recipe
        - POST {URL}/
            - data (dict):
                {
                    name: name of the recipe
                }
    """

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user:
            queryset = queryset.filter(user=user.id)

        return queryset

    def create(self, request):
        """
        Creates a new recipe item associated with a specific recipe.

        :param:
            request (Request): The incoming request, expected to contain 'recipe_id' as part of the data.

        :return:
            Response: Contains the serialized data of the newly created recipe item with status 201 on success,
                      or error details with status 400 if validation fails.

        creation details:
            - Retrieves the 'recipe_id' from request data, which is the recipe to associate the item with.
            - Validates the data using the serializer.
            - If valid, saves the recipe item with the specified recipe and returns the created item data.
            - If invalid, returns error messages.
        """
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
        """
        Retrieves the queryset of recipe items, optionally filtered by recipe ID.

        :param:
            None

        :return:
            QuerySet: A queryset of RecipeItem instances, filtered by the 'recipe_id' parameter
                      if provided in the request query params.

        query details:
            - Retrieves all recipe items by default.
            - If 'recipe_id' is provided as a query parameter, filters items by the specified recipe ID.

        usage:
            - GET {URL} - retrieves all recipe items
            - GET {URL}?recipe_id={recipe_id} - retrieves all recipe items associated with a specific recipe
            - POST {URL}/
                - data (dict):
                    {
                        name: name of the recipe item
                        ingredient (optional): ingredient used in the recipe item
                        description (optional): description of the recipe item
                        quantity: quantity required for the recipe item
                        units: units of the quantity
                        recipe_id: the id of the recipe this item belongs to
                    }
        """


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

class FavoritedItemViewSet(mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.ListModelMixin,
                           viewsets.GenericViewSet):
    queryset = FavoritedItem.objects.all()
    serializer_class = FavoritedItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        user_id = request.user

        user = get_object_or_404(User, id=user_id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_to_shopping_list(self, request, pk=None):
        grocery_id = request.data["list"]
        favorited_item = self.get_object()
        grocery = Grocery.objects.all().filter(id=grocery_id).get()
        data = {
            'name': favorited_item.name,
            'quantity': 1,
            'units': 'units',
            'favorited': True,
            'description': favorited_item.description,
            'store': favorited_item.store,
            'list': grocery.id
        }

        serializer = GroceryItemUnoptimizedSerializer(data=data)
        if serializer.is_valid():
            data['list'] = grocery
            GroceryItemUnoptimized.objects.update_or_create(
                id=favorited_item.id,
                defaults=data
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['post'])
    def add_to_recipe(self, request, pk=None):
        recipe_id = request.data["list"]
        favorited_item = self.get_object()
        recipe = Recipe.objects.all().filter(id=recipe_id).get()
        data = {
            'name': favorited_item.name,
            'quantity': 1,
            'units': 'units',
            'favorited': True,
            'description': favorited_item.description,
            'store': favorited_item.store,
            'list': recipe.id
        }

        serializer = RecipeItemSerializer(data=data)
        if serializer.is_valid():
            data['list'] = recipe
            RecipeItem.objects.update_or_create(
                id=favorited_item.id,
                defaults=data
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
