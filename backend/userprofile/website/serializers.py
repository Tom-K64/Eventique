from rest_framework import serializers
from ..models import UserProfileModel,UserMediaGalleryModel
from django.contrib.auth import get_user_model
from ..serializers_utils import UtilsUserModelSerializer

class WebsiteUserProfileModelSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserProfileModel
        fields = "__all__"
    
    def get_user(self,obj):
        try:
            data = UtilsUserModelSerializer(obj.user).data
        except:
            data=None
        return data

class WebsiteUserProfileModelUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfileModel
        exclude = ('user','profile_pic')

    def update(self,obj,validated_data):
        request = self.context['request']
        user = request.user
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        user.save()
        if 'pic_uploaded' in request.data:
            if request.data['pic_uploaded']=='true':
                image_instance,created = UserMediaGalleryModel.objects.get_or_create(user=user)
                image_instance.media = request.FILES.get('profile_pic')
                image_instance.save()
                obj.profile_pic = image_instance.media.url
        obj.gender = validated_data.get('gender',None)
        obj.bio = validated_data.get('bio',None)
        obj.dob = validated_data.get('dob',None)
        obj.location = validated_data.get('location',None)
        obj.save()        
        return validated_data