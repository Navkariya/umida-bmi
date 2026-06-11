from apps.ai.provider import MockProvider, ScoreResult, SocraticResult


def make_provider() -> MockProvider:
    return MockProvider()


def test_score_full_match():
    p = make_provider()
    rubric = {"kalit_sozlar": ["yerdan", "uzoq", "150"], "maks": 40}
    result = p.score_answer("?", "Yerdan 150 mln km uzoq", rubric)
    assert result.ball == 40
    assert result.maks == 40


def test_score_partial_match():
    p = make_provider()
    rubric = {"kalit_sozlar": ["a", "b", "c", "d"], "maks": 40}
    result = p.score_answer("?", "a b", rubric)
    assert result.ball == 20  # 2/4 * 40


def test_score_zero_match():
    p = make_provider()
    rubric = {"kalit_sozlar": ["yupiter", "saturn"], "maks": 40}
    result = p.score_answer("?", "men bilmayman", rubric)
    assert result.ball == 0


def test_score_empty_rubric():
    p = make_provider()
    rubric = {"kalit_sozlar": [], "maks": 40}
    result = p.score_answer("?", "javob", rubric)
    assert result.ball == 0
    assert isinstance(result, ScoreResult)


def test_socratic_first_turn():
    p = make_provider()
    tree = {
        "savollar": [
            {"navbat": 1, "savol": "Nega?", "keyingi": {"default": 2}},
            {"navbat": 2, "savol": "Qanday?", "keyingi": {"default": 3}},
        ]
    }
    result = p.socratic_next(tree, [], "biror javob")
    assert result.tugadimi is False
    assert result.navbat == 1
    assert result.savol == "Nega?"


def test_socratic_second_turn():
    p = make_provider()
    tree = {
        "savollar": [
            {"navbat": 1, "savol": "Nega?", "keyingi": {"default": 2}},
            {"navbat": 2, "savol": "Qanday?", "keyingi": {"default": 3}},
        ]
    }
    history = [
        {"rol": "o'qituvchi", "matn": "Nega?"},
        {"rol": "talaba", "matn": "Chunki..."},
    ]
    result = p.socratic_next(tree, history, "yana javob")
    assert result.navbat == 2
    assert result.savol == "Qanday?"


def test_socratic_max_turns_returns_done():
    p = make_provider()
    tree = {
        "savollar": [{"navbat": 1, "savol": "Nega?", "keyingi": {"default": 2}}]
    }
    history = [
        {"rol": "o'qituvchi", "matn": "Nega?"},
        {"rol": "talaba", "matn": "Chunki..."},
    ]
    result = p.socratic_next(tree, history, "javob")
    assert result.tugadimi is True


def test_socratic_returns_type():
    p = make_provider()
    tree = {"savollar": [{"navbat": 1, "savol": "?", "keyingi": {"default": 2}}]}
    result = p.socratic_next(tree, [], "")
    assert isinstance(result, SocraticResult)
