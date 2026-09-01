# Contributing to Besure

Thanks for helping make playable game work easier to share, experience, and improve.

## Before you start

1. Check existing issues and pull requests before opening a new one.
2. For substantial product changes, open an issue first so the direction can be discussed.
3. Keep pull requests focused on one user-facing outcome.

## Local development

```bash
python -m http.server 4173 --directory site
# open http://localhost:4173
python -m pip install -e .
python -m pytest
```

Check the landing experience at mobile and desktop widths. For visual changes, verify keyboard navigation, contrast, focus states, and `prefers-reduced-motion` behavior.

## Contribution standards

- Prefer semantic HTML, progressive enhancement, and a small dependency surface.
- Keep copy specific to the creator problem being solved; avoid vague product language.
- Keep motion purposeful and never make it the only way to understand an interaction.
- Add or update tests when changing the Python toolkit.
- Update documentation when behavior, commands, or product direction changes.
- Never commit passwords, API keys, access tokens, private build files, or generated media.

## Pull requests

Include the problem, the user-facing outcome, and how you verified the change. Screenshots or a short recording are useful for visual work. Mention known limitations instead of hiding them.

Use a clear title, keep reviewable commits, and respond to feedback with the tradeoff behind the decision—not only the resulting diff.

## Commit messages

Use concise, imperative subjects such as `feat: add project showcase cards`, `fix: preserve keyboard focus`, or `docs: clarify local setup`.
