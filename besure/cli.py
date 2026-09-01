"""Command-line entry point for the Besure starter toolkit."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="besure", description="Bootstrap and inspect a Besure production workspace.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    init_parser = subparsers.add_parser("init", description="Create the standard Besure workspace folders.")
    init_parser.add_argument("path", nargs="?", default=".", help="Workspace directory")
    subparsers.add_parser("doctor", description="Check the local tools used by video production.")
    return parser


def init_workspace(path: str | Path) -> int:
    root = Path(path).expanduser().resolve()
    for directory in ("pipeline_defs", "skills", "tools", "productions"):
        (root / directory).mkdir(parents=True, exist_ok=True)
    manifest = root / "besure.yaml"
    if not manifest.exists():
        manifest.write_text("# Besure workspace manifest\nversion: 1\npipelines: pipeline_defs\nskills: skills\ntools: tools\nproductions: productions\n", encoding="utf-8")
    print(f"Besure workspace ready: {root}")
    return 0


def doctor() -> int:
    checks = {"python": sys.executable, "ffmpeg": shutil.which("ffmpeg"), "ffprobe": shutil.which("ffprobe")}
    failed = False
    for name, value in checks.items():
        status = "OK" if value else "MISSING"
        print(f"{name:8} {status}")
        failed = failed or value is None
    if failed:
        print("Install the missing tools before running production pipelines.")
        return 1
    return 0


def main(argv: list[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)
    if args.command == "init":
        return init_workspace(args.path)
    if args.command == "doctor":
        return doctor()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
