from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

def send_password_reset_confirmation(user):
    token = default_token_generator.make_token(user)
    
    subject = '[Spaara] Password Reset Successful'
    message = f'Howdy there Spaartan,\n\nThis message is to confirm that your password change was successful.\n\nThank you!'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
    
    subject = 'Verify your email address'
    message = f'Howdy there Spaartan,\n\nPlease click the link below to verify your email address:\n{verification_link}\n\nThank you!'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)