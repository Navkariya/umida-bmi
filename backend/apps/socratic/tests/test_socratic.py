import pytest
from rest_framework.test import APIClient

from apps.socratic.models import SocraticSession


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_creates_new_session(api_client):
    response = api_client.post(
        "/api/socratic/reply/",
        {"stsenariy_tur": "yolgon_top", "tur_raqami": 1},
        format="json",
    )
    assert response.status_code == 200
    data = response.json()
    assert "sessiya_id" in data
    assert data["tugadimi"] is False
    assert len(data["savol"]) > 0


@pytest.mark.django_db
def test_continues_existing_session(api_client):
    sessiya = SocraticSession.objects.create(
        stsenariy_tur="yolgon_top",
        tur_raqami=1,
    )
    response = api_client.post(
        "/api/socratic/reply/",
        {"sessiya_id": str(sessiya.pk), "javob": "Chunki bu da'vo noto'g'ri"},
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["sessiya_id"] == str(sessiya.pk)


@pytest.mark.django_db
def test_finished_session_returns_done(api_client):
    sessiya = SocraticSession.objects.create(
        stsenariy_tur="yolgon_top",
        tur_raqami=1,
        tugagan=True,
    )
    response = api_client.post(
        "/api/socratic/reply/",
        {"sessiya_id": str(sessiya.pk), "javob": "Javob"},
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["tugadimi"] is True
