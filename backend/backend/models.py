from django.contrib.auth.base_user import AbstractBaseUser
class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['username', 'email', 'password']  # Add this attribute
    def __str__(self):
        return self.email
