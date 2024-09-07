from rest_framework import generics,status,views,permissions
from rest_framework.response import Response
from .serializers import WebsiteEmailOtpVerifyModelCreateSerializer,WebsiteUserModelCreateSerializer
from django.contrib.auth import get_user_model,authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import EmailOtpVerifyModel
from core.utils import normalize_email
from ..serializers_utils import UserModelUtilsSerializer

class WebsiteEmailSendOTPAPIView(generics.CreateAPIView):
    queryset = EmailOtpVerifyModel.objects.all()
    serializer_class =WebsiteEmailOtpVerifyModelCreateSerializer

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)

"""
{
    "email":"test@user.com",
    "otp":"123456"
}
"""
class WebsiteEmailVerifyOTPAPIView(views.APIView):
    def post(self,request):
        try:
            email=normalize_email(request.data['email'])
            if not EmailOtpVerifyModel.objects.filter(email=email).exists():
                return Response({"message" : "Try Again"},status=status.HTTP_400_BAD_REQUEST)
            instance = EmailOtpVerifyModel.objects.filter(email=email).last()
            if instance.otp == str(request.data['otp']):
                EmailOtpVerifyModel.objects.filter(email=email).delete()
                return Response({"message" : "OTP Verified"},status=status.HTTP_200_OK)
            else:
                return Response({"message" : "Invalid OTP"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)


class WebsiteUserModelCreateAPIView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = WebsiteUserModelCreateSerializer

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)

"""
{
    "email":"test@user.com",
    "password":"Hello@123"
}
"""
class WebsiteUserLoginAPIView(views.APIView):
    def post(self,request):
        try:
            email= normalize_email(request.data['email'])
            user=authenticate(request,username=email,password=request.data['password'])
            if user:
                refresh = RefreshToken.for_user(user)
                data={
                    "refresh":str(refresh),
                    "access":str(refresh.access_token),
                    "user":UserModelUtilsSerializer(user).data
                }
                return Response(data,status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid email or password"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"Something went wrong: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
class WebsiteChangePasswordAPIView(views.APIView):
    permission_classes=[permissions.IsAuthenticated]

    def put(self,request):
        try:
            user=request.user
            user_instance = authenticate(request,username=user.email,password=request.data['password'])
            if user_instance:
                user_instance.set_password(request.data['new_password'])
                user_instance.save()
                return Response({"message":"Password changed successfully"},status=status.HTTP_200_OK)
            else:
                return Response({"message" : "Invalid Old Password"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"Something went wrong: {e}"}, status=status.HTTP_400_BAD_REQUEST)