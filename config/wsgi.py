"""
WSGI config for photo_sharing project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

if os.getenv('GAE_APPLICATION', None):
        value =  os.getenv('GAE_APPLICATION', None)
        
        if value == "g~photosharingapp-261121":
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

        elif value == "g~photosharingapp-staging":
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.staging')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_wsgi_application()