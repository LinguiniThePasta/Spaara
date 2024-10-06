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
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('accounts', include('allauth.urls')),
    path('admin', admin.site.urls),
    path('api/user/login', LoginView.as_view(), name='login'),
    path('api/user/register', RegisterView.as_view(), name='register'),
    path('api/user/update_info', UpdateInfoView.as_view(), name='update_info'),
    path('api/shopping/create', ShoppingListView.as_view(), name='save_shopping_list'),
    path('api/shopping/get', ShoppingListView.as_view(), name='get_shopping_list'),
    path('api/shopping/export', ExportShoppingListView.as_view(), name='export_shopping_list'),
    path('api/recipe/create', RecipeView.as_view(), name='save_recipe'),
    path('api/recipe/get', RecipeView.as_view(), name='get_recipe'),
    path('api/recipe/export', ExportRecipeView.as_view(), name='export_recipe'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]

