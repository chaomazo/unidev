import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import scrapeRouter from "./v1/scrape.js";
import crawlRouter from "./v1/crawl.js";
import mapRouter from "./v1/map.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scrapeRouter);
router.use(crawlRouter);
router.use(mapRouter);

export default router;
