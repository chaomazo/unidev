---
name: SparkFetch GitHub repo
description: Git remote setup and GitHub repo details for the Sparkfetch account
---

## Repo
- URL: https://github.com/Sparkfetch/sparkfetch
- Remote `origin` is configured in the workspace using GITHUB_TOKEN (via credential URL)
- Default branch: `main`

## Push workflow
- Token stored as secret `GITHUB_TOKEN`
- Remote added as: `https://Sparkfetch:${GITHUB_TOKEN}@github.com/Sparkfetch/sparkfetch.git`
- Push with: `git push origin main`

**Why:** Token is in the remote URL so `git push` works without a credential helper. Re-add remote if token is rotated.

**How to apply:** Before pushing future changes, verify remote is still set (`git remote -v`). If missing, re-add with the current token value.
