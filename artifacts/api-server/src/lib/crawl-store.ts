import { randomUUID } from "crypto";

export type CrawlStatus = "queued" | "running" | "completed" | "failed";

export interface CrawlPage {
  url: string;
  markdown: string;
  text: string;
  links: string[];
  metadata: {
    title: string | null;
    description: string | null;
    statusCode: number;
    fetchedAt: string;
  };
}

export interface CrawlJob {
  id: string;
  url: string;
  status: CrawlStatus;
  createdAt: string;
  completedAt: string | null;
  total: number;
  completed: number;
  data: CrawlPage[];
  error: string | null;
}

// In-memory store — production would use Redis or a DB
const jobs = new Map<string, CrawlJob>();

export function createCrawlJob(url: string): CrawlJob {
  const job: CrawlJob = {
    id: `crawl_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
    url,
    status: "queued",
    createdAt: new Date().toISOString(),
    completedAt: null,
    total: 0,
    completed: 0,
    data: [],
    error: null,
  };
  jobs.set(job.id, job);
  return job;
}

export function getJob(id: string): CrawlJob | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, patch: Partial<CrawlJob>): void {
  const job = jobs.get(id);
  if (job) jobs.set(id, { ...job, ...patch });
}
