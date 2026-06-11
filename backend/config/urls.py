"""Root URL configuration. App routes are mounted under /api/."""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", include("apps.health.urls")),
    path("api/students/", include("apps.students.urls")),
    path("api/game/", include("apps.game.urls")),
    path("api/socratic/", include("apps.socratic.urls")),
    path("api/teacher/", include("apps.teacher.urls")),
]
