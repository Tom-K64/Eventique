from rest_framework import serializers
from .models import EventDetailModel

class UtilsEventDetailModelSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EventDetailModel
        exclude = ('ticket_types',)
    
    def get_category(self, obj):
        try:
            data = obj.category.title
        except:
            data=None
        return data