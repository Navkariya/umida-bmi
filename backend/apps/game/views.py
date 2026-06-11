import random

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from apps.ai.provider import get_provider
from apps.game.models import Fan, GameScenario, GameScore, GameSession, RoundAnswer


@api_view(["GET"])
def fanlar(request: Request) -> Response:
    data = [
        {"fan_id": f.pk, "nom": f.nom, "emoji": f.emoji, "rang": f.rang}
        for f in Fan.objects.all()
    ]
    return Response(data)


@api_view(["GET"])
def scenarios(request: Request) -> Response:
    student_id = request.query_params.get("student_id", "").strip() or None
    fan_id_raw = request.query_params.get("fan_id", "").strip() or None
    student = None
    fan = None

    if student_id:
        from apps.students.models import Student  # noqa: PLC0415

        try:
            student = Student.objects.get(pk=student_id)
        except (Student.DoesNotExist, Exception):
            pass

    if fan_id_raw:
        try:
            fan = Fan.objects.get(pk=int(fan_id_raw))
        except (Fan.DoesNotExist, ValueError):
            pass

    if fan:
        all_scenarios = list(GameScenario.objects.filter(fan=fan))
    else:
        all_scenarios = list(GameScenario.objects.filter(fan__isnull=True))

    yolgon = [s for s in all_scenarios if s.tur_turi == "yolgon_top"]
    detektiv = [s for s in all_scenarios if s.tur_turi == "detektiv"]

    if len(yolgon) < 2 or len(detektiv) < 3:
        return Response(
            {"xato": "Stsenariylar yuklanmagan"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    random.shuffle(yolgon)
    random.shuffle(detektiv)
    ordered = yolgon[:2] + detektiv[:3]
    tartib = [s.pk for s in ordered]

    sessiya = GameSession.objects.create(student=student, fan=fan, stsenariy_tartib=tartib)

    stsenariylar = [
        {
            "stsenariy_id": s.pk,
            "tur": idx + 1,
            "tur_turi": s.tur_turi,
            "mazmun": s.mazmun,
        }
        for idx, s in enumerate(ordered)
    ]
    return Response({"sessiya_id": sessiya.pk, "stsenariylar": stsenariylar})


@api_view(["POST"])
def submit_round(request: Request) -> Response:
    data = request.data
    sessiya_id = data.get("sessiya_id")
    stsenariy_id = data.get("stsenariy_id")
    tur_raqami = data.get("tur_raqami")
    tanlangan_davo = data.get("tanlangan_davo", "")
    tanlangan_dalillar = data.get("tanlangan_dalillar") or []
    tushuntirish = data.get("tushuntirish", "")

    if not all([sessiya_id, stsenariy_id, tur_raqami, tanlangan_davo]):
        return Response(
            {"xato": "Majburiy maydonlar to'ldirilmagan"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        sessiya = GameSession.objects.get(pk=sessiya_id)
        stsenariy = GameScenario.objects.get(pk=stsenariy_id)
    except (GameSession.DoesNotExist, GameScenario.DoesNotExist):
        return Response({"xato": "Topilmadi"}, status=status.HTTP_404_NOT_FOUND)

    mazmun = stsenariy.mazmun
    baho = mazmun.get("baho", {})
    tur_turi = stsenariy.tur_turi

    togri_javob = mazmun.get("togri_javob", "")
    tanlov_ball = baho.get("togri_tanlov", 60) if tanlangan_davo == togri_javob else 0

    dalil_ball = 0
    if tur_turi == "detektiv":
        togri_dalillar: list[str] = mazmun.get("togri_dalillar", [])
        if togri_dalillar:
            selected = set(tanlangan_dalillar)
            correct = set(togri_dalillar)
            if selected == correct:
                dalil_ball = baho.get("togri_dalil", 20)
            elif selected & correct:
                dalil_ball = round(
                    baho.get("togri_dalil", 20) * len(selected & correct) / len(correct)
                )

    rubric = mazmun.get("tushuntirish_rubriki", {"kalit_sozlar": [], "maks": 40})
    provider = get_provider()
    score_result = provider.score_answer(
        question=mazmun.get("savol", ""),
        answer=tushuntirish,
        rubric=rubric,
    )
    tushuntirish_ball = score_result.ball
    ai_izoh = score_result.izoh

    jami_ball = tanlov_ball + dalil_ball + tushuntirish_ball

    RoundAnswer.objects.update_or_create(
        sessiya=sessiya,
        tur_raqami=tur_raqami,
        defaults={
            "stsenariy": stsenariy,
            "tanlangan_davo": tanlangan_davo,
            "tanlangan_dalillar": tanlangan_dalillar,
            "tushuntirish": tushuntirish,
            "tanlov_ball": tanlov_ball,
            "dalil_ball": dalil_ball,
            "tushuntirish_ball": tushuntirish_ball,
            "jami_ball": jami_ball,
            "ai_izoh": ai_izoh,
        },
    )

    sokrat_kerakmi = tushuntirish_ball < rubric.get("maks", 40) * 0.5

    return Response(
        {
            "ball": jami_ball,
            "tanlov_ball": tanlov_ball,
            "dalil_ball": dalil_ball,
            "tushuntirish_ball": tushuntirish_ball,
            "togri_javob": togri_javob,
            "ai_izoh": ai_izoh,
            "sokrat_kerakmi": sokrat_kerakmi,
        }
    )


@api_view(["POST"])
def complete_game(request: Request) -> Response:
    sessiya_id = request.data.get("sessiya_id")
    if not sessiya_id:
        return Response(
            {"xato": "sessiya_id majburiy"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        sessiya = GameSession.objects.get(pk=sessiya_id)
    except GameSession.DoesNotExist:
        return Response(
            {"xato": "Sessiya topilmadi"}, status=status.HTTP_404_NOT_FOUND
        )

    jami_ball = sum(j.jami_ball for j in sessiya.javoblar.all())

    score, _ = GameScore.objects.get_or_create(
        sessiya=sessiya,
        defaults={"student": sessiya.student, "ball": jami_ball},
    )

    if sessiya.holat != "tugagan":
        sessiya.holat = "tugagan"
        sessiya.save(update_fields=["holat"])

    return Response({"jami_ball": score.ball, "sessiya_id": sessiya.pk})
