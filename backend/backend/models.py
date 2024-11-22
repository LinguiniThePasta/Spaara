import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
import uuid
from django.shortcuts import get_object_or_404

def default_addresses():
    return [{"id": 1, "name": "Current Location", "address": "Current Location", "icon": "location-arrow", "icontype":"fontawesome", "latitude": None, "longitude": None}]

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    username = models.CharField(unique=True)
    email = models.EmailField(unique=True)
    email_pending = models.EmailField(unique=True, null=True, default=None)     # Email pending is used to store the email that the user wants to change to until verification
    password = models.CharField(max_length=100)
    addresses = models.JSONField(default=default_addresses)
    selected_address_id = models.IntegerField(default=1)
    max_distance = models.DecimalField(max_digits=4, decimal_places=2, default=5.00)
    max_stores = models.IntegerField(default=3)
    is_active = models.BooleanField(default=True)     # This is used to determine if the user has verified their email. Set true for testing.
    # longitude = models.DecimalField(max_digits=50, decimal_places=20, default=0.0)
    # latitude = models.DecimalField(max_digits=50, decimal_places=20, default=0.0)
    diet_restrictions = models.ManyToManyField("DietRestriction", blank=True, related_name='users')
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    profile_icon = models.CharField(max_length=100, default="person")
    profile_color = models.CharField(max_length=100, default="#F6AA1C")
    theme_background = models.CharField(max_length=100, default="lightMode")
    theme_primary = models.CharField(max_length=100, default="lightMode")

    def __str__(self):
        return self.email

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


class DietRestriction(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='friend_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friend_requests_received', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user} to {self.to_user} ({self.status})"
    


class ListBase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    creation_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # This makes the model abstract and not create a table for it

    def __str__(self):
        return self.name


class Grocery(ListBase):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="groceries", default=None)



class Recipe(ListBase):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="recipes", default=None)

class Subheading(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    grocery = models.ForeignKey(Grocery, on_delete=models.CASCADE, related_name='subheadings')
    order = models.PositiveIntegerField(default=0)
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, related_name='subheadings', null=True, blank=True, default=None)

    class Meta:
        ordering = ['order']
        unique_together = ('grocery', 'recipe')  # Ensures a recipe is added only once per grocery list

    def __str__(self):
        return self.name


@receiver(post_save, sender=Grocery)
def create_default_subheading(sender, instance, created, **kwargs):
    if created:
        Subheading.objects.create(
            name='Default',  # You can choose a different default name if desired
            grocery=instance,
            order=1  # Initial order
            # recipe is null by default, supporting user-defined subheadings
        )

class ItemBase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    store = models.CharField(blank=True)

    class Meta:
        abstract = True


class GroceryItemOptimized(ItemBase):
    quantity = models.IntegerField()
    units = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    favorited = models.BooleanField(default=False)
    list = models.ForeignKey('Grocery', on_delete=models.CASCADE, related_name='optimized_items', default=None)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        FavoriteManager.register(self.__class__)


# class GroceryItemUnoptimized(ItemBase):
#     quantity = models.IntegerField()
#     units = models.CharField(max_length=20)
#     favorited = models.BooleanField(default=False)
#     list = models.ForeignKey('Grocery', on_delete=models.CASCADE, related_name='unoptimized_items', default=None)
#
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         FavoriteManager.register(self.__class__)
#

class GroceryItemUnoptimized(ItemBase):
    quantity = models.IntegerField()
    units = models.CharField(max_length=20)
    favorited = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    subheading = models.ForeignKey(Subheading, on_delete=models.CASCADE, related_name='items')


    def __str__(self):
        return self.name

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        FavoriteManager.register(self.__class__)


class RecipeItem(ItemBase):
    quantity = models.IntegerField()
    units = models.CharField(max_length=20)
    favorited = models.BooleanField(default=False)
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE, related_name='items', default=None)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        FavoriteManager.register(self.__class__)


class FavoritedItem(ItemBase):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorited_items', default=None)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        FavoriteManager.register(self.__class__)

@receiver(pre_save, sender=GroceryItemUnoptimized)
@receiver(pre_save, sender=RecipeItem)
def update_favorite(sender, instance, **kwargs):
    try:
        if (sender not in FavoriteManager.receivers):
            return
        old_instance = sender.objects.get(pk=instance.pk)
        if old_instance.favorited != instance.favorited:
            FavoriteManager.sync(instance)
    except sender.DoesNotExist:
        # Handle the case where the old instance does not exist
        pass


class FavoriteManager:
    receivers = []

    @classmethod
    def register(cls, model):
        cls.receivers.append(model)

    @classmethod
    def sync(self, instance):
        for receiver in self.receivers:
            if receiver == FavoritedItem:
                continue
            if isinstance(instance, receiver) or receiver == FavoritedItem:
                continue
            # Update 'favorited' status in other receiver models
            receiver.objects.filter(id=instance.id).update(favorited=instance.favorited)

        if instance.favorited:
            # Retrieve the user through subheading and grocery
            try:
                user = instance.subheading.grocery.user
            except AttributeError:
                raise ValueError("The instance is not properly linked to a grocery and user.")

            # Create or get the FavoritedItem
            FavoritedItem.objects.get_or_create(
                id=instance.id,
                defaults={
                    'name': instance.name,
                    'description': instance.description,
                    'store': instance.store,
                    'user': user
                }
            )
        else:
            # Delete the FavoritedItem if it exists
            FavoritedItem.objects.filter(id=instance.id).delete()

class FriendRecipe (models.Model):
    from_user = models.ForeignKey(User, related_name='recipe_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='recipe_received', on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, related_name="recipe", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_user} to {self.to_user} ()"