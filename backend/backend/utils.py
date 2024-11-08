from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

def send_password_reset_confirmation(user):
    token = default_token_generator.make_token(user)
    
    subject = '[SPAARA] Password Reset Successful'
    message = f'Howdy there Spaartan,\n\nThis message is to confirm that your password change was successful.\n\n--Spaara Team'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)

def send_verification_email(user, update=False):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
    
    subject = '[SPAARA] Verify your email address'
    message = f'Howdy there Spaartan,\n\nPlease click the link below to verify your email address:\n{verification_link}\n\n--Spaara Team'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    if (update):
        recipient_list = [user.email_pending]

    send_mail(subject, message, from_email, recipient_list)

def send_delete_confirmation_email(email):
    subject = '[SPAARA] Account Deletion'
    message = f"Later Spaartan,\n\nWe're sad to see you go. Oh, won't you rejoin someday?\n\n--Spaara Team"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list)