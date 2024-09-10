from rest_framework import serializers
from .models import EventDetailModel

class UtilsEventDetailModelSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EventDetailModel
        fields = ('id','title', 'description','start_date', 'start_time','venue','location','category','price_range','poster','capacity','available')
    
    def get_category(self, obj):
        try:
            data = obj.category.title
        except:
            data=None
        return data