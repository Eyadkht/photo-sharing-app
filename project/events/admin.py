from django.contrib import admin
from project.events.models import Event, Image

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display=('name','description','organizer')

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display=('image','event','nickname')