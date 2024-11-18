from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
import requests
import geocoder
import os
from dotenv import load_dotenv

load_dotenv()

def send_password_reset_confirmation(user):
    token = default_token_generator.make_token(user)
    
    subject = '[SPAARA] Password Reset Successful'
    message = f'Howdy there Spaartan,\n\nThis message is to confirm that your password change was successful.\n\n--Spaara Team'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
    
    subject = '[SPAARA] Verify your email address'
    message = f'Howdy there Spaartan,\n\nPlease click the link below to verify your email address:\n{verification_link}\n\n--Spaara Team'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_delete_confirmation_email(email):
    subject = '[SPAARA] Account Deletion'
    message = f"Later Spaartan,\n\nWe're sad to see you go. Oh, won't you rejoin someday?\n\n--Spaara Team"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list)

def send_account_recovery_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    recovery_link = f"{settings.FRONTEND_URL}/account-recovery/{uid}/{token}/"

    subject = '[SPAARA] Password Recovery'
    message = f'Someone is attempting to recover your account. Click this link if you would like to do so\n\n{recovery_link}\n\n--Spaara Team'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def get_kroger_oauth2_token():
    """Retrieve an OAuth2 token from Kroger API."""
    client_id = os.getenv("KROGER_CLIENT_ID")
    client_secret = os.getenv("KROGER_CLIENT_SECRET")
    token_url = f"{settings.KROGER_API_BASE_URL}/v1/connect/oauth2/token"
    
    try:
        # Send a POST request to obtain the token
        response = requests.post(
            token_url,
            data={
                'grant_type': 'client_credentials',
            },
            auth=(client_id, client_secret)  # Pass client_id and client_secret here
        )
        response.raise_for_status()  # Raise an error for bad responses
        return response.json().get('access_token')  # Extract the access token
    except requests.RequestException as e:
        print("Error obtaining OAuth2 token:", e)
        return None

# Encodes ALL the response of Google Nearby Places API in the same format as format_kroger_response
def format_store_response(response_data):
    stores = []
    if "results" in response_data:
        for store in response_data["results"]:
            # Extract relevant store information for each store in the array
            store_info = {
                "name": store.get("name", "Unknown"),
                "address": store.get("vicinity", "Unknown"),
                "coordinates": {
                    "latitude": str(store["geometry"]["location"]["lat"]),
                    "longitude": str(store["geometry"]["location"]["lng"])
                }
            }
            stores.append(store_info)

    return {"stores": stores}

def format_kroger_response(response_data):
    stores = []
    if "data" in response_data:
        for store in response_data["data"]:
            # Extract relevant store information for each store in the array
            store_info = {
                "name": store.get("name", "Unknown"),
                "address": f"{store['address'].get('addressLine1', '')}, "
                           f"{store['address'].get('city', '')}, "
                           f"{store['address'].get('state', '')}, "
                           f"{store['address'].get('zipCode', '')}",
                "coordinates": {
                    "latitude": str(store["geolocation"].get("latitude", "")),
                    "longitude": str(store["geolocation"].get("longitude", ""))
                }
            }
            stores.append(store_info)

    return {"stores": stores}

def geocode(address):
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
            print("No results found for the provided address.")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None

# Returns latitude and longitude of the current location
def get_current_location():
    g = geocoder.ip('me')
    if g.latlng:
        return [g.latlng[0], g.latlng[1]]
    else:
        return None
    
def get_selected_address(user):
    return next((addr for addr in user.addresses if addr['id'] == user.selected_address_id), None)