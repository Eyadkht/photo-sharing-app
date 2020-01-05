from project.users.models import User
from project.api.users.serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer