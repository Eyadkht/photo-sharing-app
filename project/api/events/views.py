from django.db import transaction
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from project.api.events.serializers import ImageSerializer, EventSerializer, EventPublicUserSerializer
from project.events.models import Image, Event
from project.users.models import User
from rest_framework.permissions import IsAuthenticated
from django.core import exceptions
from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission

class ImageUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

      image_serializer = ImageSerializer(data=request.data)

      if image_serializer.is_valid():
          image_serializer.save()
          return Response(image_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MediaInteraction(APIView):
    @transaction.atomic
    def put(self, request):
       
        media_id = request.data['image_id']

        # Checking if in Image object with the requested id exists
        try:
            media = Image.objects.get(pk=int(media_id))
        except Image.DoesNotExist:
            content = {'details': "Media does not exist"}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        
        #  Increasing the total number of likes by 1
        media.likes = media.likes + 1
        likes = media.likes
        media.save()

        content = {"new_likes":likes}

        return Response(content, status=status.HTTP_200_OK)

class IsEventOrganizer(BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user.pk == obj.organizer.pk
        
class EventList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = EventSerializer
    
    def list(self, request):
        try:
            organizer = User.objects.get(username=request.user.username)
        except User.DoesNotExist:
            content = {'details': "User does not exist"}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Event.objects.filter(organizer=organizer)
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,IsEventOrganizer,)
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class MultipleFieldLookupMixin(object):
    """
    Apply this mixin to any view or viewset to get multiple field filtering
    based on a `lookup_fields` attribute, instead of the default single field filtering.
    """
    def get_object(self):
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs[field]: # Ignore empty fields.
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj

class EventDetailPublicUser(MultipleFieldLookupMixin, generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventPublicUserSerializer
    lookup_fields = ['url_key']