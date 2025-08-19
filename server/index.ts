import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleStartCrawl,
  handleGetCrawlStatus,
  handleGetCrawlResults,
  handleGetAllSessions,
  handleStopCrawl,
} from "./routes/crawl";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Web Crawler API routes
  app.post("/api/crawl/start", handleStartCrawl);
  app.get("/api/crawl/:sessionId/status", handleGetCrawlStatus);
  app.get("/api/crawl/:sessionId/results", handleGetCrawlResults);
  app.get("/api/crawl/sessions", handleGetAllSessions);
  app.post("/api/crawl/:sessionId/stop", handleStopCrawl);

  return app;
}
