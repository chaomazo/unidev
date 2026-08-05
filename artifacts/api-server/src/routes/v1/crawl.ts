import { Router } from "express";
import { fetchUrl } from "../../lib/fetcher.js";
import { extractPage } from "../../lib/extractor.js";
import {
  createCrawlJob,
  getJob,
  updateJob,
  type CrawlPage,
} from "../../lib/crawl-store.js";
import { logger } from "../../lib/logger.js";

const crawlRouter = Router();

async function runCrawl(
  jobId: string,
  startUrl: string,
  maxDepth: number,
  limit: number,
  excludePaths: string[],
): Promise<void> {
  updateJob(jobId, { status: "running" });

  const base = new URL(startUrl);
  const visited = new Set<string>();
  const queue: Array<{ url: string; depth: number }> = [
    { url: startUrl, depth: 0 },
  ];
  const pages: CrawlPage[] = [];

  while (queue.length > 0 && pages.length < limit) {
    const item = queue.shift();
    if (!item) break;

    const { url, depth } = item;
    if (visited.has(url)) continue;
    visited.add(url);

    // Check excluded paths
    try {
      const u = new URL(url);
      if (excludePaths.some((p) => u.pathname.startsWith(p))) continue;
      if (u.hostname !== base.hostname) continue;
    } catch {
      continue;
    }

    try {
      const fetched = await fetchUrl(url, { timeoutMs: 10000 });
      const extracted = extractPage(
        fetched.html,
        fetched.url,
        fetched.statusCode,
      );

      pages.push({
        url: fetched.url,
        markdown: extracted.markdown,
        text: extracted.text,
        links: extracted.links,
        metadata: {
          title: extracted.metadata.title,
          description: extracted.metadata.description,
          statusCode: fetched.statusCode,
          fetchedAt: extracted.metadata.fetchedAt,
        },
      });

      updateJob(jobId, {
        completed: pages.length,
        total: Math.max(pages.length, queue.length + pages.length),
        data: [...pages],
      });

      // Enqueue same-domain links
      if (depth < maxDepth) {
        for (const link of extracted.links) {
          if (!visited.has(link)) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (err) {
      const error = err as Error;
      logger.warn({ url, error: error.message }, "Crawl: failed to fetch page");
    }
  }

  updateJob(jobId, {
    status: "completed",
    completed: pages.length,
    total: pages.length,
    data: pages,
    completedAt: new Date().toISOString(),
  });
}

// Start a crawl job
crawlRouter.post("/v1/crawl", (req, res) => {
  const {
    url,
    maxDepth = 1,
    limit = 10,
    excludePaths = [],
  } = req.body as {
    url?: string;
    maxDepth?: number;
    limit?: number;
    excludePaths?: string[];
  };

  if (!url || typeof url !== "string") {
    res.status(400).json({ success: false, error: "Missing required field: url" });
    return;
  }

  try {
    new URL(url);
  } catch {
    res.status(400).json({ success: false, error: "Invalid URL format" });
    return;
  }

  const job = createCrawlJob(url);

  // Run async — don't await
  runCrawl(
    job.id,
    url,
    Math.min(maxDepth, 5),
    Math.min(limit, 50),
    excludePaths,
  ).catch((err: Error) => {
    logger.error({ jobId: job.id, error: err.message }, "Crawl job failed");
    updateJob(job.id, { status: "failed", error: err.message });
  });

  res.status(202).json({
    success: true,
    jobId: job.id,
    status: "queued",
    message: `Crawl started. Poll GET /api/v1/crawl/${job.id} for results.`,
  });
});

// Get crawl status
crawlRouter.get("/v1/crawl/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);

  if (!job) {
    res.status(404).json({ success: false, error: "Crawl job not found" });
    return;
  }

  res.json({
    success: true,
    jobId: job.id,
    status: job.status,
    completed: job.completed,
    total: job.total,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
    ...(job.status === "completed" ? { data: job.data } : {}),
    ...(job.error ? { error: job.error } : {}),
  });
});

export default crawlRouter;
