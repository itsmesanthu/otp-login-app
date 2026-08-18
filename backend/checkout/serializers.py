from rest_framework import serializers


class CheckoutSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    phone = serializers.RegexField(
        r"^\+[1-9]\d{6,14}$",
        error_messages={"invalid": "Please enter a valid international phone number."},
    )
    shipping_address = serializers.CharField(min_length=10, max_length=500, trim_whitespace=True)

    def validate_shipping_address(self, value):
        if not value:
            raise serializers.ValidationError("Shipping address is required.")
        return value
