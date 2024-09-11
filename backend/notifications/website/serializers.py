from rest_framework import serializers
from ..models import EventNotificationModel
from core.utils import send_email
from django.contrib.auth import get_user_model


class WebsiteEventNotificationModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventNotificationModel
        fields = "__all__"

    def validate(self, data):
        if 'event' not in data:
            raise serializers.ValidationError('Event is required')
        if data['event'].organiser.pk != self.context['request'].user.pk:
            raise serializers.ValidationError('You are not authorized to send notifications for this event')
        if 'title' not in data or data['title'] == '':
            raise serializers.ValidationError('Title is required')
        if 'message' not in data or data['message'] == '':
            raise serializers.ValidationError('Message is required')
        return data
    
    def create(self, validated_data):
        notification_instance=EventNotificationModel.objects.create(**validated_data)
        event_instance = notification_instance.event
        attendees_queryset = event_instance.EventAttendeeModel_event.all().values('user').distinct()
        recipient_list = []
        for attendee in attendees_queryset:
            recipient_list.append(get_user_model().objects.get(id=attendee['user']).email)
        message = f"""Dear Attendee of Event "{event_instance.title}",\n\n{validated_data['message']}\n\nBest Regards,\n{event_instance.organiser.first_name} {event_instance.organiser.last_name}\nOrganiser"""
        if send_email(validated_data['title'],message,recipient_list):
            notification_instance.is_sent = True
            notification_instance.save()
        return validated_data