import { Router } from "express";
import { fetchUrl } from "../../lib/fetcher.js";
import { extractPage } from "../../lib/extractor.js";

const mapRouter = Router();

mapRouter.post("/v1/map", async (req, res) => {
  const { url, limit = 100 } = req.body as {
    url?: string;
    limit?: number;
  };

  if (!url || typeof url !== "string") {
    res.status(400).json({ success: false, error: "Missing required field: url" });
    return;
  }

  let base: URL;
  try {
    base = new URL(url);
  } catch {
    res.status(400).json({ success: false, error: "Invalid URL format" });
    return;
  }

  try {
    const fetched = await fetchUrl(url);
    const extracted = extractPage(fetched.html, fetched.url, fetched.statusCode);

    // Filter to same-domain links only
    const sameDomain = extracted.links
      .filter((link) => {
        try {
          return new URL(link).hostname === base.hostname;
        } catch {
          return false;
        }
      })
      .slice(0, Math.min(limit, 500));

    res.json({
      success: true,
      url: fetched.url,
      total: sameDomain.length,
      links: sameDomain,
    });
  } catch (err) {
    const error = err as Error;
    req.log.error({ url, error: error.message }, "Map failed");
    res.status(502).json({
      success: false,
      error: error.message || "Failed to fetch URL",
    });
  }
});

export default mapRouter;
