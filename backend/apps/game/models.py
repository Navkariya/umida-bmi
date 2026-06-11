from django.db import models


class Fan(models.Model):
    nom = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10, blank=True)
    rang = models.CharField(max_length=20, blank=True)

    class Meta:
        ordering = ["pk"]

    def __str__(self) -> str:
        return f"{self.emoji} {self.nom}"


class GameScenario(models.Model):
    TUR_TURI = [
        ("yolgon_top", "Yolg'onni top"),
        ("detektiv", "Dalilchi Detektiv"),
    ]
    tur = models.PositiveSmallIntegerField(help_text="1-5")
    tur_turi = models.CharField(max_length=20, choices=TUR_TURI)
    mazmun = models.JSONField()
    fan = models.ForeignKey(
        Fan,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="stsenariylar",
    )

    class Meta:
        ordering = ["tur"]

    def __str__(self) -> str:
        return f"Stsenariy {self.tur} ({self.tur_turi})"


class GameSession(models.Model):
    HOLAT = [("faol", "Faol"), ("tugagan", "Tugagan")]
    student = models.ForeignKey(
        "students.Student",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sessiyalar",
    )
    fan = models.ForeignKey(
        Fan,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sessiyalar",
    )
    boshlangan = models.DateTimeField(auto_now_add=True)
    holat = models.CharField(max_length=20, choices=HOLAT, default="faol")
    stsenariy_tartib = models.JSONField(default=list)

    class Meta:
        ordering = ["-boshlangan"]

    def __str__(self) -> str:
        return f"Sessiya {self.pk} ({self.holat})"


class RoundAnswer(models.Model):
    sessiya = models.ForeignKey(
        GameSession, on_delete=models.CASCADE, related_name="javoblar"
    )
    stsenariy = models.ForeignKey(
        GameScenario, on_delete=models.PROTECT, related_name="javoblar"
    )
    tur_raqami = models.PositiveSmallIntegerField()
    tanlangan_davo = models.CharField(max_length=20)
    tanlangan_dalillar = models.JSONField(default=list)
    tushuntirish = models.TextField(blank=True)
    tanlov_ball = models.IntegerField(default=0)
    dalil_ball = models.IntegerField(default=0)
    tushuntirish_ball = models.IntegerField(default=0)
    jami_ball = models.IntegerField(default=0)
    ai_izoh = models.TextField(blank=True)

    class Meta:
        unique_together = ("sessiya", "tur_raqami")
        ordering = ["tur_raqami"]

    def __str__(self) -> str:
        return f"Sessiya {self.sessiya_id} Raund {self.tur_raqami}"


class GameScore(models.Model):
    student = models.ForeignKey(
        "students.Student",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="natijalar",
    )
    sessiya = models.OneToOneField(
        GameSession, on_delete=models.CASCADE, related_name="yakuniy_natija"
    )
    oyin = models.CharField(max_length=50, default="dalilchi_detektiv")
    ball = models.IntegerField(default=0)
    vaqt = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-vaqt"]

    def __str__(self) -> str:
        return f"Natija: {self.ball} ball"
