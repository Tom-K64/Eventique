from django.db import models
from django.contrib.auth import get_user_model
from .utils import GenderEnumType
# Create your models here.

class UserMediaGalleryModel(models.Model):
    media = models.ImageField(upload_to="profile_photo/", blank=True, null=True)
    user = models.ForeignKey(get_user_model(),related_name="UserMediaGalleryModel_user",on_delete=models.CASCADE,null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class UserProfileModel(models.Model):
    user = models.OneToOneField(get_user_model(),on_delete=models.CASCADE,related_name="UserProfileModel_user",null=True,blank=True)
    profile_pic = models.TextField(null=True, blank=True)
    gender = models.CharField(max_length=10,choices=GenderEnumType.choices(),null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    dob = models.DateField(null=True,blank=True)
    location = models.CharField(max_length=50,null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)