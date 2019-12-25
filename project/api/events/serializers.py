from rest_framework import serializers
from project.events.models import Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image','event','nickname']