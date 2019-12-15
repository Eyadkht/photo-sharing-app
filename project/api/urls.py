from django.urls import path
from project.api.users import views

urlpatterns = [
    path('users/', views.SnippetList.as_view()),
    path('users/<int:pk>', views.SnippetDetail.as_view()),
]