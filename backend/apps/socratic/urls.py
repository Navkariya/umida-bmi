from django.urls import path

from apps.socratic.views import socratic_reply

urlpatterns = [
    path("reply/", socratic_reply, name="socratic-reply"),
]
