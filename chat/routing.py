from django.urls import re_path, path
from . import consumer


websocketpatterns = [
    #re_path(r"ws/(?P<auth_user>)*/$", consumer.NewChatConsumer.as_asgi()),
    #re_path(r'/ws/[a-z][0-9]\+/$', consumer.NewChatConsumer.as_asgi()),
    path("ws/<str:roomName>/", consumer.NewChatConsumer.as_asgi()),
    path("notifications/", consumer.NotificationsConsumer.as_asgi()),
]