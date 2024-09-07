from django.urls import path,include

urlpatterns = [
    path('website/api/',include("events.website.urls"))
]