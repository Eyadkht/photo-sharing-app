from rest_framework import serializers
from project.events.models import Image, Event

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Image
        fields = ['image','event','nickname']

class EventSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Event
        fields = ['name', 'description','url_key']
        read_only_fields = ('url_key',)