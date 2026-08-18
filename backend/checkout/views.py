from django.core import signing
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Customer

from .models import CheckoutOrder
from .serializers import CheckoutSerializer

SESSION_MAX_AGE_SECONDS = 7200


def authenticated_customer(request):
    """Return the checkout customer from a valid signed bearer token, if provided."""
    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = signing.loads(token, salt="checkout-session", max_age=SESSION_MAX_AGE_SECONDS)
        return Customer.objects.filter(id=payload.get("customer_id"), email__iexact=payload.get("email", "")).first()
    except signing.BadSignature:
        return None


class CheckoutView(APIView):
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        customer = authenticated_customer(request)

        # A logged-in customer's order must use the email that was verified.
        if customer and customer.email.lower() != data["email"].lower():
            return Response(
                {"detail": "Checkout email must match the verified account."},
                status=status.HTTP_403_FORBIDDEN,
            )

        order = CheckoutOrder.objects.create(
            customer=customer,
            email=data["email"].lower(),
            phone=data["phone"],
            shipping_address=data["shipping_address"],
        )
        return Response(
            {"message": "Checkout saved successfully.", "order": {"id": order.id, "authenticated": customer is not None}},
            status=status.HTTP_201_CREATED,
        )
