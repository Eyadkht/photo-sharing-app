from project.users.models import User
from rest_framework import serializers
from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email','password']

    @transaction.atomic
    def create(self, validated_data):
        user_password = validated_data.pop('password')
        user = User.objects.create(username=validated_data['username'],
                                    email=validated_data['email'])
        user.set_password(user_password)
        user.save()
        
        return user

    @transaction.atomic
    def update(self, instance, validated_data):
        user_password = validated_data.pop('password')
        instance.username = validated_data["username"]
        instance.email = validated_data["email"]
        instance.set_password(user_password)
        instance.save()
        
        return instance