from django.contrib import admin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "created_at")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("created_at", "updated_at")
