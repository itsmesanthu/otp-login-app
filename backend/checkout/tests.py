from django.test import TestCase
from rest_framework.test import APIClient


class CheckoutApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        registration = self.client.post(
            "/api/users/register/",
            {"email": "lin@example.com", "first_name": "Lin", "last_name": "Chen"},
            format="json",
        )
        verification = self.client.post(
            "/api/users/verify-otp/",
            {"email": "lin@example.com", "code": registration.data["otp_code"]},
            format="json",
        )
        self.token = verification.data["token"]
        self.order = {"email": "lin@example.com", "phone": "+919876543210", "shipping_address": "42 Orchard Road, Bengaluru"}

    def test_guest_checkout_is_allowed(self):
        response = self.client.post("/api/checkout/", self.order, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["order"]["authenticated"])

    def test_verified_checkout_is_associated_with_customer(self):
        response = self.client.post("/api/checkout/", self.order, format="json", HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["order"]["authenticated"])

    def test_verified_email_cannot_be_changed(self):
        changed = {**self.order, "email": "different@example.com"}
        response = self.client.post("/api/checkout/", changed, format="json", HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.assertEqual(response.status_code, 403)

    def test_checkout_rejects_a_non_international_phone_number(self):
        response = self.client.post("/api/checkout/", {**self.order, "phone": "98765 43210"}, format="json")
        self.assertEqual(response.status_code, 400)
