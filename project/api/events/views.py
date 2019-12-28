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
from project.api.events.permissions import IsEventOrganizer

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

class EventDetailPublicUser(APIView):
    @transaction.atomic
    def get(self, request, url_key):
        
        try:
            event = Event.objects.get(url_key=url_key)
        except Event.DoesNotExist:
            content = {'details': "Event not Found"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        if event.is_password_protected:
            content = {'detail': "Event is password protected"}
            return Response(content, status=status.HTTP_401_UNAUTHORIZED)
        else:
            event_serializer = EventPublicUserSerializer(event,context={'request': request})
            return Response(event_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, url_key):
        
        try:
            password = request.data['password']
        except Event.DoesNotExist:
            content = {'details': "Password parameter not Found"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        
        try:
            event = Event.objects.get(url_key=url_key)
        except Event.DoesNotExist:
            content = {'details': "Event not Found"}
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        if event.is_password_protected:
            if event.password == password:
                event_serializer = EventPublicUserSerializer(event,context={'request': request})
                return Response(event_serializer.data, status=status.HTTP_200_OK)
            else:
                content = {'detail': "Password is incorrect"}
                return Response(content, status=status.HTTP_401_UNAUTHORIZED)

        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    