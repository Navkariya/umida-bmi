from django.urls import path

from apps.students.views import student_history, student_login

urlpatterns = [
    path("login/", student_login, name="student-login"),
    path("<uuid:student_id>/history/", student_history, name="student-history"),
]
