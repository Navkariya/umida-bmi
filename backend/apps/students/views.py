from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from apps.students.models import Student


@api_view(["POST"])
def student_login(request: Request) -> Response:
    kirish_kodi = (request.data.get("kirish_kodi") or "").strip()
    if not kirish_kodi:
        return Response({"student_id": None, "ism": "Mehmon", "guruh": None})
    try:
        student = Student.objects.get(kirish_kodi=kirish_kodi)
    except Student.DoesNotExist:
        return Response(
            {"xato": "Kirish kodi noto'g'ri"}, status=status.HTTP_404_NOT_FOUND
        )
    return Response(
        {"student_id": str(student.id), "ism": student.ism, "guruh": student.guruh}
    )


@api_view(["GET"])
def student_history(request: Request, student_id) -> Response:
    try:
        student = Student.objects.get(pk=student_id)
    except Student.DoesNotExist:
        return Response({"xato": "O'quvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)

    from apps.game.models import GameSession

    sessions = (
        GameSession.objects.filter(student=student, holat="tugagan")
        .prefetch_related("javoblar", "javoblar__stsenariy")
        .select_related("yakuniy_natija")
        .order_by("-boshlangan")
    )

    result = []
    for session in sessions:
        try:
            jami_ball = session.yakuniy_natija.ball
        except Exception:
            jami_ball = sum(a.jami_ball for a in session.javoblar.all())

        result.append(
            {
                "sessiya_id": session.pk,
                "boshlangan": session.boshlangan.isoformat(),
                "holat": session.holat,
                "jami_ball": jami_ball,
                "raundlar": [
                    {
                        "tur_raqami": a.tur_raqami,
                        "tur_turi": a.stsenariy.tur_turi,
                        "jami_ball": a.jami_ball,
                        "tanlov_ball": a.tanlov_ball,
                        "dalil_ball": a.dalil_ball,
                        "tushuntirish_ball": a.tushuntirish_ball,
                    }
                    for a in session.javoblar.all()
                ],
            }
        )

    return Response(result)
