from rest_framework import generics,status,permissions,filters,views
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from ..models import EventDetailModel,EventCategoryModel,EventAttendeeModel
from .serializers import WebsiteEventDetailModelCreateSerializer,WebsiteEventDetailModelUpdateSerializer,WebsiteEventDetailModelListSerializer,WebsiteEventCategoryModelListSerializer,WebsiteEventAttendeeModelCreateSerializer,WebsiteEventAttendeeModelUserTicketListSerializer,WebsiteEventAttendeeModelEventAttendeeListSerializer
from ..serializers_utils import UtilsEventDetailModelSerializer


class WebsiteEventDetailModelListAPIView(generics.ListAPIView):
    serializer_class = UtilsEventDetailModelSerializer
    pagination_class = LimitOffsetPagination
    filter_backends=[DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
    filterset_fields=['category',]
    search_fields=['title','category__title','venue','location']
    ordering_fields=['created_at','title','price_range']

    def get_queryset(self):
        query_params = self.request.GET
        if 'custom' in query_params:
            queryset = EventDetailModel.objects.all()
            if query_params.get('start_date',None):
                queryset= queryset.filter(start_date__lte=query_params.get('start_date'))
            if query_params.get('price_range',None):
                queryset= queryset.filter(price_range__lte=float(query_params.get('price_range')))
            return queryset
        return EventDetailModel.objects.all()
    
class WebsiteEventDetailModelUserEventListAPIView(generics.ListAPIView):
    serializer_class = WebsiteEventDetailModelListSerializer
    permission_classes=[permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return self.request.user.EventDetailModel_organiser.all().order_by("-created_at")

class WebsiteEventDetailModelUserEventGetAPIView(generics.GenericAPIView):
    queryset = EventDetailModel.objects.all()
    serializer_class=WebsiteEventDetailModelListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            queryset=self.queryset.get(pk=id)
            serializer = self.serializer_class(queryset, many=False,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
class WebsiteEventDetailModelGetAPIView(generics.GenericAPIView):
    queryset = EventDetailModel.objects.all()
    serializer_class=UtilsEventDetailModelSerializer

    def get(self,request,id):
        try:
            queryset=self.queryset.get(pk=id)
            serializer = self.serializer_class(queryset, many=False,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
class WebsiteEventDetailModelCreateAPIView(generics.CreateAPIView):
    queryset = EventDetailModel.objects.all()
    serializer_class=WebsiteEventDetailModelCreateSerializer
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


class WebsiteEventDetailModelGenericAPIView(generics.GenericAPIView):
    queryset = EventDetailModel.objects.all()
    serializer_class=WebsiteEventDetailModelUpdateSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            queryset=self.queryset.get(pk=id)
            serializer = self.serializer_class(queryset, many=False,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self,request,id):
        try:
            queryset=self.queryset.get(pk=id)
            serializer = self.serializer_class(data=request.data,instance=queryset ,context={"request" : request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,id):
        try:
            queryset= self.queryset.get(pk=id)
            if request.user.pk != queryset.organiser.pk and queryset.capacity == queryset.available:
                return Response({"message" : "You are not authorized to update this event"}, status=status.HTTP_400_BAD_REQUEST)
            elif queryset.capacity != queryset.available:
                return Response({"message" : "Some tickets are already booked, Contact Admin to Update !!!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                queryset.delete()
                return Response({"message" : "Deleted Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)

class WebsiteEventCategoryModelListAPIView(generics.ListAPIView):
    queryset = EventCategoryModel.objects.all()
    serializer_class = WebsiteEventCategoryModelListSerializer

class WebsiteEventDetailModelPrivacyUpdateAPIView(views.APIView):
    permission_classes=[permissions.IsAuthenticated]

    def put(self,request,id):
        try:
            event_instance = EventDetailModel.objects.get(id=id)
            if self.request.user.pk != event_instance.organiser.pk:
                return Response({"message" : "You are not authorized to update this event"}, status=status.HTTP_400_BAD_REQUEST)
            elif event_instance.available != event_instance.capacity:
                return Response({"message" : "Some tickets are already booked, Contact Admin to Update !!!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                event_instance.is_private = not event_instance.is_private
                event_instance.save()
                return Response({"message" : "Privacy Updated Successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong: {e}"}, status=status.HTTP_400_BAD_REQUEST)


class WebsiteEventAttendeeModelCreateAPIView(generics.CreateAPIView):
    queryset = EventAttendeeModel.objects.all()
    serializer_class=WebsiteEventAttendeeModelCreateSerializer
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


class WebsiteEventAttendeeModelUserTicketListAPIView(generics.ListAPIView):
    serializer_class = WebsiteEventAttendeeModelUserTicketListSerializer
    permission_classes=[permissions.IsAuthenticated]


    def get_queryset(self):
        return self.request.user.EventAttendeeModel_user.all().order_by('-created_at')
    
class WebsiteEventAttendeeModelEventAttendeeListAPIView(generics.GenericAPIView):
    queryset = EventAttendeeModel.objects.all()
    serializer_class=WebsiteEventAttendeeModelEventAttendeeListSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get(self,request,id):
        try:
            event = EventDetailModel.objects.get(id=id)
            queryset=event.EventAttendeeModel_event.all().order_by('-created_at')
            serializer = self.serializer_class(queryset, many=True,context={"request" : request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)