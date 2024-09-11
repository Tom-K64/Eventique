from rest_framework import serializers
from ..models import PollModel,OptionModel,ForumModel,QAModel,MessageModel
from events.models import EventDetailModel


class WebsitePollOptionModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionModel
        fields = "__all__"
class WebsitePollModelListSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    is_voted = serializers.SerializerMethodField()
    class Meta:
        model = PollModel
        fields = "__all__"
    
    def get_is_voted(self, obj):
        try:
            data = obj.votes.filter(pk=self.context['request'].user.pk).exists()
        except:
            data = None
        return data
    
    def get_options(self, obj):
        try:
            data = WebsitePollOptionModelListSerializer(obj.options.all(), many=True).data
        except:
            data = None
        return data
    
class WebsitePollModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollModel
        fields = ('event','question')

    def validate(self, data):
        request_data = self.context['request'].data
        if 'options' not in request_data or len(request_data['options']) <2:
            raise serializers.ValidationError({'message':'At least two options are required'})
        if data['event'].organiser.pk != self.context['request'].user.pk:
            raise serializers.ValidationError({'message':'You are not authorized to create polls for this event'})
        return data
    
    def create(self, validated_data):
        poll_instance = PollModel.objects.create(**validated_data)
        for option in self.context['request'].data['options']:
            opt_instance = OptionModel.objects.create(option=option)
            poll_instance.options.add(opt_instance)
        poll_instance.save()
        return validated_data
    

class WebsiteMessageModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = "__all__"
    
class WebsiteMessageModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageModel
        fields = ('message',)

    def validate(self, data):
        raw_data = self.context['request'].data
        if 'event' not in raw_data:
            raise serializers.ValidationError({'message':'Event is required'})
        if 'message' not in data or len(data['message']) <2:
            raise serializers.ValidationError({'message':'Message should be at least 2 characters long'})
        return data
    
    def create(self, validated_data):
        request = self.context['request']
        message_instance = MessageModel.objects.create(username =request.user.first_name,**validated_data)
        event_instance = EventDetailModel.objects.filter(pk=request.data['event']).first()
        if event_instance:
            forum_instance,created = ForumModel.objects.get_or_create(event = event_instance)
            forum_instance.messages.add(message_instance)
            forum_instance.save()
        return validated_data
    
class WebsiteQAModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = QAModel
        fields = "__all__"

class WebsiteQAModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QAModel
        fields = ('event','question','username')

