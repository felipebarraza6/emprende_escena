# Generated by Django 3.1.6 on 2021-02-18 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20210217_0408'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='passing_score',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
