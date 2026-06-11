from django.urls import path

from apps.teacher.views import (
    group_stats,
    student_detail,
    student_list,
    teacher_login,
    teacher_logout,
)

urlpatterns = [
    path("login/", teacher_login, name="teacher-login"),
    path("logout/", teacher_logout, name="teacher-logout"),
    path("students/", student_list, name="teacher-students"),
    path("groups/", group_stats, name="teacher-groups"),
    path("students/<uuid:student_id>/", student_detail, name="teacher-student-detail"),
]
