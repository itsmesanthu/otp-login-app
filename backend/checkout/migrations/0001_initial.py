# Generated manually to keep the project runnable without a scaffold step.
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [("users", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="CheckoutOrder",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(max_length=32)),
                ("shipping_address", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("customer", models.ForeignKey(blank=True, db_column="user_id", null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="orders", to="users.customer")),
            ],
            options={"db_table": "checkout_orders", "ordering": ["-created_at"]},
        ),
    ]
