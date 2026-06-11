import pytest
from rest_framework.test import APIClient

from apps.game.models import GameScenario, GameSession


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def loaded_scenarios(db):
    scenarios = []
    for i in range(1, 3):
        scenarios.append(
            GameScenario.objects.create(
                tur=i,
                tur_turi="yolgon_top",
                mazmun={
                    "savol": f"Test savoli {i}",
                    "davolar": [
                        {"id": "D1", "matn": "Da'vo 1"},
                        {"id": "D2", "matn": "Da'vo 2"},
                        {"id": "D3", "matn": "Da'vo 3"},
                    ],
                    "togri_javob": "D3",
                    "tushuntirish_rubriki": {"kalit_sozlar": ["chunki", "sabab"], "maks": 40},
                    "baho": {"togri_tanlov": 60, "tushuntirish": 40},
                },
            )
        )
    for i in range(3, 6):
        scenarios.append(
            GameScenario.objects.create(
                tur=i,
                tur_turi="detektiv",
                mazmun={
                    "savol": f"Detektiv savoli {i}",
                    "davolar": [
                        {"id": "D1", "matn": "Da'vo 1"},
                        {"id": "D2", "matn": "Da'vo 2"},
                        {"id": "D3", "matn": "Da'vo 3"},
                    ],
                    "togri_javob": "D1",
                    "dalillar": [
                        {"id": "Dal1", "matn": "Dalil 1"},
                        {"id": "Dal2", "matn": "Dalil 2"},
                    ],
                    "togri_dalillar": ["Dal1"],
                    "tushuntirish_rubriki": {"kalit_sozlar": ["dalil", "sabab"], "maks": 40},
                    "baho": {"togri_tanlov": 40, "togri_dalil": 20, "tushuntirish": 40},
                },
            )
        )
    return scenarios


@pytest.mark.django_db
def test_scenarios_returns_5(api_client, loaded_scenarios):
    response = api_client.get("/api/game/scenarios/")
    assert response.status_code == 200
    data = response.json()
    assert "sessiya_id" in data
    assert len(data["stsenariylar"]) == 5


@pytest.mark.django_db
def test_correct_pick_gives_60(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    s = loaded_scenarios[0]
    response = api_client.post(
        "/api/game/submit/",
        {
            "sessiya_id": sessiya.pk,
            "stsenariy_id": s.pk,
            "tur_raqami": 1,
            "tanlangan_davo": "D3",
            "tushuntirish": "",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["tanlov_ball"] == 60


@pytest.mark.django_db
def test_wrong_pick_gives_0(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    s = loaded_scenarios[0]
    response = api_client.post(
        "/api/game/submit/",
        {
            "sessiya_id": sessiya.pk,
            "stsenariy_id": s.pk,
            "tur_raqami": 1,
            "tanlangan_davo": "D1",
            "tushuntirish": "",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["tanlov_ball"] == 0


@pytest.mark.django_db
def test_keywords_gives_nonzero_tushuntirish(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    s = loaded_scenarios[0]
    response = api_client.post(
        "/api/game/submit/",
        {
            "sessiya_id": sessiya.pk,
            "stsenariy_id": s.pk,
            "tur_raqami": 1,
            "tanlangan_davo": "D1",
            "tushuntirish": "chunki bu sabab bo'ldi",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["tushuntirish_ball"] > 0


@pytest.mark.django_db
def test_dalil_scoring(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    s = loaded_scenarios[2]  # detektiv, togri_dalillar: ["Dal1"]
    response = api_client.post(
        "/api/game/submit/",
        {
            "sessiya_id": sessiya.pk,
            "stsenariy_id": s.pk,
            "tur_raqami": 3,
            "tanlangan_davo": "D1",
            "tanlangan_dalillar": ["Dal1"],
            "tushuntirish": "",
        },
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["dalil_ball"] == 20


@pytest.mark.django_db
def test_complete_totals(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    s = loaded_scenarios[0]
    api_client.post(
        "/api/game/submit/",
        {
            "sessiya_id": sessiya.pk,
            "stsenariy_id": s.pk,
            "tur_raqami": 1,
            "tanlangan_davo": "D3",
            "tushuntirish": "",
        },
        format="json",
    )
    response = api_client.post(
        "/api/game/complete/", {"sessiya_id": sessiya.pk}, format="json"
    )
    assert response.status_code == 200
    data = response.json()
    assert "jami_ball" in data
    assert data["jami_ball"] == 60


@pytest.mark.django_db
def test_complete_idempotent(api_client, loaded_scenarios):
    sessiya = GameSession.objects.create(
        stsenariy_tartib=[s.pk for s in loaded_scenarios]
    )
    r1 = api_client.post(
        "/api/game/complete/", {"sessiya_id": sessiya.pk}, format="json"
    )
    r2 = api_client.post(
        "/api/game/complete/", {"sessiya_id": sessiya.pk}, format="json"
    )
    assert r1.status_code == 200
    assert r2.status_code == 200
    assert r1.json()["jami_ball"] == r2.json()["jami_ball"]
