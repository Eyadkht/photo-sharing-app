from .base import *


# SECURITY WARNING: App Engine's security features ensure that it is safe to
# have ALLOWED_HOSTS = ['*'] when the app is deployed. If you deploy a Django
# app not on App Engine, make sure to set an appropriate host here.
# See https://docs.djangoproject.com/en/2.1/ref/settings/
ALLOWED_HOSTS = ['*']

DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
# Update the secret key to a value of your own before deploying the app.
SECRET_KEY = '2$geg+fmgd#rificatw1x8r1bloktbl*utc%z_qtczqt6-9qec'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

# Install PyMySQL as mysqlclient/MySQLdb to use Django's mysqlclient adapter
# See https://docs.djangoproject.com/en/2.2/ref/databases/#mysql-db-api-drivers
# for more information
import pymysql  # noqa: 402
pymysql.install_as_MySQLdb()

DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'HOST': '/cloudsql/reflected-flux-261021:europe-west2:polls-instance',
            'USER': 'usertest',
            'PASSWORD': 'test!@#$$',
            'NAME': 'polls',
        }
}

#ALLOWED_HOSTS = ['localhost', '127.0.0.1', '188.166.110.206', 'tallyapp.me', 'www.tallyapp.me']

EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'Tally App <noreply@tallyapp.me>'