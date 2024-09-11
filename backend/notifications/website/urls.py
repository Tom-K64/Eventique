from django.urls import path
from .views import WebsiteEventNotificationModelCreateAPIView

urlpatterns = [
    path('send-event-notification/',WebsiteEventNotificationModelCreateAPIView.as_view(),name="WebsiteEventNotificationModelCreateAPIView"),
]