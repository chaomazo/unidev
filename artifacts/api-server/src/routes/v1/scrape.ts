import { Router } from "express";
import { fetchUrl } from "../../lib/fetcher.js";
import { extractPage } from "../../lib/extractor.js";

const scrapeRouter = Router();

scrapeRouter.post("/v1/scrape", async (req, res) => {
  const { url, formats = ["markdown"] } = req.body as {
    url?: string;
    formats?: string[];
  };

  if (!url || typeof url !== "string") {
    res.status(400).json({
      success: false,
      error: "Missing required field: url",
    });
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    res.status(400).json({
      success: false,
      error: "Invalid URL format",
    });
    return;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    res.status(400).json({
      success: false,
      error: "Only http and https URLs are supported",
    });
    return;
  }

  try {
    const fetched = await fetchUrl(url);
    const extracted = extractPage(fetched.html, fetched.url, fetched.statusCode);

    const data: Record<string, unknown> = {
      metadata: extracted.metadata,
    };

    if (formats.includes("markdown")) {
      data.markdown = extracted.markdown;
    }
    if (formats.includes("html")) {
      data.html = extracted.html;
    }
    if (formats.includes("text")) {
      data.text = extracted.text;
    }
    if (formats.includes("links")) {
      data.links = extracted.links;
    }

    res.json({ success: true, data });
  } catch (err) {
    const error = err as Error;
    req.log.error({ url, error: error.message }, "Scrape failed");
    res.status(502).json({
      success: false,
      error: error.message || "Failed to fetch URL",
    });
  }
});

export default scrapeRouter;
