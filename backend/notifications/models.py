from django.db import models
from events.models import EventDetailModel

# Create your models here.

class EventNotificationModel(models.Model):
    event = models.ForeignKey(EventDetailModel,on_delete=models.CASCADE,related_name="EventNotificationModel_event",null=True,blank=True)
    title = models.CharField(max_length=100,null=True,blank=True)
    message = models.TextField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)