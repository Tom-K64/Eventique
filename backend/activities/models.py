from django.db import models
from events.models import EventDetailModel
from django.contrib.auth import get_user_model

# Create your models here.

class OptionModel(models.Model):
    option = models.CharField(max_length=100, blank=True, null=True)
    votes = models.PositiveIntegerField(null=True, blank=True,default=0)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

class PollModel(models.Model):
    event = models.ForeignKey(EventDetailModel, on_delete=models.CASCADE,related_name="PollModel_event",null=True,blank=True)
    question = models.CharField(max_length=200, blank=True, null=True)
    options = models.ManyToManyField(OptionModel,related_name="PollModel_options",blank=True)
    votes = models.ManyToManyField(get_user_model(),related_name="PollModel_votes", blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class MessageModel(models.Model):
    message = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    
class ForumModel(models.Model):
    event = models.ForeignKey(EventDetailModel, on_delete=models.CASCADE, related_name="ForumModel_event",null=True, blank=True)
    messages = models.ManyToManyField(MessageModel,related_name="ForumModel_messages",blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class QAModel(models.Model):
    event = models.ForeignKey(EventDetailModel, on_delete=models.CASCADE, related_name="QAModel_event",null=True, blank=True)
    question = models.CharField(max_length=200, blank=True, null=True)
    answer = models.TextField(null=True, blank=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    is_answered = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)