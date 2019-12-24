from django.db import models
from django.conf import settings

# Create your models here.

# Functions related to Media Uploads
def event_image_directory_path(instance, filename):
    '''
    Image will be uploaded to the following path events/<event_id>_<event_name>/images/<filename>
    '''
    return 'events/id_{0}_{1}/images/{2}/{3}'.format(instance.event.pk, instance.event.name, instance.pk, 'event_'+filename)

class Event(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(verbose_name="Description")
    organizer = models.ForeignKey('users.user', on_delete=models.CASCADE, related_name='user_events')

    def __str__(self):
        return self.name

class Image(models.Model):
    image = models.ImageField(upload_to=event_image_directory_path, blank=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_images')

    def __str__(self):
        return self.image.name