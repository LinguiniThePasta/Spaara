from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email

'''
GROCERY LIST MODEL

DATA FLOWDOWN
USER -> one to many -> GROCERYLIST -> one to many -> GROCERYITEM -> 1-2-1 -> NUTRITIONFACTS -> 1-2-1 -> (Fat, Carbohydrate, ServingInfo)
'''
# The grocery list
class GroceryList(models.Model):
    name = models.CharField(max_length = 20)
    creation_time = models.DateTimeField(auto_now_add=True)
    # Define a many-to-one relationship between users and grocery lists, cascade deletion upon account removal
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lists")

    def __str__(self):
        return self.name
    
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