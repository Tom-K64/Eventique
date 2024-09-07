from django.urls import path,include

urlpatterns = [
    path('website/api/',include("user.website.urls"))
]