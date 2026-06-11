from django.urls import path

from apps.game.views import complete_game, fanlar, scenarios, submit_round

urlpatterns = [
    path("fanlar/", fanlar, name="game-fanlar"),
    path("scenarios/", scenarios, name="game-scenarios"),
    path("submit/", submit_round, name="game-submit"),
    path("complete/", complete_game, name="game-complete"),
]
