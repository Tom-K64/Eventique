from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserModelUtilsSerializer(serializers.ModelSerializer):
    profile_pic= serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = get_user_model()
        exclude= ('password','groups','user_permissions',)
    
    def get_profile_pic(self,obj):
        try:
            data = obj.UserProfileModel_user.profile_pic
        except:
            data=None
        return data