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

class PostCommentSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    user = ProfileSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply = serializers.PrimaryKeyRelatedField(read_only=True)
    # replies = PostReplySerializer(many=True, read_only=True)
    class Meta:
        model = PostComment
        fields = ['comment_id','post', 'user', 'comments', 'replies', 'reply']

    def get_replies(self, obj):
        rep = obj.reply
        qs = PostComment.objects.filter(reply=obj.comment_id)
        qs = [item.comment_id for item in qs]
        return qs
    
class PostSerializer(serializers.ModelSerializer):
    post_pictures = PostPictureSerializer(many=True, read_only=True)
    post = PostCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['post_id', 'poster', 'words', 'created', 'post_pictures', 'post']

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

    class Meta:
        model = Messages
        fields = [
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