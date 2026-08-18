from django.contrib import admin

from .models import CheckoutOrder


@admin.register(CheckoutOrder)
class CheckoutOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "customer", "created_at")
    search_fields = ("email", "phone")
    readonly_fields = ("created_at", "updated_at")
