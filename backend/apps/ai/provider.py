from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ScoreResult:
    ball: int
    maks: int
    izoh: str
    mezonlar: dict[str, Any] = field(default_factory=dict)


@dataclass
class SocraticResult:
    savol: str
    tugadimi: bool
    navbat: int


class MockProvider:
    def score_answer(
        self,
        question: str,
        answer: str,
        rubric: dict[str, Any],
    ) -> ScoreResult:
        maks: int = rubric.get("maks", 40)
        keywords: list[str] = rubric.get("kalit_sozlar", [])
        if not keywords:
            return ScoreResult(ball=0, maks=maks, izoh="Mezonlar yo'q", mezonlar={})

        low = answer.lower()
        matched = sum(1 for kw in keywords if kw.lower() in low)
        ratio = matched / len(keywords)
        ball = round(ratio * maks)
        return ScoreResult(
            ball=ball,
            maks=maks,
            izoh=f"{matched}/{len(keywords)} kalit so'z topildi",
            mezonlar={"matched": matched, "total": len(keywords)},
        )

    def socratic_next(
        self,
        question_tree: dict[str, Any],
        history: list[dict[str, Any]],
        student_answer: str,
    ) -> SocraticResult:
        savollar: list[dict[str, Any]] = question_tree.get("savollar", [])
        if not savollar:
            return SocraticResult(savol="", tugadimi=True, navbat=0)

        # navbat = number of previous talaba turns + 1
        talaba_turns = sum(1 for h in history if h.get("rol") == "talaba")
        navbat = talaba_turns + 1

        max_navbat = max(s["navbat"] for s in savollar)
        if navbat > max_navbat:
            return SocraticResult(savol="", tugadimi=True, navbat=navbat)

        current = next((s for s in savollar if s["navbat"] == navbat), None)
        if current is None:
            return SocraticResult(savol="", tugadimi=True, navbat=navbat)

        return SocraticResult(savol=current["savol"], tugadimi=False, navbat=navbat)


def get_provider() -> MockProvider:
    try:
        from django.conf import settings  # noqa: PLC0415

        _ai_provider = getattr(settings, "AI_PROVIDER", "mock")
    except Exception:
        _ai_provider = "mock"
    # Future: if _ai_provider == "gemini": return GeminiProvider()
    return MockProvider()
