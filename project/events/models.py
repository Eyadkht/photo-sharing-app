from django.db import models
from django.conf import settings
import uuid
import hashlib

# Create your models here.

# Functions related to Media Uploads
def event_image_directory_path(instance, filename):
    '''
    Image will be uploaded to the following path events/<event_id>_<event_name>/images/<filename>
    '''
    return 'events/id_{0}_{1}/images/{2}'.format(instance.event.pk, instance.event.name, 'event_'+filename)

class Event(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(verbose_name="Description")
    organizer = models.ForeignKey('users.user', on_delete=models.CASCADE, related_name='user_events')
    url_key = models.CharField(max_length=256,blank=True)
    is_password_protected = models.BooleanField(default=False)
    password = models.CharField(max_length=256,blank=True,default="")

    def __str__(self):
        return self.name

    # Adding a default url_key to the object when it gets created
    def save(self, *args, **kwargs):
        if not self.pk:
            salt = uuid.uuid4().hex
            data = self.name + self.description + settings.SECRET_KEY
            hash_value = hashlib.sha256(salt.encode() + data.encode()).hexdigest()
            self.url_key = hash_value
        
        super(Event, self).save(*args, **kwargs)

class Image(models.Model):
    image = models.ImageField(upload_to=event_image_directory_path, blank=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_images')
    nickname = models.CharField(max_length=250)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.image.name