from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    shoppingLists = models.ManyToManyField("ShoppingList", related_name='shoppingLists')
    recipes = models.ManyToManyField("Recipe", related_name='recipes')

    def __str__(self):
        return self.email
class ListBase(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    creation_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    content = models.JSONField()

    class Meta:
        abstract = True  # This makes the model abstract and not create a table for it

    def __str__(self):
        return self.name
class ShoppingList(ListBase):
    pass
class Recipe(ListBase):
    pass