from django.urls import path,include

urlpatterns = [
    path('website/api/',include("activities.website.urls"))
]