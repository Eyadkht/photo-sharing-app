from .base import *

# SECURITY WARNING: App Engine's security features ensure that it is safe to
# have ALLOWED_HOSTS = ['*'] when the app is deployed. If you deploy a Django
# app not on App Engine, make sure to set an appropriate host here.
# See https://docs.djangoproject.com/en/2.1/ref/settings/
#ALLOWED_HOSTS = ['localhost','www.domainname.com']
ALLOWED_HOSTS = ['*']

DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
# Update the secret key to a value of your own before deploying the app.
SECRET_KEY = '2$geg+fmgd#rificatw1x8r1bloktbl*utc%z_qtczqt6-9qec'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

# Install PyMySQL as mysqlclient/MySQLdb to use Django's mysqlclient adapter
# See https://docs.djangoproject.com/en/2.2/ref/databases/#mysql-db-api-drivers
# for more information

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'HOST': '/cloudsql/photosharingapp-261121:europe-west2:photosharing-instance',
            'USER': 'photoadmin',
            'PASSWORD': 'test!@#$$',
            'NAME': 'photosharingapp_db',
        }
}


