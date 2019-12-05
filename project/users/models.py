from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.

class User(AbstractUser):
    email = models.EmailField('email address', blank=True, null=True, unique=True)
    REQUIRED_FIELDS = ['email']