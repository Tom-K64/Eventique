from django.urls import path
from .views import WebsiteUserProfileModelGETAPIView,WebsiteUserProfileModelUpdateAPIView

urlpatterns = [
    path('profile-details/',WebsiteUserProfileModelGETAPIView.as_view(),name="WebsiteUserProfileModelGETAPIView"),
    path('update-profile/',WebsiteUserProfileModelUpdateAPIView.as_view(),name="WebsiteUserProfileModelUpdateAPIView"),

]