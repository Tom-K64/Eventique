from rest_framework import generics,status,permissions
from rest_framework.response import Response
from ..models import EventNotificationModel
from .serializers import WebsiteEventNotificationModelCreateSerializer

class WebsiteEventNotificationModelCreateAPIView(generics.CreateAPIView):
    queryset = EventNotificationModel.objects.all()
    serializer_class=WebsiteEventNotificationModelCreateSerializer
    permission_classes=[permissions.IsAuthenticated]

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Event Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)
