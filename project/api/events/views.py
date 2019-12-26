from django.db import transaction
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from project.api.events.serializers import ImageSerializer
from project.events.models import Image


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