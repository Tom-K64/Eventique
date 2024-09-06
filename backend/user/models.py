from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid 
from django.contrib.auth import get_user_model

# Create your models here.

class CustomUserManager(BaseUserManager):
    
    def create_user(self,email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        This Create Method is regular user, Or Website register method
        """
        if not email:
            raise ValueError('The email field can not be empty')
        if not password:
            raise ValueError('The password field can not be empty')
        email = self.normalize_email(email)
        namespace_uuid = uuid.NAMESPACE_X500
        uuid_id = uuid.uuid5(name=email, namespace=namespace_uuid)
        user = self.model(id=uuid_id, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        email = self.normalize_email(email)
        namespace_uuid = uuid.NAMESPACE_X500
        uuid_id = uuid.uuid5(name=email, namespace=namespace_uuid)
        user = self.model(id=uuid_id,email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user



# from django.contrib.auth.models import User 
class UserModel(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, editable=False)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True,blank=True,null=True)
    country_code = models.CharField(max_length=10, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True, unique=True)
    
    # Permissions
    is_staff = models.BooleanField(default=False, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)  

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        if self.email is None:
            return self.phone_number
        return self.email




class EmailOtpVerifyModel(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="EmailOtpVerifyModel_user",null=True,blank=True)
    email = models.EmailField(null=True, blank=True)
    otp = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email