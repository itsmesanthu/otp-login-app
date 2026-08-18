from django.db import models


class Customer(models.Model):
    """A registered shopper and their hashed, assignment-demo login code."""

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    # The field name mirrors the assignment schema. Its value is a Django hash,
    # never the raw six-digit code.
    otp_code = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]

    def __str__(self):
        return self.email
