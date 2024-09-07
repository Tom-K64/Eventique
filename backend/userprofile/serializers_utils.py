from rest_framework import serializers
from django.contrib.auth import get_user_model

class UtilsUserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ('password','groups','user_permissions',)