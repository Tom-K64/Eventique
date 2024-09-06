from django.contrib import admin
from .models import EventMediaModel,EventCategoryModel,EventTicketTypeModel,EventDetailModel,EventTicketModel,EventAttendeeModel
# Register your models here.

admin.site.register(EventMediaModel)
admin.site.register(EventCategoryModel)
admin.site.register(EventTicketTypeModel)
admin.site.register(EventDetailModel)
admin.site.register(EventTicketModel)
admin.site.register(EventAttendeeModel)