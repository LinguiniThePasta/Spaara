# Generated by Django 4.2.16 on 2024-11-16 18:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0005_merge_20241116_1849'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friendrequest',
            name='status',
        ),
    ]
