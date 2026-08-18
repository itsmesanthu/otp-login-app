from rest_framework import serializers


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    first_name = serializers.CharField(max_length=80, trim_whitespace=True)
    last_name = serializers.CharField(max_length=80, trim_whitespace=True)

    def validate_first_name(self, value):
        if not value:
            raise serializers.ValidationError("First name is required.")
        return value

    def validate_last_name(self, value):
        if not value:
            raise serializers.ValidationError("Last name is required.")
        return value


class RecognitionSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)


class OtpVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    code = serializers.RegexField(r"^\d{6}$", error_messages={"invalid": "Enter a six-digit numeric code."})
