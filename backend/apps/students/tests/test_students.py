import pytest
from rest_framework.test import APIClient

from apps.students.models import Student


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_valid_kirish_kodi(api_client):
    Student.objects.create(ism="Alibek", kirish_kodi="TEST01")
    response = api_client.post(
        "/api/students/login/", {"kirish_kodi": "TEST01"}, format="json"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ism"] == "Alibek"
    assert "student_id" in data


@pytest.mark.django_db
def test_invalid_kirish_kodi_returns_404(api_client):
    response = api_client.post(
        "/api/students/login/", {"kirish_kodi": "WRONG99"}, format="json"
    )
    assert response.status_code == 404
    assert "xato" in response.json()


@pytest.mark.django_db
def test_empty_kirish_kodi_returns_mehmon(api_client):
    response = api_client.post(
        "/api/students/login/", {"kirish_kodi": ""}, format="json"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["student_id"] is None
    assert data["ism"] == "Mehmon"
