from rest_framework import serializers
from ..models import EventDetailModel,EventMediaModel,EventTicketTypeModel,EventCategoryModel,EventAttendeeModel,EventTicketModel
from ..serializers_utils import UtilsEventDetailModelSerializer
from user.serializers_utils import UserModelUtilsSerializer
class WebsiteEventCategoryModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategoryModel
        fields = "__all__"
class WebsiteEventTicketTypeModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTicketTypeModel
        fields = "__all__"
class WebsiteEventDetailModelListSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField(read_only=True)
    ticket_types = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = EventDetailModel
        fields = "__all__"

    def get_category(self, obj):
        try:
            data = WebsiteEventCategoryModelListSerializer(obj.category).data
        except:
            data=None
        return data

    def get_ticket_types(self, obj):
        try:
            data = WebsiteEventTicketTypeModelListSerializer(obj.ticket_types.all(),many=True).data
        except:
            data=None
        return data
    
"""
{
    "title": "",
    "description": "",
    "category": id,
    "start_date": null,
    "end_date": null,
    "location": "",
    "start_time": null,
    "end_time": null,
    "type_count":0,
    "ticket_types[0][title]":
    "ticket_types": [
        {
            "title": "",
            "description": "",
            "price": null,
            "quantity": null,
        },
        {
            "title": "",
            "description": "",
            "price": null,
            "quantity": null,
        },
    ],
}
"""
class WebsiteEventDetailModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventDetailModel
        fields = ('title','description','category','start_date','end_date','venue','location','start_time','end_time')

    def create(self, validated_data):
        raw_data = self.context['request'].data
        event_instance = EventDetailModel.objects.create(organiser=self.context['request'].user,**validated_data)
        price_range = float(raw_data[f"ticket_types[0][price]"])
        capacity = 0
        for index in range(int(raw_data['type_count'])):
            title=raw_data[f"ticket_types[{index}][title]"]
            description=raw_data[f"ticket_types[{index}][description]"]
            price=float(raw_data[f"ticket_types[{index}][price]"])
            quantity=int(raw_data[f"ticket_types[{index}][quantity]"])
            ticket_type_instance = EventTicketTypeModel.objects.create(title=title, description=description, price=price, quantity=quantity)
            event_instance.ticket_types.add(ticket_type_instance)
            if price_range>price:
                price_range=price
            capacity+=quantity
        event_instance.price_range=int(price_range)
        event_instance.capacity=capacity
        event_instance.available = capacity

        if "pic_uploaded" in raw_data:
            if raw_data["pic_uploaded"]=="true":
                image_instance,created = EventMediaModel.objects.get_or_create(event=event_instance)
                image_instance.media = self.context['request'].FILES.get('poster')
                image_instance.save()
                event_instance.poster = image_instance.media.url

        event_instance.save()
        return validated_data


class WebsiteEventDetailModelUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventDetailModel
        fields = ('title','description','category','start_date','end_date','location','venue','start_time','end_time','is_private')

    def validate(self, data):
        if self.context['request'].user.pk != self.instance.organiser.pk:
            raise serializers.ValidationError('You are not authorized to update this event')
        if self.instance.capacity != self.instance.available:
            raise serializers.ValidationError("Some tickets are already booked, Contact Admin to Update !!!")
        return data

    def update(self, instance, validated_data):
        raw_data = self.context['request'].data
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.category = validated_data.get('category', instance.category)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.venue = validated_data.get('venue', instance.venue)
        instance.location = validated_data.get('location', instance.location)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.is_private = validated_data.get('is_private', instance.is_private)
        instance.qna_is_active = instance.qna_is_active        
        instance.forum_is_active = instance.forum_is_active
        instance.poll_is_active = instance.poll_is_active

        instance.ticket_types.all().delete()
        price_range = float(raw_data[f"ticket_types[0][price]"])
        capacity = 0
        for index in range(int(raw_data['type_count'])):
            title=raw_data[f"ticket_types[{index}][title]"]
            description=raw_data[f"ticket_types[{index}][description]"]
            price=float(raw_data[f"ticket_types[{index}][price]"])
            quantity=int(raw_data[f"ticket_types[{index}][quantity]"])
            ticket_type_instance = EventTicketTypeModel.objects.create(title=title, description=description, price=price, quantity=quantity)
            instance.ticket_types.add(ticket_type_instance)
            if price_range>price:
                price_range=price
            capacity+=quantity
        instance.price_range=int(price_range)
        instance.capacity=capacity
        instance.available = capacity

        if "pic_uploaded" in raw_data:
            if raw_data["pic_uploaded"]=="true":
                image_instance,created = EventMediaModel.objects.get_or_create(event=instance)
                image_instance.media = self.context['request'].FILES.get('poster')
                image_instance.save()
                instance.poster = image_instance.media.url

        instance.save()
        return instance


class WebsiteEventAttendeeModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendeeModel
        fields = ('event',)

    def validate(self, data):
        if 'tickets' not in self.context['request'].data or len(self.context['request'].data.get('tickets'))==0:
            raise serializers.ValidationError('No Tickets Selected')
        return data

    def create(self, validated_data):
        request = self.context['request']
        event_instance = validated_data['event']
        attendee_instance = EventAttendeeModel.objects.create(user=request.user,event=event_instance)
        total_tickets,total_price = 0,0
        for ticket in request.data.get('tickets'):
            ticket_type_instance = EventTicketTypeModel.objects.get(id=ticket['id'])
            ticket_instance = EventTicketModel.objects.create(event=event_instance,ticket_type=ticket_type_instance,quantity=int(ticket['quantity']),total_price=int(ticket['quantity'])*ticket_type_instance.price)
            ticket_type_instance.quantity = ticket_type_instance.quantity-int(ticket['quantity'])
            ticket_type_instance.save()
            total_tickets+=ticket_instance.quantity
            total_price+=ticket_instance.total_price
            attendee_instance.tickets.add(ticket_instance)
        attendee_instance.total_ticket_count = total_tickets
        attendee_instance.total_price_paid=total_price
        attendee_instance.save()
        event_instance.available= event_instance.available - total_tickets
        event_instance.save()
        return validated_data
    
class WebsiteEventAttendeeModelUserTicketListSerializer(serializers.ModelSerializer):
    event = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = EventAttendeeModel
        fields = ('event','total_ticket_count','total_price_paid')
    
    def get_event(self, obj):
        try:
            data = UtilsEventDetailModelSerializer(obj.event,many=False).data
        except:
            data=None
        return data
    
class WebsiteEventAttendeeModelEventAttendeeListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = EventAttendeeModel
        fields = ('id','user','total_ticket_count','total_price_paid')
    
    def get_user(self, obj):
        try:
            data = UserModelUtilsSerializer(obj.user,many=False).data
        except:
            data=None
        return data