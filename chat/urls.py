from django.urls import path, include
from .import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

# router = routers.DefaultRouter()
# router.register(r'users', views.UserViewset)
#router.register(r'user_posts', views.UserPostViewset)

urlpatterns = [
    path('', views.home, name="home"),
    path('signup/', views.signup, name="signup"),
    path('signin/', views.signin, name="signin"),
    path('setting/', views.setting, name="setting"),
    path('profile/<str:username>/', views.profile, name="profile"),
    path('post/', views.post, name="post"),
    path('dologout/', views.dologout, name="dologout"),
    path('likepost/', views.likepost, name="likepost"),
    path('editprofile/', views.editprofile, name="editprofile"),
    path('buddy/', views.buddy, name="buddy"),
    path('search/', views.search, name="search"),
    path('inbox/<str:profile>/', views.inbox, name="inbox"),
    path('getmessage/<str:profile_id>/', views.getmessage, name="getmessage"), 
    path('post_comment/<str:post_id>/', views.post_comment, name="post_comment"),
    path('replies/<str:comment_id>/', views.replies, name="replies"),
    # path('api/v1/', include(router.urls)),
    path('api/v1/user_posts/', views.UserPostView.as_view()),
    path('api/v1/user/friend_request/', views.FriendRequestView.as_view()),
    path('api/v1/user/friend_suggestion/', views.UserSuggestionView.as_view()),
    path('api/v1/user/buddy_list/', views.ConversationView.as_view()),
    #path('profile/<str:username>', views.profile_page, name="profile_page"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)