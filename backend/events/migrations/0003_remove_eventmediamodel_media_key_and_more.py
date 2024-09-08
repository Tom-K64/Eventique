# Generated by Django 5.1.1 on 2024-09-08 12:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eventmediamodel',
            name='media_key',
        ),
        migrations.AddField(
            model_name='eventmediamodel',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='EventMediaModel_event', to='events.eventdetailmodel'),
        ),
        migrations.AlterField(
            model_name='eventdetailmodel',
            name='poster',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='eventmediamodel',
            name='media',
            field=models.ImageField(blank=True, null=True, upload_to='events/'),
        ),
    ]
