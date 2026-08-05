<div align="center">
  <h1>⚡ SparkFetch</h1>
  <p><strong>Turn any URL into clean, structured, LLM-ready content.</strong></p>
  <p>The open-source web fetching & content extraction API.</p>

  <p>
    <a href="https://sparkfetch.site"><img src="https://img.shields.io/badge/website-sparkfetch.site-FFB800?style=flat-square&logo=globe" alt="Website"></a>
    <a href="https://github.com/Sparkfetch/sparkfetch/stargazers"><img src="https://img.shields.io/github/stars/Sparkfetch/sparkfetch?style=flat-square&logo=github&color=FFB800" alt="Stars"></a>
    <a href="https://github.com/Sparkfetch/sparkfetch/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
    <a href="https://github.com/Sparkfetch/sparkfetch/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Sparkfetch/sparkfetch/ci.yml?style=flat-square&label=CI" alt="CI"></a>
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js" alt="Node.js">
  </p>
</div>

---

## What is SparkFetch?

SparkFetch is a powerful, self-hostable API that crawls and extracts web content — converting messy HTML into clean Markdown, structured JSON, or plain text. Built for AI applications, RAG pipelines, research tools, and any workflow that needs reliable web data.

**Key capabilities:**

- 🌐 **Scrape** — Fetch any URL and get clean Markdown + metadata
- 🕷️ **Crawl** — Recursively crawl entire websites with depth control
- 🗺️ **Map** — Discover all URLs on a domain instantly
- 🧹 **Clean output** — Strip nav, ads, and boilerplate automatically
- 📦 **Structured data** — Returns JSON with title, description, links, and content
- ⚡ **Fast** — Built on Node.js 24 + Express 5

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Sparkfetch/sparkfetch.git
cd sparkfetch

# Install dependencies
pnpm install

# Start the development server
pnpm --filter @workspace/api-server run dev
```

The API will be available at `http://localhost:5000/api`.

---

## API Reference

### `POST /api/v1/scrape`

Fetch a single URL and return its content as Markdown with metadata.

**Request:**
```json
{
  "url": "https://example.com",
  "formats": ["markdown", "html"],
  "includeTags": ["article", "main"],
  "excludeTags": ["nav", "footer", "aside"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "markdown": "# Page Title\n\nContent here...",
    "metadata": {
      "title": "Page Title",
      "description": "Page description",
      "url": "https://example.com",
      "statusCode": 200,
      "fetchedAt": "2025-01-01T00:00:00Z"
    }
  }
}
```

---

### `POST /api/v1/crawl`

Crawl a website recursively and extract content from all pages.

**Request:**
```json
{
  "url": "https://example.com",
  "maxDepth": 2,
  "limit": 10,
  "excludePaths": ["/login", "/admin"]
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "crawl_abc123",
  "status": "queued",
  "message": "Crawl job started. Use GET /api/v1/crawl/:jobId to check status."
}
```

---

### `GET /api/v1/crawl/:jobId`

Check the status of a crawl job.

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "completed": 8,
  "total": 8,
  "data": [
    {
      "url": "https://example.com",
      "markdown": "# Home\n\n...",
      "metadata": { "title": "Home", "statusCode": 200 }
    }
  ]
}
```

---

### `POST /api/v1/map`

Discover all accessible URLs on a domain.

**Request:**
```json
{
  "url": "https://example.com",
  "limit": 100
}
```

**Response:**
```json
{
  "success": true,
  "links": [
    "https://example.com/",
    "https://example.com/about",
    "https://example.com/blog"
  ]
}
```

---

### `GET /api/healthz`

Health check endpoint.

---

## Use Cases

| Use Case | How SparkFetch Helps |
|----------|---------------------|
| **AI / RAG pipelines** | Feed clean Markdown into your LLM context |
| **Research automation** | Batch-crawl sources and extract structured info |
| **Content monitoring** | Track page changes with periodic scraping |
| **Data collection** | Turn any website into structured JSON datasets |
| **Documentation indexing** | Crawl and index docs sites for search |

---

## Project Structure

```
sparkfetch/
├── artifacts/
│   └── api-server/         # Express API (TypeScript)
│       └── src/
│           ├── routes/
│           │   └── v1/     # Versioned API routes
│           └── lib/        # Utilities (fetcher, extractor, markdown)
├── lib/
│   ├── api-spec/           # OpenAPI 3.1 spec + codegen
│   ├── api-zod/            # Zod validation schemas (generated)
│   └── db/                 # Drizzle ORM schema
└── .github/
    └── workflows/
        └── ci.yml          # GitHub Actions CI
```

---

## Self-Hosting

```bash
# Production build
pnpm --filter @workspace/api-server run build

# Set environment variables
export DATABASE_URL="postgresql://..."
export PORT=5000

# Start
pnpm --filter @workspace/api-server run start
```

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

MIT © [SparkFetch](https://github.com/Sparkfetch)

---

<div align="center">
  <sub>Built with ⚡ by <a href="https://github.com/Sparkfetch">SparkFetch</a></sub>
</div>
