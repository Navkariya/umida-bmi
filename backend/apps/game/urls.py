from django.urls import path

from apps.game.views import complete_game, scenarios, submit_round

urlpatterns = [
    path("scenarios/", scenarios, name="game-scenarios"),
    path("submit/", submit_round, name="game-submit"),
    path("complete/", complete_game, name="game-complete"),
]
