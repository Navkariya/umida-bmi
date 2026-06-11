import uuid

from django.db import models


class SocraticSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        "students.Student",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sokrat_sessiyalar",
    )
    game_sessiya_id = models.IntegerField(null=True, blank=True)
    tur_raqami = models.PositiveSmallIntegerField(default=0)
    stsenariy_tur = models.CharField(max_length=20, default="yolgon_top")
    transkript = models.JSONField(default=list)
    navbat_soni = models.PositiveSmallIntegerField(default=0)
    tugagan = models.BooleanField(default=False)
    yaratilgan = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-yaratilgan"]

    def __str__(self) -> str:
        return f"Sokrat {self.pk} (tur={self.tur_raqami})"
