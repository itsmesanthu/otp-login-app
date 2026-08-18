from django.urls import path

from .views import RecognizeView, RegisterView, VerifyOtpView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("recognize/", RecognizeView.as_view(), name="recognize"),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify-otp"),
]
