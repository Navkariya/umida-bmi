import pytest
from rest_framework.test import APIClient

from apps.students.models import Student


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def teacher_user(django_user_model):
    return django_user_model.objects.create_user(username="ustoz", password="test1234")


@pytest.mark.django_db
def test_login_valid(api_client, teacher_user):
    resp = api_client.post(
        "/api/teacher/login/",
        {"username": "ustoz", "password": "test1234"},
        format="json",
    )
    assert resp.status_code == 200
    assert resp.json()["ok"] is True
    assert resp.json()["username"] == "ustoz"


@pytest.mark.django_db
def test_login_wrong_password(api_client, teacher_user):
    resp = api_client.post(
        "/api/teacher/login/",
        {"username": "ustoz", "password": "wrong"},
        format="json",
    )
    assert resp.status_code == 401
    assert "xato" in resp.json()


@pytest.mark.django_db
def test_students_unauthenticated_returns_401(api_client):
    resp = api_client.get("/api/teacher/students/")
    assert resp.status_code == 401


@pytest.mark.django_db
def test_students_list_returns_data(api_client, teacher_user):
    Student.objects.create(ism="Alibek", kirish_kodi="A001", guruh="experimental", sinf="8")
    api_client.force_login(teacher_user)
    resp = api_client.get("/api/teacher/students/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["ism"] == "Alibek"
    assert data[0]["guruh"] == "experimental"
    assert "jami_ball" in data[0]


@pytest.mark.django_db
def test_groups_aggregate_correct(api_client, teacher_user):
    Student.objects.create(ism="A", kirish_kodi="A1", guruh="experimental")
    Student.objects.create(ism="B", kirish_kodi="B1", guruh="experimental")
    Student.objects.create(ism="C", kirish_kodi="C1", guruh="control")
    api_client.force_login(teacher_user)
    resp = api_client.get("/api/teacher/groups/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["experimental"]["soni"] == 2
    assert data["control"]["soni"] == 1


@pytest.mark.django_db
def test_student_detail_includes_rounds(api_client, teacher_user):
    from apps.game.models import GameScenario, GameSession, RoundAnswer

    student = Student.objects.create(ism="Ali", kirish_kodi="ALI01", guruh="experimental")
    scenario = GameScenario.objects.create(
        tur=1,
        tur_turi="yolgon_top",
        mazmun={
            "savol": "Test savol?",
            "togri_javob": "A",
            "davolar": [],
            "baho": {"togri_tanlov": 60, "tushuntirish": 40},
            "tushuntirish_rubriki": {"kalit_sozlar": [], "maks": 40},
            "izoh": "",
        },
    )
    session = GameSession.objects.create(
        student=student, holat="tugagan", stsenariy_tartib=[scenario.pk]
    )
    RoundAnswer.objects.create(
        sessiya=session,
        stsenariy=scenario,
        tur_raqami=1,
        tanlangan_davo="A",
        tanlangan_dalillar=[],
        tushuntirish="izohim bor",
        tanlov_ball=60,
        dalil_ball=0,
        tushuntirish_ball=20,
        jami_ball=80,
        ai_izoh="Yaxshi",
    )
    api_client.force_login(teacher_user)
    resp = api_client.get(f"/api/teacher/students/{student.id}/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["student"]["ism"] == "Ali"
    assert len(data["sessiyalar"]) == 1
    assert len(data["sessiyalar"][0]["raundlar"]) == 1
    assert data["sessiyalar"][0]["raundlar"][0]["tanlov_ball"] == 60
