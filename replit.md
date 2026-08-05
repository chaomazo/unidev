# SparkFetch

Turn any URL into clean, structured, LLM-ready content. The open-source web fetching & extraction API.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/routes/v1/` — versioned API route handlers (scrape, crawl, map)
- `artifacts/api-server/src/lib/` — core utilities: fetcher.ts, extractor.ts, crawl-store.ts
- `lib/api-spec/openapi.yaml` — OpenAPI 3.1 spec (source of truth for all API contracts)
- `lib/api-zod/src/generated/` — generated Zod schemas (do not edit manually)

## Architecture decisions

- Contract-first API design: OpenAPI spec is written before route implementation
- HTML-to-Markdown extraction is done with a zero-dependency custom parser (no cheerio) to minimize bundle size
- Crawl jobs are async fire-and-forget backed by in-memory store (upgrade to Redis for production scale)
- All fetch operations use native Node.js `fetch` with AbortController for timeout control

## Product

SparkFetch provides three core API operations:
- **Scrape** (`POST /api/v1/scrape`) — Fetch a URL, extract clean Markdown + metadata
- **Crawl** (`POST /api/v1/crawl`) — Recursively crawl a site; poll for results
- **Map** (`POST /api/v1/map`) — Discover all URLs on a domain

## User preferences

- Repository lives at https://github.com/Sparkfetch/sparkfetch
- No Replit branding in public-facing files

## Gotchas

- Do not run `pnpm dev` at workspace root — use workflow or `pnpm --filter @workspace/api-server run dev`
- Crawl jobs are in-memory only; they are lost on server restart

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/Sparkfetch/sparkfetch
