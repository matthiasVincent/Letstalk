from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4

# Create your models here.
GENDER = (('MALE', 'MALE'), ('FEMALE', 'FEMALE'))


class Profile(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4)
    favorite_quote = models.TextField(blank=True, default="")
    location = models.CharField(max_length=100, blank=True, default="")
    profile_image = models.ImageField(upload_to="temp_file", default="blank-profile-picture.png")
    cover_image = models.ImageField(upload_to="temp_file", default="blank-profile-picture.png")
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    @property
    def fullname(self):
        return "{} {}".format(self.first_name, self.last_name)
    
    @property
    def followers(self):
        return Followers.objects.filter(following=self).count()
    
    @property
    def following(self):
        return Followers.objects.filter(follower=self).count()
    
    @property
    def posts(self):
        return Post.objects.filter(poster=self).count()

    
class Followers(models.Model):
    follower = models.ForeignKey(Profile, related_name="follower", on_delete=models.CASCADE)
    following = models.ForeignKey(Profile, related_name="following", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} following {}".format(self.follower.username, self.following.username)
    
class Profile_Picture(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="profile_pictures")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.fullname
        return username
    
class Cover_Picture(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="cover_pictures")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.fullname
        return username

class Post(models.Model):
    post_id = models.UUIDField(default=uuid4, primary_key=True)
    poster = models.ForeignKey(Profile, on_delete=models.CASCADE)
    words = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.poster.username
    
    @property
    def all_likes(self):
        likes = LikePost.objects.filter(post=self).count()
        return likes
    
    @property
    def all_likers(self):
        likes = LikePost.objects.filter(post=self).all()
        likers = [like.user for like in likes]
        return likers


    @property
    def all_comments(self):
        comments = PostComment.objects.filter(post=self).count()
        return comments
    @property
    def comments(self):
        return PostComment.objects.filter(post=self).all()

    @property
    def photos(self):
        return Post_Picture.objects.filter(post=self).all()
    
    
class Post_Picture(models.Model):
    post = models.ForeignKey(Post, blank=True, on_delete=models.CASCADE, related_name="post_pictures")
    image = models.ImageField(upload_to="mobile_uploads", default="blank-profile-picture.png")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.post.poster.username 

class LikePost(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return "Liked by {}".format(self.user.username)

class PostComment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid4)
    post= models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    comments = models.TextField(max_length=1000000)
    reply = models.ForeignKey("self",on_delete=models.CASCADE, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.post.post_id)
    
    @property
    def replies(self):
        qs = PostComment.objects.filter(reply=self).all()
        return qs

class Coversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    room_name = models.CharField(max_length=100)
    online_users = models.ManyToManyField(to=Profile, blank=True)

    def get_online_users(self):
        return self.online_users.count()
    
    def join(self, user):
        self.online_users.add(user)
        self.save()
    
    def leave(self, user):
        self.online_users.remove(user)
        self.save()

    def __str__(self):
        return "{} ({})".format(self.room_name, self.get_online_users())

class ChatInbox(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Messages(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    room_name = models.ForeignKey(ChatInbox, on_delete=models.CASCADE, related_name="chat_room")
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="receiver")
    text_message = models.TextField()
    image_message = models.ImageField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return "from {} to {}".format(self.sender.username, self.receiver.username)
