from django.core.mail import send_mail
from django.conf import settings
import base64
from random import randint


def send_email(subject,message,recipient_list):
    try:
        from_email = settings.EMAIL_HOST_USER
        send_mail(subject, message, from_email, recipient_list)
        return True
    except Exception as e:
        return False

def send_email_otp(otp,recipient):
    try:
        print("Sending email to",recipient)
        from_email = settings.EMAIL_HOST_USER
        subject = "Verification for Eventique"
        message="""
        Dear User,
        Email verification code for account creation is {}. OTP is valid for 10 mins. Do not share this with anyone.

        Thanks,
        Eventique
        """.format(otp)
        send_mail(subject, message, from_email, [recipient])
        print("Email sent")
        return True
    except Exception as e:
        print(e)
        return False

def generate_otp():
    otp =randint(100000,999999)
    return otp

def normalize_email(email):
    try:
        email = email.replace(" ","")
        email_name, domain_part = email.strip().split('@', 1)
        email = f"{email_name.lower()}@{domain_part.lower()}"
    except Exception as e:
        raise ValueError("Not a valid email address")
    return email