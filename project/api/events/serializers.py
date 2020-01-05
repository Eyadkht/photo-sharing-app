from rest_framework import serializers
from project.events.models import Image, Event
from rest_framework import pagination, serializers
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Image
        fields = ['pk','image','likes','uploaded_at','event','nickname']

class EventSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Event
        fields = ['pk','name', 'description','url_key','password','is_password_protected','location','date']
        read_only_fields = ('url_key',)

class CustomPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 50
    min_limit = 1
    min_offset = 1
    max_offset = 50
    def get_paginated_response(self, data):       
        return {
            'meta': {
               'limit': self.get_limit(self.request),
               'next': self.get_next_link(),
               'offset': self.get_offset(self.request),
               'previous': self.get_previous_link(),
               'total_count': self.count
            },
            'objects': data
        }
        
class EventPublicUserSerializer(serializers.ModelSerializer):
    event_images = serializers.SerializerMethodField('paginated_tracks')

    class Meta:
        model = Event
        fields = ['pk','name', 'description','url_key','is_password_protected','event_images','location','date']

    def paginated_tracks(self, obj):
        images = Image.objects.filter(event=obj)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(images, self.context['request'])
        serializer = ImageSerializer(page, many=True, context={'request': self.context['request']})
        return paginator.get_paginated_response(serializer.data)