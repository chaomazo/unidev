from pathlib import Path

from scenepilot.cli import doctor, init_workspace


def test_init_workspace_creates_manifest_and_directories(tmp_path: Path) -> None:
    assert init_workspace(tmp_path) == 0
    for directory in ("pipeline_defs", "skills", "tools", "productions"):
        assert (tmp_path / directory).is_dir()
    assert (tmp_path / "scenepilot.yaml").is_file()


def test_doctor_returns_a_result() -> None:
    assert doctor() in (0, 1)
