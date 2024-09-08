from rest_framework import generics,status,permissions,filters
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from ..models import EventDetailModel
from .serializers import WebsiteEventDetailModelCreateSerializer,WebsiteEventDetailModelUpdateSerializer,WebsiteEventDetailModelListSerializer
from ..serializers_utils import UtilsEventDetailModelSerializer


class WebsiteEventDetailModelListAPIView(generics.ListAPIView):
    serializer_class = UtilsEventDetailModelSerializer
    pagination_class = LimitOffsetPagination
    filter_backends=[DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]
    filterset_fields=['category',]
    search_fields=['title','category__title','venue','location']
    ordering_fields=['created_at',]

    def get_queryset(self):
        return EventDetailModel.objects.all()
    
class WebsiteEventDetailModelUserEventListAPIView(generics.ListAPIView):
    serializer_class = WebsiteEventDetailModelListSerializer
    permission_classes=[permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return self.request.user.EventDetailModel_organiser.all().order_by("-created_at")

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


class WebsiteRecipeModelGenericAPIView(generics.GenericAPIView):
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
            if request.user.pk == queryset.organiser.pk:
                queryset.delete()
                return Response({"message" : "Deleted Successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message" : "Not Allowed"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message" : f"Something went wrong-->{e}"}, status=status.HTTP_400_BAD_REQUEST)
