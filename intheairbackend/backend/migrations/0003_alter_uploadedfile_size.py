# Generated by Django 5.0.1 on 2024-08-26 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_uploadedfile_is_complete_alter_filechunk_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadedfile',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
