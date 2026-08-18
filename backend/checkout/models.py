from django.db import models

from users.models import Customer


class CheckoutOrder(models.Model):
    customer = models.ForeignKey(Customer, null=True, blank=True, on_delete=models.SET_NULL, related_name="orders", db_column="user_id")
    email = models.EmailField()
    phone = models.CharField(max_length=16)
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "checkout_orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.id} — {self.email}"
