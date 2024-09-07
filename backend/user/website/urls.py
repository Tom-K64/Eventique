from django.urls import path
from .views import WebsiteEmailSendOTPAPIView,WebsiteEmailVerifyOTPAPIView,WebsiteUserModelCreateAPIView,WebsiteUserLoginAPIView

urlpatterns = [
    path('send-otp/',WebsiteEmailSendOTPAPIView.as_view(),name="WebsiteEmailSendOTPAPIView"),
    path('verify-otp/',WebsiteEmailVerifyOTPAPIView.as_view(),name="WebsiteEmailVerifyOTPAPIView"),
    path('sign-up/',WebsiteUserModelCreateAPIView.as_view(),name="WebsiteUserModelCreateAPIView"),
    path('sign-in/',WebsiteUserLoginAPIView.as_view(),name="WebsiteUserLoginAPIView"),
]