"""
ASGI config for Letstalk project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
#import django
from django.core.asgi import get_asgi_application
from channels.routing import get_default_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import URLRouter
from channels.routing import ProtocolTypeRouter
#from chat.routing import websocketpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Letstalk.settings')
#django.setup()
#from channels.routing import get_default_application
#application = get_default_application()
application = get_asgi_application()
import chat.routing
from chat.routing import websocketpatterns

application = ProtocolTypeRouter(
    {
   #     "http": application,
        "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(
            URLRouter(websocketpatterns),
        ))
    }
)
