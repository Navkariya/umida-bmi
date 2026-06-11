"""Small, dependency-light helpers for reading environment variables."""
import os


def env_str(key: str, default: str = "") -> str:
    """Return env var as a stripped string, or the default if unset/empty."""
    value = os.environ.get(key, "")
    return value.strip() or default


def env_bool(key: str, default: bool = False) -> bool:
    """Parse a truthy env var. Accepts 1/true/yes/on (case-insensitive)."""
    value = os.environ.get(key)
    if value is None or value.strip() == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def env_list(key: str, default: str = "") -> list[str]:
    """Parse a comma-separated env var into a list of trimmed, non-empty items."""
    raw = os.environ.get(key, "").strip() or default
    return [item.strip() for item in raw.split(",") if item.strip()]
