# Contributing to SparkFetch

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/sparkfetch.git
cd sparkfetch

# 2. Install dependencies
pnpm install

# 3. Start the API server
pnpm --filter @workspace/api-server run dev
```

## Project Structure

| Path | Purpose |
|------|---------|
| `artifacts/api-server/` | The main Express API |
| `artifacts/api-server/src/routes/v1/` | Versioned route handlers |
| `artifacts/api-server/src/lib/` | Core utilities (fetcher, extractor) |
| `lib/api-spec/openapi.yaml` | Single source of truth for API contracts |
| `lib/api-zod/` | Generated Zod schemas (do not edit manually) |

## Making Changes

### API changes

1. Update `lib/api-spec/openapi.yaml` first (contract-first approach)
2. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
3. Implement the route handler in `artifacts/api-server/src/routes/v1/`
4. Register the route in `artifacts/api-server/src/routes/index.ts`

### Typecheck

```bash
pnpm run typecheck
```

## Commit Style

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add crawl depth control
fix: handle timeout on slow pages
docs: update API reference
refactor: extract html-to-markdown into lib
```

## Code Style

- TypeScript strict mode
- No `console.log` in server code — use the `logger` singleton
- Errors should be explicit, not silently swallowed

## Opening a Pull Request

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes and run typecheck
4. Push and open a PR against `main`

---

Questions? Open an issue and we'll help you out.
