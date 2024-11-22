"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter

from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'api/grocery', GroceryListViewSet, basename='grocery')
router.register(r'api/grocery_items/optimized', GroceryItemOptimizedViewSet, basename='optimized-item')
router.register(r'api/grocery_items/unoptimized', GroceryItemUnoptimizedViewSet, basename='unoptimized-item')
router.register(r'api/recipe', RecipeViewSet, basename='recipe')
router.register(r'api/recipe_items', RecipeItemViewSet, basename='recipe-item')
router.register(r'api/favorited/items', FavoritedItemViewSet, basename='favorited-item')
router.register(r'api/friend_requests', FriendRequestViewSet, basename='friend-request')
router.register(r'api/friend_recipe', FriendRecipeViewSet, basename='friend-recipe')
router.register(r'api/user/addresses', AddressViewSet, basename='addresses')
'''
Create: POST /api/grocery
Read All: GET /api/grocery
Read One: GET /api/grocery/{id}
Update: PUT /api/grocery/{id} or PATCH /api/grocery/{id}
Delete: DELETE /api/grocery/{id}
'''


urlpatterns = [

    path('accounts', include('allauth.urls')),
    path('admin', admin.site.urls),
    path('api/user/login', LoginView.as_view(), name='login'),
    path('api/user/register', RegisterView.as_view(), name='register'),
    path('api/user/delete', DeleteUserView.as_view(), name='delete_user'),
    path('api/user/save_settings', SettingsView.as_view(), name='save_dietary_restrictions'),
    path('api/user/update_info', UpdateInfoView.as_view(), name='update_info'),
    path('api/user/profile_info', ProfileView.as_view(), name='profile_info'),
    path('api/other_users', OtherUsersView.as_view(), name='other_users'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('api/user/friends', FriendsView.as_view(), name='friends'),
    path('api/maps/address_predictions', AutocompleteView.as_view(), name='address'),
    path('api/maps/locations/stores', StoreView.as_view(), name='stores'),
    path('api/forgot-password', ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/optimize', OptimizeView.as_view(), name='optimize'),
    path('api/suggest_stores', StoreItemSuggestionsView.as_view(), name='optimize'),
    # path('api/shopping/create', ShoppingListView.as_view(), name='save_shopping_list'),
    # path('api/shopping/get', ShoppingListView.as_view(), name='get_shopping_list'),
    # path('api/shopping/delete', ShoppingListView.as_view(), name='delete_shopping_list'),
    # path('api/shopping/export', ExportShoppingListView.as_view(), name='export_shopping_list'),
    # path('api/recipe/create', RecipeView.as_view(), name='save_recipe'),
    # path('api/recipe/get', RecipeView.as_view(), name='get_recipe'),
    # path('api/recipe/export', ExportRecipeView.as_view(), name='export_recipe'),
    # path('api/recipe/delete', RecipeView.as_view(), name='delete_recipe'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/favorites/get', FavoriteView.as_view(), name='get_favorite'),
    # path('api/favorites/add', FavoriteView.as_view(), name='add_favorite'),
    # path('api/favorites/delete', FavoriteView.as_view(), name='delete_favorite'),
    path('', include(router.urls)),
]

