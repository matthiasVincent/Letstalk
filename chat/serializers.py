from .models import (Profile, Post, Post_Picture, Profile_Picture, Cover_Picture
                     , LikePost, PostComment, ChatInbox, Coversation
                     , Followers, Messages)
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id_user', 'username', 'location', 'fullname'
                  , 'cover_image', 'profile_image', 'dob', 'gender',
                  'created', 'favorite_quote', 'posts', 'followers',
                  'following']
        
class PostPictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_Picture
        fields = ['image', 'created']

class PostReplySerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    user = ProfileSerializer(read_only=True)
    reply = serializers.PrimaryKeyRelatedField(read_only=True)
    # replies = PostReplySerializer(many=True, read_only=True)
    class Meta:
        model = PostComment
        fields = ['comment_id','post', 'user', 'comments', 'reply']

# class PostCommentSerializer(serializers.ModelSerializer):
#     post = serializers.PrimaryKeyRelatedField(read_only=True)
#     user = ProfileSerializer(read_only=True)
#     replies = serializers.SerializerMethodField()
#     reply = serializers.PrimaryKeyRelatedField(read_only=True)
#     # replies = PostReplySerializer(many=True, read_only=True)
#     class Meta:
#         model = PostComment
#         fields = ['comment_id','post', 'user', 'comments', 'replies', 'reply']

#     def get_replies(self, obj):
#         rep = obj.reply
#         qs = PostComment.objects.filter(reply=obj.comment_id)
#         return qs
    
# class PostSerializer(serializers.ModelSerializer):
#     post_pictures = PostPictureSerializer(many=True, read_only=True)
#     poster = ProfileSerializer(read_only=True)
#     # post = PostCommentSerializer(many=True, read_only=True)
#     class Meta:
#         model = Post
#         fields = ['post_id', 'poster', 'words', 'created', 'post_pictures', 'all_likes', 'all_comments', 'all_likers']

class PostCommentSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply = serializers.PrimaryKeyRelatedField(read_only=True)
    # replies = PostReplySerializer(many=True, read_only=True)
    class Meta:
        model = PostComment
        fields = ['comment_id','post', 'user', 'comments', 'replies', 'reply', 'created']

    def get_replies(self, obj):
        rep = obj.reply
        qs = PostComment.objects.filter(reply=obj.comment_id).all()
        return PostCommentSerializer(qs, many=True).data
    
class PostSerializer(serializers.ModelSerializer):
    post_pictures = PostPictureSerializer(many=True, read_only=True)
    poster = ProfileSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    # post = PostCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['post_id', 'poster', 'words', 'created', 'post_pictures', 'all_likes', 'all_comments', 'all_likers', 'comments']
    
    def get_comments(self, obj):
        qs = PostComment.objects.filter(post=obj).all()
        return PostCommentSerializer(qs, many=True, read_only=True).data

class ProfilePictureSerailizer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, source='user.id_user')
    class Meta:
        model = Profile_Picture
        fields = ['user', 'photo', 'created']

class CoverPictureSerailizer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, source='user.id_user')
    class Meta:
        model = Cover_Picture
        fields = ['user', 'photo', 'created']

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    room_name = serializers.PrimaryKeyRelatedField(read_only=True, source="room_name.name")

    class Meta:
        model = Messages
        fields = [
            "room_name",
            "sender",
            "receiver",
            "text_message",
            "image_message",
            "created",
            "read",
        ]

    def get_sender(self, obj):
        return ProfileSerializer(obj.sender).data
    def get_receiver(self, obj):
        return ProfileSerializer(obj.receiver).data
    
class ConversationSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatInbox
        fields = ['id', 'name', 'other_user', 'last_message']

    def get_last_message(self, obj):
        messages = obj.messages_set.all().order_by("-created")


class ChatInboxSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatInbox
        fields = ['id', 'name']
    

    def get_messages(self, obj):
        all_messages = obj.messages
        print(all_messages)
        if all_messages is None or []:
            return None
        return MessageSerializer(all_messages, many=True).data




# class PostReplySerializer(serializers.ModelSerializer):
#     post = serializers.PrimaryKeyRelatedField(read_only=True)
#     user = ProfileSerializer(read_only=True)
#     class Meta:
#         model = PostComment
#         fields = ['comment_id','post', 'user', 'comments', 'reply']

# class PostCommentSerializer(serializers.ModelSerializer):
#     post = serializers.PrimaryKeyRelatedField(read_only=True)
#     user = ProfileSerializer(read_only=True)
#     replies = serializers.SerializerMethodField()
#     reply = serializers.PrimaryKeyRelatedField(read_only=True)
#     # replies = PostReplySerializer(many=True, read_only=True)
#     class Meta:
#         model = PostComment
#         fields = ['comment_id','post', 'user', 'comments', 'replies', 'reply']

#     def get_replies(self, obj):
#         rep = obj.reply
#         qs = PostComment.objects.filter(reply=obj.comment_id)
#         qs = [item.comment_id for item in qs]
#         return qs