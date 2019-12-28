from rest_framework import serializers
from project.events.models import Image, Event

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Image
        fields = ['pk','image','likes','uploaded_at','event','nickname']

class EventSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Event
        fields = ['pk','name', 'description','url_key','password','is_password_protected']
        read_only_fields = ('url_key',)

class EventPublicUserSerializer(serializers.ModelSerializer):
    event_images = ImageSerializer(many=True)

    class Meta:
        model = Event
        fields = ['pk','name', 'description','url_key','is_password_protected','event_images']