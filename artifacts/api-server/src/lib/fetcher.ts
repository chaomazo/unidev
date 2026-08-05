import { logger } from "./logger.js";

export interface FetchResult {
  html: string;
  statusCode: number;
  url: string;
  headers: Record<string, string>;
}

export interface FetchOptions {
  timeoutMs?: number;
  userAgent?: string;
  followRedirects?: boolean;
}

const DEFAULT_USER_AGENT =
  "SparkFetch/1.0 (+https://github.com/Sparkfetch/sparkfetch)";

export async function fetchUrl(
  url: string,
  options: FetchOptions = {},
): Promise<FetchResult> {
  const { timeoutMs = 15000, userAgent = DEFAULT_USER_AGENT } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": userAgent,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
      },
      redirect: "follow",
    });

    const html = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      html,
      statusCode: response.status,
      url: response.url,
      headers,
    };
  } catch (err) {
    const error = err as Error;
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    logger.error({ url, error: error.message }, "Failed to fetch URL");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
