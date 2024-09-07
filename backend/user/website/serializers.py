from rest_framework import serializers
from django.contrib.auth import get_user_model
from core.utils import generate_otp,send_email_otp,normalize_email
from ..models import EmailOtpVerifyModel
from userprofile.models import UserProfileModel


class WebsiteEmailOtpVerifyModelCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailOtpVerifyModel
        fields = ['email']

    def validate(self,data):
        if ('email' not in data) or (data['email']=="" or data['email'] is None):
            raise serializers.ValidationError({'message':'Enter a valid email'})
        if get_user_model().objects.filter(email=normalize_email(data['email'])).exists():
            raise serializers.ValidationError({'message':'Account with this email already exists'})
        return data

    def create(self,validated_data):
        validated_data['email'] = normalize_email(validated_data['email'])
        EmailOtpVerifyModel.objects.filter(email=validated_data['email']).delete()
        validated_data['otp'] = generate_otp()
        if send_email_otp(validated_data['otp'],validated_data['email']):
            EmailOtpVerifyModel.objects.create(**validated_data)
        return validated_data
    
class WebsiteUserModelCreateSerializer(serializers.ModelSerializer):
    gender=serializers.CharField(write_only=True,required=False)
    
    class Meta:
        model = get_user_model()
        fields = ["password","email","first_name","last_name","gender"]

    def validate(self,data):
        if ('email' not in data) or (data['email'] is None or data['email'] == ''):
            raise serializers.ValidationError({"message":"Email is required"})
        if "password" not in data or len(data['password'])<5:
            raise serializers.ValidationError({"message":"Password must be at least 5 characters"})
        return data

    def create(self,validated_data):
        gender= validated_data.pop('gender',None)
        validated_data['email']=normalize_email(validated_data['email'])
        user = get_user_model().objects.create_user(**validated_data)
        if user:
            user_profile=UserProfileModel.objects.create(user=user)
            if gender:
                user_profile.gender=gender
            user_profile.save()
            user.save()            
        return validated_data