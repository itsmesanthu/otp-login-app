from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("checkout", "0001_initial")]

    operations = [
        migrations.AlterField(
            model_name="checkoutorder",
            name="phone",
            field=models.CharField(max_length=16),
        ),
    ]
