"""Health-check endpoint. Used by the frontend and deploy platform to
verify the backend is reachable and serving JSON."""
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

SERVICE_NAME = "bmi-backend"
API_VERSION = "0.1.0"


@api_view(["GET"])
def health(_request: Request) -> Response:
    """Return a simple liveness payload."""
    return Response(
        {
            "status": "ok",
            "service": SERVICE_NAME,
            "version": API_VERSION,
        }
    )
