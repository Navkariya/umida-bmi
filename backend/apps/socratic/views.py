import json
from pathlib import Path
from typing import Any

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from apps.ai.provider import get_provider
from apps.socratic.models import SocraticSession

_TREES_PATH = Path(__file__).parent / "fixtures" / "question_trees.json"
try:
    with _TREES_PATH.open(encoding="utf-8") as _f:
        _QUESTION_TREES: list[dict[str, Any]] = json.load(_f)
except (FileNotFoundError, json.JSONDecodeError):
    _QUESTION_TREES = []


def _get_tree(stsenariy_tur: str) -> dict[str, Any]:
    for tree in _QUESTION_TREES:
        if tree.get("stsenariy_tur") == stsenariy_tur:
            return tree
    return {"stsenariy_tur": stsenariy_tur, "savollar": []}


@api_view(["POST"])
def socratic_reply(request: Request) -> Response:
    data = request.data
    sessiya_id = data.get("sessiya_id")
    student_javob = data.get("javob", "")
    stsenariy_tur = data.get("stsenariy_tur", "yolgon_top")
    game_sessiya_id = data.get("game_sessiya_id")
    tur_raqami = data.get("tur_raqami", 0)
    student_id = data.get("student_id")

    if sessiya_id:
        try:
            sessiya = SocraticSession.objects.get(pk=sessiya_id)
        except SocraticSession.DoesNotExist:
            return Response({"xato": "Sessiya topilmadi"}, status=404)
    else:
        student = None
        if student_id:
            from apps.students.models import Student  # noqa: PLC0415

            try:
                student = Student.objects.get(pk=student_id)
            except Student.DoesNotExist:
                pass

        sessiya = SocraticSession.objects.create(
            student=student,
            game_sessiya_id=game_sessiya_id,
            tur_raqami=tur_raqami,
            stsenariy_tur=stsenariy_tur,
        )

    if sessiya.tugagan:
        return Response(
            {
                "savol": "",
                "tugadimi": True,
                "navbat": sessiya.navbat_soni,
                "sessiya_id": str(sessiya.pk),
            }
        )

    if student_javob:
        sessiya.transkript = sessiya.transkript + [
            {"rol": "talaba", "matn": student_javob}
        ]

    tree = _get_tree(sessiya.stsenariy_tur)
    provider = get_provider()
    result = provider.socratic_next(tree, sessiya.transkript, student_javob)

    if not result.tugadimi:
        sessiya.transkript = sessiya.transkript + [
            {"rol": "o'qituvchi", "matn": result.savol}
        ]

    sessiya.navbat_soni = result.navbat
    sessiya.tugagan = result.tugadimi
    sessiya.save(update_fields=["transkript", "navbat_soni", "tugagan"])

    return Response(
        {
            "savol": result.savol,
            "tugadimi": result.tugadimi,
            "navbat": result.navbat,
            "sessiya_id": str(sessiya.pk),
        }
    )
