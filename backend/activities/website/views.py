from rest_framework import generics,status,permissions,views
from rest_framework.response import Response
from ..models import PollModel,MessageModel,QAModel,ForumModel
from events.models import EventDetailModel
from .serializers import WebsitePollModelCreateSerializer,WebsitePollModelListSerializer,WebsiteMessageModelListSerializer,WebsiteMessageModelCreateSerializer,WebsiteQAModelCreateSerializer,WebsiteQAModelListSerializer

class WebsitePollModelCreateAPIView(generics.CreateAPIView):
    queryset = PollModel.objects.all()
    serializer_class=WebsitePollModelCreateSerializer
    permission_classes=[permissions.IsAuthenticated]

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Poll Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsitePollModelListAPIView(generics.GenericAPIView):
    queryset = PollModel.objects.all()
    serializer_class=WebsitePollModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            event = EventDetailModel.objects.get(id=id)
            queryset=event.PollModel_event.all().order_by('-created_at')
            serializer = self.serializer_class(queryset, many=True,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsitePollModelGenericAPIView(generics.GenericAPIView):
    queryset = PollModel.objects.all()
    serializer_class=WebsitePollModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def delete(self,request,id):
        try:
            queryset= self.queryset.get(pk=id)
            if request.user.pk != queryset.event.organiser.pk:
                return Response({"message" : "You are not authorized to update this event"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                queryset.delete()
                return Response({"message" : "Deleted Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsiteMessageModelListAPIView(generics.GenericAPIView):
    queryset = MessageModel.objects.all()
    serializer_class=WebsiteMessageModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            event = EventDetailModel.objects.get(id=id)
            forum_instance,created=ForumModel.objects.get_or_create(event = event)
            queryset=forum_instance.messages.all()
            serializer = self.serializer_class(queryset, many=True,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)


class WebsiteMessageModelCreateAPIView(generics.CreateAPIView):
    queryset = MessageModel.objects.all()
    serializer_class=WebsiteMessageModelCreateSerializer
    permission_classes=[permissions.IsAuthenticated]

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Message Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)


class WebsiteQAModelListAPIView(generics.GenericAPIView):
    queryset = QAModel.objects.all()
    serializer_class=WebsiteQAModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            event = EventDetailModel.objects.get(id=id)
            queryset=event.QAModel_event.all()
            serializer = self.serializer_class(queryset, many=True,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)



class WebsiteQModelCreateAPIView(generics.CreateAPIView):
    queryset = QAModel.objects.all()
    serializer_class=WebsiteQAModelCreateSerializer
    permission_classes=[permissions.IsAuthenticated]

    def create(self, request):
        try:
            serializer  = self.serializer_class(data=request.data,context={'request':request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message" : "Message Created Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : serializer.errors}, status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response({"message" : f"something went wrong, {e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsiteQAModelGenericAPIView(generics.GenericAPIView):
    queryset = QAModel.objects.all()
    serializer_class=WebsiteQAModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def delete(self,request,id):
        try:
            queryset= self.queryset.get(pk=id)
            if request.user.pk != queryset.event.organiser.pk:
                return Response({"message" : "You are not authorized to update this event"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                queryset.delete()
                return Response({"message" : "Deleted Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsiteQAModelUpdateAPIView(views.APIView):
    permission_classes=[permissions.IsAuthenticated]

    def put(self,request,id):
        try:
            qa_instance = QAModel.objects.get(id=id)
            if self.request.user.pk != qa_instance.event.organiser.pk:
                return Response({"message" : "You are not authorized to answer this question"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if request.data.get('answer',None):
                    qa_instance.answer = request.data.get('answer',None)
                    qa_instance.is_answered=True
                else:
                    qa_instance.is_answered=False
                qa_instance.save()
                return Response({"message" : "Answer Updated Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong: {e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsitePollModelUpdateAPIView(views.APIView):
    permission_classes=[permissions.IsAuthenticated]

    def put(self,request,id):
        try:
            poll_instance = PollModel.objects.get(id=id)
            if not poll_instance.votes.filter(pk=request.user.pk).exists():
                poll_instance.votes.add(request.user)
                option_instance = poll_instance.options.filter(id=request.data['option']).first()
                option_instance.votes = option_instance.votes+1
                option_instance.save()
                poll_instance.save()
            return Response({"message" : "Vote Updated Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong: {e}"}, status=status.HTTP_400_BAD_REQUEST)
