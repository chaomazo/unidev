# Unidev architecture

Unidev is being developed as a lightweight set of creator-facing surfaces rather than a monolithic dashboard.

## Product surfaces

1. **Showcase** — a durable page for a project, playable build, context, team, changelog, and known rough edges.
2. **Playtest** — a low-friction session where people can experience the build and leave useful observations.
3. **Review** — structured feedback that keeps player notes specific and easy to discuss.
4. **Exhibition** — curated collections that give strong playable work a recurring public moment.

## Current implementation

- `site/` is a dependency-light static landing layer with semantic HTML, CSS, and progressive enhancement.
- `unidev/` contains the small Python workspace toolkit used to initialize and inspect local production folders.
- `docs/` records decisions so the product can grow without losing its point of view.

## Direction

The next implementation step is to introduce persistent project data behind the showcase surface. Build delivery and feedback should remain separate concerns: a creator should be able to update context without invalidating a playtest, and a review should remain attached to the build it describes.

Prefer simple boundaries, explicit states, accessible defaults, and migrations that preserve a creator's history. Do not add infrastructure merely to make the architecture diagram look complete.
