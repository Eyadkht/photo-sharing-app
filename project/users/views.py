import os
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.
def testing_endpoint(request):
    if os.getenv('GAE_APPLICATION', None):
        value = os.getenv('GAE_APPLICATION')
        
        return HttpResponse(value)
    else:
        return HttpResponse("no GAE")

class TestProtectedAPI(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        
        content = {'message': 'Hello, '+ request.user.username}
        return Response(content)