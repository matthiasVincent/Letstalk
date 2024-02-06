from django.contrib import admin

# Register your models here.
from .models import (Profile, Post, Post_Picture, Profile_Picture, Cover_Picture
                     , LikePost, PostComment, ChatInbox, Coversation
                     , Followers, Messages)

admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(Post_Picture)
admin.site.register(Profile_Picture)
admin.site.register(Cover_Picture)
admin.site.register(LikePost)
admin.site.register(PostComment)
admin.site.register(ChatInbox)
admin.site.register(Coversation)
admin.site.register(Followers)
admin.site.register(Messages)
