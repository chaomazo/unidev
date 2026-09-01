# Contributing to UNIDEV

Thanks for helping build a sharper home for 3D action and adventure game makers.

## Start here

1. Clone the repository and open the site with a static server:
   python -m http.server 4173 --directory site
2. Visit http://localhost:4173 and check the page at mobile and desktop widths.
3. For the retained Python workspace, install Python 3.10+ dependencies and run the existing test suite with python -m pytest.

## Contribution guidelines

- Keep the public experience fast, accessible, responsive, and dependency-light.
- Prefer semantic HTML and progressive enhancement over framework complexity for the landing layer.
- Keep motion purposeful and respect prefers-reduced-motion.
- Add project copy that is specific about the build, not generic startup language.
- Use the palette and voice in docs/BRAND.md.
- Add tests for changes to the legacy Python CLI.
- Never commit API keys, access tokens, private build files, or generated media.

## Pull requests

Explain the creator-facing outcome in the PR description. Screenshots or a short capture are useful for visual changes. Keep each PR focused enough that a reviewer can understand the tradeoff without reconstructing the whole product.
