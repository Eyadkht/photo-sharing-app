from rest_framework.permissions import BasePermission

class IsEventOrganizer(BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user.pk == obj.organizer.pk