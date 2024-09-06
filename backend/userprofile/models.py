from django.db import models
from django.contrib.auth import get_user_model
from .utils import GenderEnumType
# Create your models here.

class UserMediaGalleryModel(models.Model):
    media = models.URLField(null=True, blank=True)
    media_key = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class UserProfileModel(models.Model):
    user = models.OneToOneField(get_user_model(),on_delete=models.CASCADE,related_name="UserProfileModel_user",null=True,blank=True)
    profile_pic = models.ForeignKey(UserMediaGalleryModel, on_delete=models.CASCADE, related_name="UserProfileModel_profile_pic",null=True,blank=True)
    gender = models.CharField(max_length=10,choices=GenderEnumType.choices(),null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    dob = models.DateField(null=True,blank=True)
    location = models.CharField(max_length=50,null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)