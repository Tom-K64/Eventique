from django.urls import path
from .views import WebsiteEventDetailModelCreateAPIView,WebsiteEventDetailModelGenericAPIView,WebsiteEventDetailModelListAPIView,WebsiteEventDetailModelUserEventListAPIView,WebsiteEventDetailModelGetAPIView,WebsiteEventCategoryModelListAPIView,WebsiteEventDetailModelUserEventGetAPIView,WebsiteEventDetailModelPrivacyUpdateAPIView,WebsiteEventAttendeeModelCreateAPIView,WebsiteEventAttendeeModelUserTicketListAPIView,WebsiteEventAttendeeModelEventAttendeeListAPIView,WebsiteEventDetailModelActivityUpdateAPIView

urlpatterns = [
    path('event-detail-api/<int:id>/',WebsiteEventDetailModelGetAPIView.as_view(),name="WebsiteEventDetailModelGetAPIView"),
    path('event-list-api/',WebsiteEventDetailModelListAPIView.as_view(),name="WebsiteEventDetailModelListAPIView"),
    path('user-event-list-api/',WebsiteEventDetailModelUserEventListAPIView.as_view(),name="WebsiteEventDetailModelUserEventListAPIView"),
    path('user-event-detail-api/<int:id>/',WebsiteEventDetailModelUserEventGetAPIView.as_view(),name="WebsiteEventDetailModelUserEventGetAPIView"),
    path('create-event/',WebsiteEventDetailModelCreateAPIView.as_view(),name="WebsiteEventDetailModelCreateAPIView"),
    path('event-generic-api/<int:id>/',WebsiteEventDetailModelGenericAPIView.as_view(),name="WebsiteEventDetailModelGenericAPIView"),
    path('category-list-api/',WebsiteEventCategoryModelListAPIView.as_view(),name="WebsiteEventCategoryModelListAPIView"),
    path('event-privacy-update-api/<int:id>/',WebsiteEventDetailModelPrivacyUpdateAPIView.as_view(),name="WebsiteEventDetailModelPrivacyUpdateAPIView"),
    path('event-activity-update-api/<int:id>/',WebsiteEventDetailModelActivityUpdateAPIView.as_view(),name="WebsiteEventDetailModelActivityUpdateAPIView"),
    path('event-ticket-checkout-api/',WebsiteEventAttendeeModelCreateAPIView.as_view(),name="WebsiteEventAttendeeModelCreateAPIView"),
    path('user-tickets-list-api/',WebsiteEventAttendeeModelUserTicketListAPIView.as_view(),name="WebsiteEventAttendeeModelUserTicketListAPIView"),
    path('event-attendee-list-api/<int:id>/',WebsiteEventAttendeeModelEventAttendeeListAPIView.as_view(),name="WebsiteEventAttendeeModelEventAttendeeListAPIView"),
]