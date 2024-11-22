import collections

from django.contrib.auth.models import Group
from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank
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
    DietRestriction, Subheading, FriendRequest, StoreItem
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import GroceryItemUnoptimizedSerializer, GroceryItemOptimizedSerializer, RecipeItemSerializer, \
    FavoritedItemSerializer, RecipeSerializer, GrocerySerializer, DietRestrictionSerializer, FriendRequestSerializer, \
    SubheadingSerializer, StoreItemSerializer
from .utils import *
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
import uuid
import rest_framework.mixins as mixins
import os
import requests
from dotenv import load_dotenv
from django.conf import settings

load_dotenv()


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
            return Response(
                {'message': 'User registered successfully. Please check your email to verify your account.'},
                status=status.HTTP_201_CREATED)
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


class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = serializers.EmailSerializer(data=request.data)
        if not serializer.is_valid():
            # print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email__iexact=serializer.validated_data['email'])
        except User.DoesNotExist:
            user = None

        if user is not None:
            send_account_recovery_email(user)
            return Response({'message': 'Email is linked to an account'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Email is not linked to an account'}, status=status.HTTP_400_BAD_REQUEST)


class OtherUsersView(APIView):
    permission_classes = [IsAuthenticated]

    # TODO: Get all existing users and return them as a list of dictionaries with their email and username 
    def get(self, request):
        '''
        Retrieves a list of all existing users, excluding the authenticated user.

        :param:
            request (Request): The incoming request; does not require any data parameters.

        :return:
            Response: A list of dictionaries containing user email and username.

        retrieval details:
            - Retrieves all users except the authenticated user.
            - Serializes the user data to return a list of dictionaries with user email and username.

        usage:
            - GET {URL} - retrieves all existing users
        '''
        users = User.objects.exclude(id=request.user.id)
        data = [{'id': user.id, 'username': user.username} for user in users]
        return Response(data, status=status.HTTP_200_OK)


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


class FriendRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    # GET METHODS 
    # GET /api/friend_requests/count
    # Returns the number of pending friend requests for the authenticated user. 
    @action(detail=False, methods=['get'])
    def count(self, request):
        count = FriendRequest.objects.filter(to_user=request.user).count()
        return Response({'count': count}, status=status.HTTP_200_OK)

    # GET /api/friend_requests/incoming
    # Returns a list of incoming friend requests for the authenticated user.
    @action(detail=False, methods=['get'])
    def incoming(self, request):
        incoming_requests = FriendRequest.objects.filter(to_user=request.user)
        serializer = FriendRequestSerializer(incoming_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # GET /api/friend_requests/outgoing
    # Returns a list of outgoing friend requests for the authenticated user.
    @action(detail=False, methods=['get'])
    def outgoing(self, request):
        outgoing_requests = FriendRequest.objects.filter(from_user=request.user)
        serializer = FriendRequestSerializer(outgoing_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST METHODS
    # POST /api/friend_requests/send
    # Sends a friend request to another user.
    @action(detail=False, methods=['post'])
    def send(self, request):
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        FriendRequest.objects.create(from_user=user, to_user=friend)
        return Response({'message': 'Friend request sent'}, status=status.HTTP_201_CREATED)

    # POST /api/friend_requests/accept
    # Accepts a friend request from another user.
    @action(detail=False, methods=['post'])
    def approve(self, request):
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request = FriendRequest.objects.filter(from_user=friend, to_user=user).first()
        if friend_request is None:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        user.friends.add(friend)
        user.save()
        return Response({'message': 'Friend request accepted'}, status=status.HTTP_201_CREATED)

    # DELETE /api/friend_requests/reject
    # Rejects an incoming friend request
    @action(detail=False, methods=['delete'])
    def reject(self, request):
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request = FriendRequest.objects.filter(from_user=friend, to_user=user).first()
        if friend_request is None:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        return Response({'message': 'Friend request removed'}, status=status.HTTP_200_OK)

    # DELETE /api/friend_requests/revoke
    # Revokes an outgoing friend request
    @action(detail=False, methods=['delete'])
    def revoke(self, request):
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request = FriendRequest.objects.filter(from_user=user, to_user=friend).first()
        if friend_request is None:
            return Response({'error': 'Friend request not found'}, status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        return Response({'message': 'Friend request removed'}, status=status.HTTP_200_OK)


class FriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        '''
        Retrieves the authenticated user's friends list.

        :param:
            request (Request): The incoming request; does not require any data parameters.

        :return:
            Response: A list of usernames for the authenticated user's friends.
        '''
        user = request.user
        friends = user.friends.all()
        data = [{'id': friend.id, 'username': friend.username} for friend in friends]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        '''
        Adds a user to the authenticated user's friends list.

        :param:
            request (Request): The incoming request containing the username to add as a friend.

        :return:
            Response: A success message indicating the user was added as a friend, or an error message if the user is not found.

        usage:
            - POST {URL}/
                - data (dict):
                    {
                        username: username of the user to add as a friend
                    }
        '''
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.friends.add(friend)
        user.save()
        return Response({'message': f'{username} added as a friend'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        '''
        Removes a user from the authenticated user's friends list.

        :param:
            request (Request): The incoming request containing the username to remove
        '''
        user = request.user
        username = request.data.get('username', None)
        friend = User.objects.filter(username=username).first()
        if friend is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.friends.remove(friend)
        user.save()
        return Response({'message': f'{username} removed from friends'}, status=status.HTTP_200_OK)


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
            # print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using email and password
        try:
            user = User.objects.get(email__iexact=serializer.validated_data['email'])
            if user.check_password(serializer.data['password']):
                if (user.is_active == False):
                    return Response({'error': ['Email must be verified before logging in.']},
                                    status=status.HTTP_401_UNAUTHORIZED)
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
            is_active=True  # Set guest users as active by default
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

class StoreItemSuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returns a list of store items matching the search query for dropdown suggestions.
        """
        search_query = request.query_params.get('query', '').strip()

        if not search_query:
            return Response({'error': 'Query parameter is required.'}, status=400)

        vector = SearchVector('name', weight='A') + \
                 SearchVector('store', weight='B') + \
                 SearchVector('description', weight='C')

        query = SearchQuery(search_query)
        results = StoreItem.objects.annotate(
            rank=SearchRank(vector, query)
        ).filter(rank__gte=0.1).order_by('-rank')
        print(results)
        valid_results = []
        user = request.user
        user_diet_restrictions = user.diet_restrictions.values_list('id', flat=True)
        for result in results:
            item_violations = result.violations.values_list('id', flat=True)
            if not set(item_violations).intersection(user_diet_restrictions):
                valid_results.append(result)
        serializer = StoreItemSerializer(valid_results, many=True)
        return Response(serializer.data, status=200)

class OptimizeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        '''
        When a user optimize, the unoptimized AND optimized grocery list is sent to them. The frontend will parse both items
        After optimizing, the optimized grocery list should have all items in it.
        During optimization, the old optimized list items are deleted.
        '''
        grocery_id = request.query_params.get('id')
        print("HEYy")
        print(grocery_id)
        grocery = get_object_or_404(Grocery, id=grocery_id)
        unoptimized_items = GroceryItemUnoptimized.objects.all().filter(subheading__grocery=grocery_id)
        subheading_dict = collections.defaultdict(list)

        optimized_subheadings = grocery.subheadings.filter(optimized=True)

        for subheading in optimized_subheadings:
            if subheading.name == "Unoptimized":
                continue
            print(subheading)

            subheading.optimized_items.all().delete()
            subheading.delete()

        user = request.user
        user_diet_restrictions = user.diet_restrictions.values_list('id', flat=True)

        for item in unoptimized_items:
            name_query = SearchQuery(item.name)
            store_query = SearchQuery(item.store)
            units_query = SearchQuery(item.units)

            combined_query = name_query & store_query

            results = StoreItem.objects.annotate(
                search=SearchVector("name", "store", "units", weight='A'),
                rank=SearchRank(
                    SearchVector("name", "store", "units"),
                    combined_query
                ),
            ).filter(search=combined_query).order_by("price", "-rank")

            valid_results = []
            for result in results:
                item_violations = result.violations.values_list('id', flat=True)
                if not set(item_violations).intersection(user_diet_restrictions):
                    valid_results.append(result)

            if valid_results:
                first_valid_result = valid_results[0]
                subheading_name = f"{first_valid_result.store};{first_valid_result.store_location}"

                if subheading_name not in subheading_dict:
                    subheading_dict[subheading_name] = []

                subheading_dict[subheading_name].append(first_valid_result)
            else:
                subheading_dict['Unoptimized'].append(item)

        print(subheading_dict)
        for key, value in subheading_dict.items():
            subheading, created = Subheading.objects.get_or_create(
                name=key,
                grocery=grocery,
                optimized=True,
            )
            if created:
                subheading.order = grocery.subheadings.count() - 1
                subheading.save()
            for item in value:
                optimized_item = None
                order = subheading.optimized_items.count()
                if key == 'Unoptimized':
                    optimized_item = GroceryItemOptimized.from_unoptimized_item(item, subheading, order)
                else:
                    optimized_item = GroceryItemOptimized.from_store_item(item, subheading, order)
                optimized_item.save()
        serializer = GrocerySerializer(grocery)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response("NO", status=status.HTTP_400_BAD_REQUEST)


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


class ProfileView(APIView):
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
                        icon: icon name,
                        color: color hexcode
                    }
        '''

        user = request.user
        icon = request.data.get('icon', 'person')
        color = request.data.get('color', '#F6AA1C')
        user.profile_icon = icon
        user.profile_color = color
        user.save()

        return Response(
            {"message": "Profile updated successfully."},
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

        return Response(
            {
                "icon": user.profile_icon,
                "color": user.profile_color,
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

    def get(self, request):
        user = request.user

        return Response(
            {
                "email": user.email,
                "password": user.password,
                "username": user.username,
            },
            status=status.HTTP_200_OK
        )


class GetCoordinatesView(APIView):
    def get_address_location(self, address):
        """
        Fetch latitude and longitude for a given address using Google Geocoding API.

        Args:
            address (str): The address to geocode.

        Returns:
            dict: A dictionary with 'latitude' and 'longitude' if successful, or None if there's an error.
        """
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

        # URL encode the address to make it safe for the API call
        encoded_address = requests.utils.quote(address)
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={encoded_address}&key={api_key}"

        try:
            # Make the request to the Google Geocoding API
            response = requests.get(url)
            response.raise_for_status()  # Raise an error for HTTP errors

            data = response.json()

            # Check if results were found and extract location data
            if data.get("results"):
                location = data["results"][0]["geometry"]["location"]
                return {
                    "latitude": location["lat"],
                    "longitude": location["lng"]
                }
            else:
                # print("No results found for the provided address.")
                return None
        except requests.exceptions.RequestException as e:
            # print(f"Request error: {e}")
            return None

    def get(self, request, *args, **kwargs):
        address = request.GET.get('address', None)

        # print(address)

        if not address:
            return Response({"error": "Address parameter is required"}, status=400)

        # Call your function to get coordinates for the address
        coordinates = self.get_address_location(address=address)  # Replace with your actual function

        if coordinates:
            return Response({"latitude": coordinates["latitude"], "longitude": coordinates["longitude"]}, status=200)
        else:
            return Response({"error": "Could not find coordinates for the given address"}, status=404)


class AddressViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    # GET /api/user/addresses/
    # Retrieves all addresses for the authenticated user.
    def list(self, request):
        user = request.user
        addresses = user.addresses  # Assuming `addresses` is a list of address dictionaries
        selected_address_id = user.selected_address_id
        return Response({
            'addresses': addresses,
            'selected_address_id': selected_address_id
        }, status=status.HTTP_200_OK)

    # POST /api/user/addresses/add/
    # Adds a new address to the end of the user's address list.
    @action(detail=False, methods=['post'])
    def add(self, request):
        user = request.user
        address = request.data.get('address')
        icon = request.data.get('icon')
        icontype = request.data.get('icontype')
        if not address:
            return Response({'error': 'Address is required'}, status=status.HTTP_400_BAD_REQUEST)
        # Generate a new ID for the address
        if user.addresses:
            new_id = max(address['id'] for address in user.addresses) + 1
        else:
            new_id = 1
        # Add latitude and longitude to address with geocoding
        coordinates = geocode(address)
        if coordinates:
            latitude = coordinates["latitude"]
            longitude = coordinates["longitude"]
        else:
            return Response({'error': 'Geocode Failure'}, status=status.HTTP_400_BAD_REQUEST)

        address_entry = {
            'id': new_id,
            'icon': icon,
            'name': address,
            "address": address,
            'icontype': icontype,
            'latitude': latitude,
            'longitude': longitude
        }
        user.addresses.append(address_entry)
        user.save()
        return Response({'message': 'Address added successfully'}, status=status.HTTP_201_CREATED)

    # DELETE /api/user/addresses/remove/
    # Removes an address from the user's address list.
    @action(detail=False, methods=['delete'])
    def remove(self, request):
        user = request.user
        address_id = request.data.get('address_id')
        if address_id is None:
            return Response({'error': 'address_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        # Filter out the address to remove
        updated_addresses = [addr for addr in user.addresses if addr['id'] != address_id]
        if len(updated_addresses) == len(user.addresses):
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
        user.addresses = updated_addresses
        # Reset selected_address_id if the removed address was selected
        if user.selected_address_id == address_id:
            user.selected_address_id = None
        user.save()
        return Response({'message': 'Address removed successfully'}, status=status.HTTP_200_OK)

    # POST /api/user/addresses/update_selected/
    # Updates the user's selected address ID.
    @action(detail=False, methods=['post'])
    def update_selected(self, request):
        user = request.user
        selected_address_id = request.data.get('selected_address_id')
        if selected_address_id is None:
            return Response({'error': 'selected_address_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        # Check if the address exists in the user's address list
        if any(addr['id'] == selected_address_id for addr in user.addresses):
            user.selected_address_id = selected_address_id
            user.save()
            return Response({'message': 'Selected address updated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

    # GET /api/user/addresses/selected/
    # Gets the selected address
    @action(detail=False, methods=['get'])
    def selected(self, request):
        user = request.user
        selected_address_id = user.selected_address_id
        if selected_address_id is None:
            return Response({'error': 'No address selected'}, status=status.HTTP_400_BAD_REQUEST)
        selected_address = get_selected_address(user)
        if selected_address:
            return Response({'address': selected_address}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Selected address not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def id(self, request):
        user = request.user
        selected_address_id = user.selected_address_id
        if selected_address_id:
            return Response({'id': selected_address_id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No address id found'}, status=status.HTTP_404_NOT_FOUND)


class AutocompleteView(APIView):
    def post(self, request):
        search_text = request.data.get('search_text', '')

        # Validate input
        if not search_text:
            return Response({"error": "Please provide a search text."}, status=status.HTTP_400_BAD_REQUEST)

        # Google Places Autocomplete API endpoint
        url = "https://maps.googleapis.com/maps/api/place/autocomplete/json"

        # Retrieve Google API Key from environment variables for security
        google_api_key = os.getenv("GOOGLE_API_KEY")  # Set your API key in environment variables

        # Set up parameters for the API request
        params = {
            "input": search_text,
            "key": google_api_key,
            "types": "address",  # Restrict to address types only
            "language": "en"  # Optional: specify the language for the predictions
        }

        try:
            # Make a GET request to the Google Places API
            response = requests.get(url, params=params)
            response.raise_for_status()  # Raise an error for HTTP errors

            # Parse the response JSON
            predictions = response.json().get('predictions', [])

            # Extract only the address descriptions from the predictions
            addresses = [prediction['description'] for prediction in predictions]

            # Return the list of addresses in the specified format
            return Response({"addresses": addresses}, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            # Handle errors from the API request
            return Response(
                {"error": "An error occurred with the Google API request", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
                    item = GroceryItemUnoptimized.objects.get(id=item_id)
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


class StoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # USE GOOGLE PLACES TO GET WALMART STORES
        user = request.user
        address = get_selected_address(user)

        # Get user's max distance and convert to meters
        radius = str(int(user.max_distance) * settings.METERS_PER_MILE)
        radius_miles = str(int(user.max_distance))

        # Check latitude and longitude and, if none, use current location
        latitude = None
        longitude = None
        if address.get('latitude') and address.get('longitude'):
            latitude = address['latitude']
            longitude = address['longitude']
        else:
            # Get the current location from the user's device
            [latitude, longitude] = get_current_location()
            if not latitude or not longitude:
                return Response({'error': 'Could not find a latitude and longitude with associated user address'},
                                status=status.HTTP_400_BAD_REQUEST)

        response = requests.get(
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=walmart&location={latitude},{longitude}&radius={radius}&key={os.getenv('GOOGLE_API_KEY')}"
        )

        # Filter results to include only main Walmart establishments
        data = response.json()

        # Specify allowed Walmart names
        allowed_names = {"walmart", "walmart supercenter", "walmart neighborhood market"}

        # Filter results to include only main Walmart establishments
        filtered_results = []
        unique_place_ids = set()

        for place in data.get("results", []):
            place_id = place.get("place_id")
            name = place.get("name", "").lower()  # Convert name to lowercase for consistent comparison

            # Include only places with allowed names
            if (
                    place_id not in unique_place_ids
                    and name in allowed_names
            ):
                filtered_results.append(place)
                unique_place_ids.add(place_id)

        # Preserve the original JSON structure
        filtered_data = {
            "results": filtered_results
        }

        walmart_stores = format_store_response(filtered_data)

        # USE KROGER API TO GET KROGER STORES
        access_token = get_kroger_oauth2_token()
        if not access_token:
            return Response({'error': 'Failed to authenticate with Kroger API'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Set up headers and parameters for Kroger API request
        # print(f"{latitude}, {longitude}, {radius_miles}")
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json',
        }
        params = {
            'filter.latLong.near': f"{latitude},{longitude}",
            'filter.radiusInMiles': radius_miles,  # Ensure radius is a string
        }

        # Make a request to Kroger's Locations API
        try:
            response = requests.get(f"{settings.KROGER_API_BASE_URL}/v1/locations", headers=headers, params=params)
            response.raise_for_status()
            response_data = response.json()  # Extract JSON data

            kroger_stores = format_kroger_response(response_data=response_data)  # Ensure correct parameter name
        except requests.RequestException as e:
            # print("Error fetching Kroger stores:", e)
            # print("Response content:", response.content)  # Log the exact response content for debugging
            return Response({'error': 'Failed to retrieve stores'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Combine Walmart and Kroger store data
        all_stores = walmart_stores["stores"] + kroger_stores["stores"]
        return Response({'stores': all_stores}, status=status.HTTP_200_OK)


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

    def destroy(self, request, *args, **kwargs):
        grocery_id = request.query_params.get('list')
        item_id = kwargs.get('pk')

        # Ensure both recipe_id and item_id are provided
        if not grocery_id or not item_id:
            return Response(
                {'error': 'Recipe ID and Item ID must be provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        print(grocery_id)
        print(item_id)
        # Check if item exists and belongs to the specified recipe
        item = get_object_or_404(GroceryItemOptimized, id=item_id, subheading__grocery=grocery_id)

        subheading = item.subheading
        item.delete()
        if subheading.optimized_items.count() == 0 and subheading.name != "Unoptimized":
            subheading.delete()

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
    @action(detail=True, methods=['post'])
    def check(self, request, pk=None):
        '''
        Toggles the 'checked' status of a grocery item, ensuring it belongs to the specified grocery list.

        :param:
            request (Request): The incoming request; expects 'list' parameter with the grocery list ID.
            pk (UUID): The primary key of the grocery item to toggle favorite status.

        :return:
            Response: Contains the serialized data of the updated grocery item after toggling 'favorited' status,
                      or an error if the item does not belong to the specified grocery list.

        usage:
            - POST {URL}/{item_id}/favorite - toggles the checked status of items within the specified grocery list
        '''
        try:
            item = GroceryItemUnoptimized.objects.get(pk=pk)
        except GroceryItemUnoptimized.DoesNotExist:
            return Response({"error": "Item not found in the specified grocery list."},
                            status=status.HTTP_404_NOT_FOUND)

        # Toggle the 'favorited' status
        item.checked = not item.checked
        item.save()

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
        item = get_object_or_404(GroceryItemUnoptimized, id=item_id, subheading__grocery=grocery_id)

        subheading = item.subheading
        item.delete()
        if subheading.items.count() == 0 and subheading.name != "Default":
            subheading.delete()

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

    @action(detail=True, methods=['post'])
    def check(self, request, pk=None):
        '''
        Toggles the 'checked' status of a grocery item, ensuring it belongs to the specified grocery list.

        :param:
            request (Request): The incoming request; expects 'list' parameter with the grocery list ID.
            pk (UUID): The primary key of the grocery item to toggle favorite status.

        :return:
            Response: Contains the serialized data of the updated grocery item after toggling 'favorited' status,
                      or an error if the item does not belong to the specified grocery list.

        usage:
            - POST {URL}/{item_id}/checked - toggles the checked status of items within the specified grocery list
        '''
        try:
            item = GroceryItemUnoptimized.objects.get(pk=pk)
        except GroceryItemUnoptimized.DoesNotExist:
            return Response({"error": "Item not found in the specified grocery list."},
                            status=status.HTTP_404_NOT_FOUND)

        # Toggle the 'checked' status
        item.checked = not item.checked
        item.save()


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
