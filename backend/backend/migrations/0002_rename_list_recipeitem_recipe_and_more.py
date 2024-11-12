# Generated by Django 4.2.16 on 2024-11-10 09:18

import backend.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipeitem',
            old_name='list',
            new_name='recipe',
        ),
        migrations.RemoveField(
            model_name='groceryitemunoptimized',
            name='list',
        ),
        migrations.AddField(
            model_name='groceryitemunoptimized',
            name='order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='addresses',
            field=models.JSONField(default=backend.models.default_addresses),
        ),
        migrations.AddField(
            model_name='user',
            name='friends',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='selected_address_id',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='grocery',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='email_pending',
            field=models.EmailField(default=None, max_length=254, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.CreateModel(
            name='Subheading',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('order', models.PositiveIntegerField(default=0)),
                ('grocery', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subheadings', to='backend.grocery')),
                ('recipe', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subheadings', to='backend.recipe')),
            ],
            options={
                'ordering': ['order'],
                'unique_together': {('grocery', 'recipe')},
            },
        ),
        migrations.AddField(
            model_name='groceryitemunoptimized',
            name='subheading',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='items', to='backend.subheading'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_requests_sent', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_requests_received', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('from_user', 'to_user')},
            },
        ),
    ]