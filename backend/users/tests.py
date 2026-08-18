from django.test import TestCase
from rest_framework.test import APIClient

from .models import Customer


class UserApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_recognize_and_verify_code(self):
        registration = self.client.post(
            "/api/users/register/",
            {"email": "ada@example.com", "first_name": "Ada", "last_name": "Lovelace"},
            format="json",
        )
        self.assertEqual(registration.status_code, 201)
        code = registration.data["otp_code"]
        self.assertRegex(code, r"^\d{6}$")
        self.assertNotEqual(Customer.objects.get(email="ada@example.com").otp_code, code)

        recognition = self.client.post("/api/users/recognize/", {"email": "ada@example.com"}, format="json")
        self.assertEqual(recognition.status_code, 200)
        self.assertEqual(recognition.data, {"registered": True, "first_name": "Ada", "last_name": "Lovelace"})

        failed = self.client.post("/api/users/verify-otp/", {"email": "ada@example.com", "code": "000000"}, format="json")
        self.assertEqual(failed.status_code, 401)

        verified = self.client.post("/api/users/verify-otp/", {"email": "ada@example.com", "code": code}, format="json")
        self.assertEqual(verified.status_code, 200)
        self.assertTrue(verified.data["success"])
        self.assertIn("token", verified.data)

    def test_duplicate_email_is_rejected(self):
        data = {"email": "grace@example.com", "first_name": "Grace", "last_name": "Hopper"}
        self.client.post("/api/users/register/", data, format="json")
        duplicate = self.client.post("/api/users/register/", data, format="json")
        self.assertEqual(duplicate.status_code, 409)
