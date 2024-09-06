from django.contrib import admin
from .models import UserModel,EmailOtpVerifyModel

# Register your models here.
admin.site.register(UserModel)
admin.site.register(EmailOtpVerifyModel)
