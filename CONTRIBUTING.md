# Contributing to ScenePilot

Thanks for helping build an open-source video production system.

## Getting started

1. Install Python 3.10 or newer.
2. Install the package in editable mode with python -m pip install -e .
3. Run scenepilot init demo to create a local workspace.
4. Run python -m pytest before opening a pull request.

## Contribution guidelines

- Keep tools focused and composable.
- Prefer deterministic, file-based outputs.
- Document provider requirements and costs before adding a network-backed tool.
- Add tests for new CLI behavior and validation rules.
- Never commit API keys, access tokens, generated media, or private production files.
