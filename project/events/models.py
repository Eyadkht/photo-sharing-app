from django.db import models
from django.conf import settings

# Create your models here.

class Event(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(verbose_name="Description")
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_events')