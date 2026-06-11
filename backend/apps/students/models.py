import uuid

from django.db import models


class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ism = models.CharField(max_length=120)
    sinf = models.CharField(max_length=10, default="8")
    guruh = models.CharField(
        max_length=20,
        choices=[("experimental", "Eksp"), ("control", "Nazorat")],
        default="experimental",
    )
    kirish_kodi = models.CharField(max_length=20, unique=True, db_index=True)
    yaratilgan = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["yaratilgan"]

    def __str__(self) -> str:
        return f"{self.ism} ({self.kirish_kodi})"
