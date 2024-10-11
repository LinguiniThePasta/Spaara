from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    shoppingLists = models.ManyToManyField("Shopping", related_name='shoppingLists')
    recipes = models.ManyToManyField("Recipe", related_name='recipes')
    favorites = models.ManyToManyField("FavoriteItem", related_name = 'favorites')

    def __str__(self):
        return self.email

class FavoriteItem(models.Model):
    name = models.CharField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    store = models.CharField()

    def __str__(self):
        return self.name

'''    
# A grocery item
class GroceryItem(models.Model):
    name = models.CharField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    store = models.CharField()
    # Define a many-to-one relationship between grocery lists and items, cascade deletion upon list deletion
    grocery_list = models.ForeignKey(GroceryList, on_delete=models.CASCADE, related_name="items")

    def __str__(self):
        return self.name
'''
'''
NUTRITION DATA
If we can reliably find this data, maybe we should attach it to items for the user. Commented for now.

# Nutrition facts
class NutritionFacts(models.Model):
    item = models.OneToOneField(
        GroceryItem,
        on_delete=models.CASCADE,
    )

    calories = models.IntegerField()

# Serving
class ServingInfo(models.Model):
    nutrition_facts = models.OneToOneField(
        NutritionFacts,
        on_delete=models.CASCADE,
    )

    serving_size = models.DecimalField(max_digits=10, decimal_places=2)
    serving_units = models.CharField(max_length=20)

    servings_per_item = models.DecimalField(max_digits=10, decimal_places=2)

# Fats
class Fats(models.Model):
    nutrition_facts = models.OneToOneField(
        NutritionFacts,
        on_delete=models.CASCADE,
    )

    total_fat = models.DecimalField(max_digits=10, decimal_places=2)
    saturated_fat = models.DecimalField(max_digits=10, decimal_places=2)
    trans_fat = models.DecimalField(max_digits=10, decimal_places=2)

# Carbs
class Carbohydrates(models.Model):
    nutrition_facts = models.OneToOneField(
        NutritionFacts,
        on_delete=models.CASCADE,
    )

    total_carbs = models.DecimalField(max_digits=10, decimal_places=2)
    dietary_fiber = models.DecimalField(max_digits=10, decimal_places=2)
    total_sugar = models.DecimalField(max_digits=10, decimal_places=2)
    added_sugar = models.DecimalField(max_digits=10, decimal_places=2)
'''
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
class Shopping(ListBase):
    pass
class Recipe(ListBase):
    pass
