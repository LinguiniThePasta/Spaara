from django.contrib.auth.models import Group
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from . import serializers
from .models import User, Grocery, Recipe, FavoritedItem, GroceryItemUnoptimized, GroceryItemOptimized, RecipeItem, \
    DietRestriction, Subheading
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
        '''
        Registers a new user with the provided data and sends a verification email.

        :param:
            request (Request): The incoming request containing user registration data.

        :return:
            Response: A success message indicating the user was registered, with status 201 on success,
                      or validation error details with status 400 if validation fails.

        registration details:
            - Uses RegisterSerializer to validate user data.
            - If valid, saves the user and sends a verification email.

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        email: user email,
                        password: user password
                    }
        '''
        serializer = serializers.RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            send_verification_email(user)
            return Response({'message': 'User registered successfully. Please check your email to verify your account.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        '''
        Verifies the email address using a unique user ID and token.

        :param:
            request (Request): The incoming request.
            uidb64 (str): Base64 encoded user ID.
            token (str): Token for email verification.

        :return:
            Response: Success or error message depending on the verification status.

        verification details:
            - Decodes the user ID from uidb64.
            - Checks the token for email verification.
            - Activates the user if verification is successful or updates the email if pending.

        usage:
            - GET {URL}/{uidb64}/{token}/ - verifies the user's email with the provided token
        '''
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
        '''
        Deletes the authenticated user account.

        :param:
            request (Request): The incoming request containing the user to be deleted.

        :return:
            Response: A message confirming the user deletion or an error message if deletion fails.

        deletion details:
            - Deletes the user based on the authenticated user ID.
            - Sends a confirmation email upon successful deletion.

        usage:
            - DELETE {URL}/ - deletes the authenticated user's account
        '''
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
        '''
        Authenticates a user with email and password or logs in a guest user if requested.

        :param:
            request (Request): The incoming request containing login data, with an optional 'guest' flag.

        :return:
            Response: Access and refresh tokens if login is successful, or error details if login fails.

        login details:
            - Checks for 'guest' in request data to log in a guest user.
            - Authenticates registered users with email and password.
            - Checks if the user is active before granting tokens.

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        email: user email,
                        password: user password,
                        guest (optional): boolean flag for guest login
                    }
        '''
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
    '''
    APIView for managing user settings, including dietary restrictions, max distance, and max stores.
    Allows updating and retrieving the settings for the authenticated user.
    permission_classes = [IsAuthenticated]
    '''
    def post(self, request):
        '''
        Updates the settings for the authenticated user, including dietary restrictions, max distance, and max stores.

        :param:
            request (Request): The incoming request containing 'user_restrictions', 'max_distance', and 'max_stores'.

        :return:
            Response: A message indicating successful update with status 200 on success,
                      or error details with status 400 if validation fails.

        update details:
            - Retrieves 'user_restrictions' from request data, which should be a list of dietary restriction IDs.
            - Filters and sets the user's dietary restrictions based on valid IDs.
            - Updates 'max_distance' and 'max_stores' based on the provided values, applying validation to ensure they are non-negative.

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        user_restrictions: [list of dietary restriction IDs],
                        max_distance (optional): maximum distance in miles (default: 5.00),
                        max_stores (optional): maximum number of stores (default: 3)
                    }
        '''

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
        '''
        Retrieves the settings for the authenticated user, including their current dietary restrictions,
        max distance, and max stores, along with all available dietary restrictions.

        :param:
            request (Request): The incoming request; does not require any data parameters.

        :return:
            Response: A dictionary containing user-specific settings and all available dietary restrictions.

        retrieval details:
            - Returns the IDs of the user's dietary restrictions.
            - Returns all available dietary restrictions as serialized data.
            - Returns the user's max distance and max stores.

        usage:
            - GET {URL} - retrieves the user's current settings and all dietary restrictions
        '''
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
        '''
        Retrieves the queryset of grocery lists belonging to the authenticated user.
        '''
        user = self.request.user
        return user.groceries.all()

    def create(self, request, *args, **kwargs):
        '''
        Creates a new grocery list associated with the authenticated user.
        '''
        user = request.user
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='add_recipe')
    def add_recipe(self, request, pk=None):
        """
        Adds a recipe to a specified grocery list, creating a new subheading for the recipe
        if it does not already exist in the grocery list. This allows users to organize grocery
        items by recipe within a list.

        :param:
            request (Request): The incoming request containing the 'recipe_id' in the data,
            which identifies the recipe to be added to the grocery list.
            pk (UUID): The primary key of the grocery list to which the recipe will be added.

        :return:
            Response: A success message and HTTP 200 status if the recipe was added successfully,
            or an error message with the appropriate HTTP status if the request is invalid or
            the recipe already exists in the grocery list.

        addition details:
            - Validates that the recipe belongs to the authenticated user.
            - Checks if the recipe is already added to the grocery list; if so, returns an error.
            - If valid, creates a new subheading in the grocery list with the recipe's name
              and adds all items from the recipe to the grocery list under the new subheading.

        usage:
            - POST {URL}/{grocery_list_id}/add_recipe/
                - data (dict):
                    {
                        "recipe_id": <UUID>  # The ID of the recipe to be added
                    }
        """
        grocery = self.get_object()
        recipe_id = request.data.get('recipe_id')

        if not recipe_id:
            return Response({"error": "recipe_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate recipe ownership
        try:
            recipe = Recipe.objects.get(id=recipe_id, user=request.user)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe does not exist or does not belong to the user."},
                            status=status.HTTP_404_NOT_FOUND)

        # Use the service to add the recipe
        try:
            self.add_recipe_to_grocery(grocery, recipe)
            return Response({"success": "Recipe added successfully."}, status=status.HTTP_200_OK)
        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='reorder_subheadings')
    def reorder_subheadings(self, request, pk=None):
        """
        Reorders the subheadings within a specified grocery list according to the order
        provided in the request. Allows users to customize the organization of their
        grocery list's sections.

        :param:
            request (Request): The incoming request containing 'subheadings_order',
            a list of subheading IDs arranged in the desired order.
            pk (UUID): The primary key of the grocery list whose subheadings are being reordered.

        :return:
            Response: A success message and HTTP 200 status if the subheadings were reordered
            successfully, or an error message with the appropriate HTTP status if the request
            is invalid or if one or more subheadings do not exist in the grocery list.

        reordering details:
            - Validates that each subheading ID belongs to the specified grocery list.
            - Updates the 'order' field of each subheading to match its position in
              the 'subheadings_order' list.
            - Ensures atomicity of the operation, so no changes are saved if any errors occur.

        usage:
            - POST {URL}/{grocery_list_id}/reorder-subheadings/
                - data (dict):
                    {
                        "subheadings_order": [<UUID>, <UUID>, ...]  # List of subheading IDs in desired order
                    }
        """
        grocery = self.get_object()
        subheadings_order = request.data.get('subheadings_order')

        if not isinstance(subheadings_order, list):
            return Response({"error": "subheadings_order must be a list of subheading IDs."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for index, subheading_id in enumerate(subheadings_order, start=1):
                    subheading = Subheading.objects.get(id=subheading_id, grocery=grocery)
                    subheading.order = index
                    subheading.save()
            return Response({"success": "Subheadings reordered successfully."}, status=status.HTTP_200_OK)
        except Subheading.DoesNotExist:
            return Response({"error": "One or more subheadings do not exist in this grocery list."},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An error occurred while reordering subheadings."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='reorder-items')
    def reorder_items(self, request, pk=None):
        '''
        Reorders the items within a specified subheading in a grocery list based on
        the provided order. Allows users to organize items within a subheading
        according to their preferred sequence.

        :param:
            request (Request): The incoming request containing 'items_order', a list of
            dictionaries with each dictionary specifying 'item_id' and 'order' to define
            the desired order for each item.
            pk (UUID): The primary key of the grocery list containing the subheading
            whose items are being reordered.

        :return:
            Response: A success message and HTTP 200 status if the items are reordered
            successfully, or an error message with the appropriate HTTP status if the
            request is invalid, if any items do not exist in the specified grocery list,
            or if 'items_order' is not correctly formatted.

        reordering details:
            - Validates that each item ID in 'items_order' belongs to the specified grocery list.
            - Updates the 'order' field of each item to match the specified order in
              the 'items_order' list.
            - Executes the reordering operation atomically to prevent partial updates.

        usage:
            - POST {URL}/{grocery_list_id}/reorder-items/
                - data (list of dicts):
                    [
                        {"item_id": <UUID>, "order": 1},
                        {"item_id": <UUID>, "order": 2},
                        ...
                    ]  # Specifies each item's ID and its new order within the subheading
        '''
        grocery = self.get_object()
        items_order = request.data.get('items_order')

        if not isinstance(items_order, list):
            return Response({"error": "items_order must be a list of item order mappings."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                for item_data in items_order:
                    item_id = item_data.get('item_id')
                    order = item_data.get('order')
                    if not item_id or not isinstance(order, int):
                        raise ValidationError("Each item must have an 'item_id' and an integer 'order'.")
                    item = GroceryItemUnoptimized.objects.get(id=item_id, grocery=grocery)
                    item.order = order
                    item.save()
            return Response({"success": "Items reordered successfully."}, status=status.HTTP_200_OK)
        except GroceryItemUnoptimized.DoesNotExist:
            return Response({"error": "One or more items do not exist in this grocery list."},
                            status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as ve:
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An error occurred while reordering items."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def add_recipe_to_grocery(self, grocery, recipe):
        """
        Adds a recipe to a grocery list by creating a subheading and associated items.
        Prevents adding the same recipe multiple times to the same grocery list.
        """
        # Check if the recipe is already added via Subheading
        if Subheading.objects.filter(grocery=grocery, recipe=recipe).exists():
            raise ValidationError("This recipe has already been added to the grocery list.")

        try:
            with transaction.atomic():
                # Create Subheading
                subheading = Subheading.objects.create(
                    name=recipe.name,
                    grocery=grocery,
                    recipe=recipe,
                    order=self.calculate_next_subheading_order(grocery)
                )

                # Add RecipeItems to the Grocery list under the new Subheading
                recipe_items = recipe.items.all()
                for index, item in enumerate(recipe_items, start=1):
                    GroceryItemUnoptimized.objects.create(
                        id=item.id,
                        name=item.name,
                        description=item.description,
                        store=item.store,
                        quantity=item.quantity,
                        units=item.units,
                        favorited=item.favorited,
                        subheading=subheading,
                        order=index
                    )
        except Exception as e:
            raise ValidationError(f"An error occurred while adding the recipe: {str(e)}")

    def calculate_next_subheading_order(self, grocery):
        last_subheading = grocery.subheadings.order_by('-order').first()
        return last_subheading.order + 1 if last_subheading else 1


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
        '''
        Toggles the 'favorited' status of a recipe item.

        :param:
            request (Request): The incoming request; does not require any data parameters.
            pk (int): The primary key of the recipe item to toggle favorite status.

        :return:
            Response: Contains the serialized data of the updated recipe item after toggling 'favorited' status.

        action details:
            - Retrieves the grocery item instance specified by the primary key.
            - Toggles its 'favorited' attribute.
            - Saves the updated instance and returns the updated data.

        usage:
            - POST {URL}/{item_id}/favorite - toggles the favorite status of items
        '''
        item = self.get_object()
        item.favorited = not item.favorited
        item.save()
        return Response(self.get_serializer(item).data)


class GroceryItemUnoptimizedViewSet(viewsets.ModelViewSet):

    queryset = GroceryItemUnoptimized.objects.all()
    serializer_class = GroceryItemUnoptimizedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        '''
        Retrieves the queryset of unoptimized grocery items across all subheadings in a specified grocery list.

        :return:
            QuerySet: A queryset of GroceryItemUnoptimized instances filtered by the grocery list's subheadings.

        usage:
            - GET {URL}?list={list_id} - retrieves all grocery items across subheadings associated with a specific grocery list
        '''
        grocery_id = self.request.query_params.get('list')
        if grocery_id:
            # Filter items by subheadings belonging to the specified grocery list
            return GroceryItemUnoptimized.objects.filter(subheading__grocery__id=grocery_id)

        # If no 'list' parameter is provided, retrieve all items
        return GroceryItemUnoptimized.objects.all()

    def destroy(self, request, *args, **kwargs):
        '''
        Deletes a specific recipe item, validated by both recipe ID and item ID.

        :param:
            request (Request): The incoming request containing user data.
            args, kwargs: Additional arguments and keyword arguments.

        :return:
            Response: Success message upon successful deletion, or error if not found.

        deletion details:
            - Retrieves the item based on both recipe_id and item_id to ensure ownership.
        '''
        grocery_id = request.query_params.get('list')
        item_id = kwargs.get('pk')

        # Ensure both recipe_id and item_id are provided
        if not grocery_id or not item_id:
            return Response(
                {'error': 'Recipe ID and Item ID must be provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if item exists and belongs to the specified recipe
        item = get_object_or_404(GroceryItemUnoptimized, id=item_id, list=grocery_id)

        # Proceed with deletion
        item.delete()
        return Response({'message': 'Recipe item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        '''
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

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        name: name of the item
                        store (optional): the store where the grocery item is stored
                        description (optional): description of the item
                        quantity: the number of items
                        units: unit
                        list: the id of the grocery list
                    }
        '''

        # Retrieve the grocery list from request data
        grocery_list_id = request.data.get('list')
        grocery = get_object_or_404(Grocery, id=grocery_list_id)

        # Pass the grocery instance in the context
        serializer = self.get_serializer(data=request.data, context={'grocery': grocery})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        '''
        Toggles the 'favorited' status of a grocery item, ensuring it belongs to the specified grocery list.

        :param:
            request (Request): The incoming request; expects 'list' parameter with the grocery list ID.
            pk (UUID): The primary key of the grocery item to toggle favorite status.

        :return:
            Response: Contains the serialized data of the updated grocery item after toggling 'favorited' status,
                      or an error if the item does not belong to the specified grocery list.

        usage:
            - POST {URL}/{item_id}/favorite?list={grocery_list_id} - toggles the favorite status of items within the specified grocery list
        '''
        grocery_id = request.query_params.get('list')
        if not grocery_id:
            return Response({"error": "'list' parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to retrieve the item within the specified grocery list
        try:
            item = GroceryItemUnoptimized.objects.get(pk=pk, subheading__grocery__id=grocery_id)
        except GroceryItemUnoptimized.DoesNotExist:
            return Response({"error": "Item not found in the specified grocery list."},
                            status=status.HTTP_404_NOT_FOUND)

        # Toggle the 'favorited' status
        item.favorited = not item.favorited
        item.save()
        return Response(self.get_serializer(item).data)


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        '''
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
        '''
        queryset = super().get_queryset()
        user = self.request.user

        if user:
            return Recipe.objects.filter(user=user)

        return queryset

    def create(self, request):
        '''
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

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        name: name of the recipe
                    }
        '''
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
        '''
        Retrieves the queryset of recipe items, optionally filtered by recipe ID.

        :return:
            QuerySet: A queryset of RecipeItem instances, filtered by the 'recipe_id' parameter
                      if provided in the request query params.

        query details:
            - Retrieves all recipe items by default.
            - If 'recipe_id' is provided as a query parameter, filters items by the specified recipe ID.

        usage:
            - GET {URL} - retrieves all recipe items
            - GET {URL}?recipe_id={recipe_id} - retrieves all recipe items associated with a specific recipe
        '''
        queryset = super().get_queryset()
        recipe_id = self.request.query_params.get('recipe_id')

        if recipe_id:
            queryset = queryset.filter(recipe__id=recipe_id)

        return queryset

    def create(self, request, *args, **kwargs):
        '''
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

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        name: name of the recipe item
                        description (optional): description of the recipe item
                        quantity: quantity required for the recipe item
                        units: units of the quantity
                        recipe_id: the id of the recipe this item belongs to
                    }
        '''
        recipe_id = request.data.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id, user=request.user)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(recipe=recipe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        '''
        Toggles the 'favorited' status of a recipe item.

        :param:
            request (Request): The incoming request; does not require any data parameters.
            pk (int): The primary key of the recipe item to toggle favorite status.

        :return:
            Response: Contains the serialized data of the updated recipe item after toggling 'favorited' status.

        action details:
            - Retrieves the recipe item instance specified by the primary key.
            - Toggles its 'favorited' attribute.
            - Saves the updated instance and returns the updated data.

        usage:
            - POST {URL}/{item_id}/favorite - toggles the favorite status of items
        '''
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
        '''
        Adds a favorited item to a specified shopping list.

        :param:
            request (Request): The incoming request containing 'list' with the ID of the target grocery list.
            pk (int): The primary key of the favorited item to add to the shopping list.

        :return:
            Response: Contains the serialized data of the added grocery item with status 201 on success,
                      or error details with status 400 if validation fails.

        action details:
            - Retrieves the favorited item specified by the primary key.
            - Creates a new grocery item based on the favorited item data and associates it with the specified grocery list.

        usage:
            - POST {URL}/{grocery_list_id}/add_to_shopping_list/
                - data (dict):
                    {
                        list: id of the grocery list
                    }
        '''

        grocery_id = request.data["list"]
        favorited_item = self.get_object()
        grocery = Grocery.objects.all().filter(id=grocery_id).get()
        default_subheading, created = Subheading.objects.get_or_create(grocery=grocery, name="Default")

        data = {
            'id': favorited_item.id,
            'name': favorited_item.name,
            'quantity': 1,
            'units': 'units',
            'favorited': True,
            'description': favorited_item.description,
            'store': favorited_item.store,
            'list': grocery.id,
            'subheading': default_subheading.id
        }

        serializer = GroceryItemUnoptimizedSerializer(data=data)
        if serializer.is_valid():
            grocery_item = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_to_recipe(self, request, pk=None):
        '''
        Adds a favorited item to a specified recipe.

        :param:
            request (Request): The incoming request containing 'list' with the ID of the target recipe.
            pk (int): The primary key of the favorited item to add to the recipe.

        :return:
            Response: Contains the serialized data of the added recipe item with status 201 on success,
                      or error details with status 400 if validation fails.

        action details:
            - Retrieves the favorited item specified by the primary key.
            - Creates a new recipe item based on the favorited item data and associates it with the specified recipe.

        usage:
            - POST {URL}/{recipe_id}/add_to_shopping_list/
                - data (dict):
                    {
                        list: id of the grocery list
                    }
        '''
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
