from django.urls import path
from project.api.users.views import SnippetDetail, SnippetList
from project.api.events.views import EventDetail, EventList, EventDetailPublicUser
from project.api.events.views import ImageUploadView, MediaInteraction

urlpatterns = [
    path('users/', SnippetList.as_view()),
    path('users/<int:pk>', SnippetDetail.as_view()),
    path('event/<str:url_key>',EventDetailPublicUser.as_view()),
    path('events/', EventList.as_view()),
    path('events/<int:pk>', EventDetail.as_view()),
    path('upload_image/', ImageUploadView.as_view()),
    path('delete_image/<int:pk>', ImageUploadView.as_view()),
    path('interact_media/',MediaInteraction.as_view()),
]