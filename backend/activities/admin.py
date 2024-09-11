from django.contrib import admin
from .models import OptionModel,PollModel,MessageModel,ForumModel,QAModel

# Register your models here.

admin.site.register(OptionModel)
admin.site.register(PollModel)
admin.site.register(MessageModel)
admin.site.register(ForumModel)
admin.site.register(QAModel)