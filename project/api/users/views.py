from project.users.models import User
from project.api.users.serializers import UserSerializer
from rest_framework import generics


class SnippetList(generics.ListCreateAPIView):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer


class SnippetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer