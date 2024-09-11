from django.urls import path
from .views import WebsitePollModelListAPIView,WebsitePollModelCreateAPIView,WebsitePollModelGenericAPIView,WebsiteMessageModelListAPIView,WebsiteMessageModelCreateAPIView,WebsiteQAModelListAPIView,WebsiteQModelCreateAPIView,WebsiteQAModelGenericAPIView,WebsiteQAModelUpdateAPIView,WebsitePollModelUpdateAPIView

urlpatterns = [
    path('event-poll-list-api/<int:id>/',WebsitePollModelListAPIView.as_view(),name='WebsitePollModelListAPIView'),
    path('event-poll-create-api/',WebsitePollModelCreateAPIView.as_view(),name='WebsitePollModelCreateAPIView'),
    path('event-poll-update-api/<int:id>/',WebsitePollModelUpdateAPIView.as_view(),name='WebsitePollModelUpdateAPIView'),
    path('event-poll-delete-api/<int:id>/',WebsitePollModelGenericAPIView.as_view(),name="WebsitePollModelGenericAPIView"),
    path('event-forum-list-api/<int:id>/',WebsiteMessageModelListAPIView.as_view(),name="WebsiteMessageModelListAPIView"),
    path('event-forum-message-api/',WebsiteMessageModelCreateAPIView.as_view(),name="WebsiteMessageModelCreateAPIView"),
    path('event-qa-list-api/<int:id>/',WebsiteQAModelListAPIView.as_view(),name="WebsiteQAModelListAPIView"),
    path('event-qa-create-api/',WebsiteQModelCreateAPIView.as_view(),name="WebsiteQModelCreateAPIView"),
    path('event-qa-answer-api/<int:id>/',WebsiteQAModelUpdateAPIView.as_view(),name="WebsiteQAModelUpdateAPIView"),
    path('event-qa-delete-api/<int:id>/',WebsiteQAModelGenericAPIView.as_view(),name="WebsiteQAModelGenericAPIView"),

]