# Generated manually to keep the project runnable without a scaffold step.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("first_name", models.CharField(max_length=80)),
                ("last_name", models.CharField(max_length=80)),
                ("otp_code", models.CharField(max_length=256)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"db_table": "users", "ordering": ["-created_at"]},
        ),
    ]
