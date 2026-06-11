"""Tests for the health-check endpoint."""
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


def test_health_returns_200_ok():
    client = APIClient()
    response = client.get("/api/health/")

    assert response.status_code == status.HTTP_200_OK


def test_health_payload_shape():
    client = APIClient()
    response = client.get("/api/health/")
    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "bmi-backend"
    assert "version" in data


def test_health_url_name_resolves():
    # The route is reachable via its named URL ("health").
    assert reverse("health") == "/api/health/"
