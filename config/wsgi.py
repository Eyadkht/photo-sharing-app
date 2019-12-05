"""
WSGI config for photo_sharing project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

if os.getenv('GAE_APPLICATION', None):
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
    else
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_wsgi_application()