# Generated by Django 3.1.7 on 2021-02-27 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20210222_1830'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='tutor_text',
            field=models.CharField(default='', max_length=2000),
            preserve_default=False,
        ),
    ]