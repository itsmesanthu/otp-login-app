import secrets

from django.contrib.auth.hashers import check_password, make_password
from django.core import signing
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import Customer
from .serializers import OtpVerificationSerializer, RecognitionSerializer, RegistrationSerializer


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class RegisterView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()

        if Customer.objects.filter(email__iexact=email).exists():
            return Response({"email": ["This email is already registered."]}, status=status.HTTP_409_CONFLICT)

        raw_code = f"{secrets.randbelow(1_000_000):06d}"
        customer = Customer.objects.create(
            email=email,
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            otp_code=make_password(raw_code),
        )
        # The assignment specifically asks us to display this code after registration.
        return Response(
            {
                "message": "Registration successful.",
                "user": {"id": customer.id, "email": customer.email, "first_name": customer.first_name, "last_name": customer.last_name},
                "otp_code": raw_code,
            },
            status=status.HTTP_201_CREATED,
        )


class RecognizeView(APIView):
    def post(self, request):
        serializer = RecognitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = Customer.objects.filter(email__iexact=serializer.validated_data["email"]).first()
        if not customer:
            return Response({"registered": False})
        return Response({"registered": True, "first_name": customer.first_name, "last_name": customer.last_name})


class VerifyOtpView(APIView):
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = OtpVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        customer = Customer.objects.filter(email__iexact=email).first()

        if not customer or not check_password(serializer.validated_data["code"], customer.otp_code):
            return Response({"success": False, "message": "Invalid login code."}, status=status.HTTP_401_UNAUTHORIZED)

        token = signing.dumps({"customer_id": customer.id, "email": customer.email}, salt="checkout-session")
        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "token": token,
                "expires_in": 7200,
                "user": {"id": customer.id, "email": customer.email, "first_name": customer.first_name, "last_name": customer.last_name},
            }
        )
