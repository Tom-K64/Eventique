from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

class EventMediaModel(models.Model):
    media = models.URLField(null=True, blank=True)
    media_key = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class EventCategoryModel(models.Model):
    title = models.CharField(max_length=100,null=True,blank=True)
    description = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class EventTicketTypeModel(models.Model):
    title = models.CharField(max_length=100,null=True,blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class EventDetailModel(models.Model):
    organiser = models.ForeignKey(get_user_model(),on_delete=models.CASCADE,related_name="EventDetailModel_organiser",null=True,blank=True)
    title = models.CharField(max_length=100,null=True,blank=True)
    description = models.TextField(null=True, blank=True)
    poster = models.ForeignKey(EventMediaModel,on_delete=models.CASCADE,related_name="EventDetailModel_poster",null=True,blank=True)
    category = models.ForeignKey(EventCategoryModel,on_delete=models.SET_NULL,related_name="EventDetailModel_category",null=True,blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100,null=True, blank=True)
    start_time = models.TimeField(null=True,blank=True)
    end_time = models.TimeField(null=True, blank=True)

    ticket_types = models.ManyToManyField(EventTicketTypeModel,related_name="EventDetailModel_ticket_types",blank=True)
    price_range = models.CharField(max_length=50,blank=True,null=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_private = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class EventTicketModel(models.Model):
    event = models.ForeignKey(EventDetailModel,on_delete=models.CASCADE,related_name="EventTicketModel_event",null=True,blank=True)
    ticket_type = models.ForeignKey(EventTicketTypeModel,on_delete=models.CASCADE,related_name="EventTicketModel_ticket_type",null=True,blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)


class EventAttendeeModel(models.Model):
    event = models.ForeignKey(EventDetailModel,on_delete=models.CASCADE,related_name="EventAttendeeModel_event",null=True,blank=True)
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE,related_name="EventAttendeeModel_user",null=True,blank=True)
    tickets = models.ManyToManyField(EventTicketModel,related_name="EventAttendeeModel_tickets",blank=True)
    total_ticket_count = models.PositiveIntegerField(null=True,blank=True)
    total_price_paid = models.PositiveIntegerField(null=True,blank=True)

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
