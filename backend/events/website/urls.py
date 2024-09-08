from django.urls import path
from .views import WebsiteEventDetailModelCreateAPIView,WebsiteRecipeModelGenericAPIView,WebsiteEventDetailModelListAPIView,WebsiteEventDetailModelUserEventListAPIView,WebsiteEventDetailModelGetAPIView

urlpatterns = [
    path('event-detail-api/<int:id>/',WebsiteEventDetailModelGetAPIView.as_view(),name="WebsiteEventDetailModelGetAPIView"),
    path('event-list-api/',WebsiteEventDetailModelListAPIView.as_view(),name="WebsiteEventDetailModelListAPIView"),
    path('user-event-list-api/',WebsiteEventDetailModelUserEventListAPIView.as_view(),name="WebsiteEventDetailModelUserEventListAPIView"),
    path('create-event/',WebsiteEventDetailModelCreateAPIView.as_view(),name="WebsiteEventDetailModelCreateAPIView"),
    path('event-generic-api/<int:id>/',WebsiteRecipeModelGenericAPIView.as_view(),name="WebsiteRecipeModelGenericAPIView"),
    
]