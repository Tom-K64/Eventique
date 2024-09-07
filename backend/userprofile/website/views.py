from rest_framework import generics,status,permissions
from rest_framework.response import Response
from ..models import UserProfileModel
from .serializers import WebsiteUserProfileModelSerializer,WebsiteUserProfileModelUpdateSerializer

class WebsiteUserProfileModelGETAPIView(generics.GenericAPIView):
    serializer_class = WebsiteUserProfileModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user=self.request.user
        if user:
            return user.UserProfileModel_user
        return
    
    def get(self,request):
        try:
            serializer = self.serializer_class(self.get_queryset(), many=False,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)
        
class WebsiteUserProfileModelUpdateAPIView(generics.GenericAPIView):
    serializer_class = WebsiteUserProfileModelUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.UserProfileModel_user
    
    def put(self,request):
        try:
            serializer = self.serializer_class(data=request.data,instance=self.get_queryset() ,context={"request" : request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)
