from django.shortcuts import render
import os
from django.http import HttpResponse
    
# Create your views here.
def testing_endpoint(request):
    if os.getenv('GAE_APPLICATION', None):
        x = os.getenv('GAE_APPLICATION')
        
        context = {"env":type(x)}
        return HttpResponse(context)
    else:
        return HttpResponse("no GAE")