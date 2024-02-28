from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
from .models import ChatInbox, Messages
from django.contrib.auth import get_user_model
from .serializers import MessageSerializer, ChatInboxSerializer
from django.db.models import Q

User = get_user_model()

class NewChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.auth_user = None
        self.friend_user = None
        self.notification = None
    
    def connect(self):
        print("I am connected!")
        self.room_name_friend = self.scope["url_route"]["kwargs"]["roomName"]
        self.auth_user = self.scope['user']
        #self.user = self.scope['user']
        #if not user.is_authenticated:
        #    return
        self.friend = self.room_name_friend.split("-")[1]
        self.friend_user = User.objects.get(username=self.friend)
        self.room_name = self.room_name_friend.split("-")[0]
        print(self.room_name, self.auth_user, self.friend)
        self.new_group = self.room_name
        #self.syn_group = "chat_{}_{}".format(self.auth_user, self.friend)
        #print(self.new_group, self.syn_group)
        prev_msgs = Messages.objects.filter(
            Q(sender=self.auth_user, receiver=self.friend_user)|
            Q(sender=self.friend_user, receiver=self.auth_user)).order_by('created').all().reverse()[:10]
        print(prev_msgs)
        self.chat, created = ChatInbox.objects.get_or_create(name=self.new_group)
        self.notification = self.friend_user.username + "_notify"
        async_to_sync(self.channel_layer.group_add)(
            self.new_group, self.channel_name 
        )
        async_to_sync(self.channel_layer.group_add)(
            self.notification, self.channel_name
        )
        self.accept()
        # self.send(json.dumps( 
        #     {
        #         "type": "welcome_message",
        #         "message": "Hey buddy, I am new consumer...you are connected succsfully!"
        #     })
        # )
        self.send(json.dumps( 
            {
                "type": "previous_message",
                "message": MessageSerializer(prev_msgs, many=True).data
            })
        )

        # self.notification = self.friend_user.username + "_notify"
        # print(self.notification)
        # async_to_sync(self.channel_layer.group_send)(
        #     self.notification,
        #     {
        #         "type": "notify.me",
        #         "message": "something cooking, your friend connected"
        #     } 
        # )
    
    def disconnect(self, code):
        print("You are disconnected!")
        async_to_sync(self.channel_layer.group_discard)(self.new_group, self.channel_name)
        async_to_sync(self.channel_layer.group_discard)(self.notification, self.channel_name)
        return super().disconnect(code)
    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        message = text_data_json["message"]
        if message_type == "chat_message":
            message = Messages.objects.create(
                room_name=self.chat,
                sender = self.auth_user,
                receiver = self.friend_user,
                text_message = message
            )
        #print(MessageSerializer(message).data)
        async_to_sync(self.channel_layer.group_send)(
            self.new_group,
            {
                "type": "chat_message",
                "message": MessageSerializer(message).data
            } 
        )
        inbox = ChatInbox.objects.filter(name__icontains=self.auth_user.username).all()
        chat_room_with_messages = [Messages.objects.filter(room_name=room).order_by("-created").first() for room in inbox if room.messages]
        #notifications
        #self.notification = self.friend_user.username + "_notify"
        print(self.notification)
        async_to_sync(self.channel_layer.group_send)(
            self.notification,
            {

                "type": "notify_message",
                "welcome": MessageSerializer(chat_room_with_messages, many=True).data
            })
    
    def chat_message(self, event):
        print(event["message"])
        message = event["message"]
        self.send(json.dumps(
            {
                "type": "chat_message",
                "message": message
            }
        ))

    def notify_message(self, event):
        print(event["welcome"])
        message = event["welcome"]
        self.send(json.dumps(
            {
                "welcome": message
            }
        ))

class NotificationsConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
    
    def connect(self):
        self.user = self.scope['user']
        self.accept()
        self.notification = self.user.username + "_notify"
        print(self.user, self.notification)
        async_to_sync(self.channel_layer.group_add)(
            self.notification, self.channel_name
        )
        # prev_msgs = Messages.objects.filter(
        #     Q(sender=self.user)|
        #     Q(receiver=self.user)).order_by('-created').all()
        #ChatInboxSerializer(chat_room_with_messages, many=True).data
        inbox = ChatInbox.objects.filter(name__icontains=self.user.username).all()
        chat_room_with_messages = [Messages.objects.filter(room_name=room).order_by("-created").first() for room in inbox if room.messages]
        # messages = Messages.objects.filter(receiver=self.user)
        self.send(json.dumps({
            "type": "previous_conv",
            "welcome": MessageSerializer(chat_room_with_messages, many=True).data}))

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.notification, self.channel_name
        ) 
        return super().disconnect(code)
    
    def notify_message(self, event):
        print(event["welcome"])
        message = event["welcome"]
        self.send(json.dumps(
            {
                "type": "new_message",
                "welcome": message
            }
        ))