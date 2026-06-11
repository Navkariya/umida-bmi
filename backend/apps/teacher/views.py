from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, IntegerField, Max, Q, Value
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.request import Request
from rest_framework.response import Response

from apps.students.models import Student


def _check_teacher(request: Request):
    """Return 401 Response if not authenticated, else None."""
    if not request.user.is_authenticated:
        return Response(
            {"xato": "Kirish talab etiladi"}, status=status.HTTP_401_UNAUTHORIZED
        )
    return None


@api_view(["POST"])
@authentication_classes([])
def teacher_login(request: Request) -> Response:
    username = (request.data.get("username") or "").strip()
    password = (request.data.get("password") or "").strip()
    if not username or not password:
        return Response(
            {"xato": "Login va parol kiritilishi kerak"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = authenticate(request._request, username=username, password=password)
    if user is None:
        return Response(
            {"xato": "Login yoki parol noto'g'ri"}, status=status.HTTP_401_UNAUTHORIZED
        )
    login(request._request, user)
    return Response({"ok": True, "username": user.username})


@api_view(["POST"])
@authentication_classes([])
def teacher_logout(request: Request) -> Response:
    logout(request._request)
    return Response({"ok": True})


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
def student_list(request: Request) -> Response:
    err = _check_teacher(request)
    if err is not None:
        return err

    students = (
        Student.objects.annotate(
            sessiya_soni=Count(
                "sessiyalar",
                filter=Q(sessiyalar__holat="tugagan"),
                distinct=True,
            ),
            jami_ball=Coalesce(
                Max("natijalar__ball"),
                Value(0, output_field=IntegerField()),
            ),
            oxirgi_oyin=Max(
                "sessiyalar__boshlangan",
                filter=Q(sessiyalar__holat="tugagan"),
            ),
        )
        .order_by("-jami_ball")
    )

    data = [
        {
            "student_id": str(s.id),
            "ism": s.ism,
            "sinf": s.sinf,
            "guruh": s.guruh,
            "jami_ball": s.jami_ball,
            "sessiya_soni": s.sessiya_soni,
            "oxirgi_oyin": s.oxirgi_oyin.isoformat() if s.oxirgi_oyin else None,
        }
        for s in students
    ]
    return Response(data)


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
def group_stats(request: Request) -> Response:
    err = _check_teacher(request)
    if err is not None:
        return err

    from django.db.models import Avg
    from apps.game.models import GameScore

    result = {}
    for guruh in ("experimental", "control"):
        students_in_group = Student.objects.filter(guruh=guruh)
        scores = GameScore.objects.filter(student__in=students_in_group)
        agg = scores.aggregate(avg=Avg("ball"), max=Max("ball"))
        result[guruh] = {
            "soni": students_in_group.count(),
            "o_rtacha_ball": round(agg["avg"] or 0),
            "maks_ball": agg["max"] or 0,
        }
    return Response(result)


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
def student_detail(request: Request, student_id) -> Response:
    err = _check_teacher(request)
    if err is not None:
        return err

    try:
        student = Student.objects.get(pk=student_id)
    except Student.DoesNotExist:
        return Response({"xato": "O'quvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)

    from apps.game.models import GameSession
    from apps.socratic.models import SocraticSession

    sessions = (
        GameSession.objects.filter(student=student, holat="tugagan")
        .prefetch_related("javoblar", "javoblar__stsenariy")
        .select_related("yakuniy_natija")
        .order_by("-boshlangan")
    )

    sessiyalar = []
    for session in sessions:
        try:
            jami_ball = session.yakuniy_natija.ball
        except Exception:
            jami_ball = sum(a.jami_ball for a in session.javoblar.all())

        raundlar = [
            {
                "tur_raqami": a.tur_raqami,
                "tur_turi": a.stsenariy.tur_turi,
                "tanlov_ball": a.tanlov_ball,
                "dalil_ball": a.dalil_ball,
                "tushuntirish_ball": a.tushuntirish_ball,
                "jami_ball": a.jami_ball,
                "togri_javob": a.stsenariy.mazmun.get("togri_javob", ""),
                "ai_izoh": a.ai_izoh,
            }
            for a in session.javoblar.all()
        ]

        sokrat = [
            {
                "tur_raqami": ss.tur_raqami,
                "transkript": ss.transkript,
                "navbat_soni": ss.navbat_soni,
                "tugagan": ss.tugagan,
            }
            for ss in SocraticSession.objects.filter(
                student=student, game_sessiya_id=session.pk
            ).order_by("tur_raqami")
        ]

        sessiyalar.append(
            {
                "sessiya_id": session.pk,
                "boshlangan": session.boshlangan.isoformat(),
                "jami_ball": jami_ball,
                "raundlar": raundlar,
                "sokrat": sokrat,
            }
        )

    best_ball = max((s["jami_ball"] for s in sessiyalar), default=0)

    return Response(
        {
            "student": {
                "student_id": str(student.id),
                "ism": student.ism,
                "sinf": student.sinf,
                "guruh": student.guruh,
                "jami_ball": best_ball,
                "sessiya_soni": len(sessiyalar),
                "oxirgi_oyin": sessiyalar[0]["boshlangan"] if sessiyalar else None,
            },
            "sessiyalar": sessiyalar,
        }
    )
