
import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { startBot } from "./bot";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check API
  app.get(api.status.get.path, (_req, res) => {
    res.json({ status: "running" });
  });

  // Start the Telegram bot
  try {
    if (process.env.BOT_TOKEN) {
      console.log("Starting Telegram bot...");
      startBot();
    } else {
      console.warn("BOT_TOKEN is not set. Bot will not start.");
    }
  } catch (error) {
    console.error("Failed to start bot:", error);
  }

  return httpServer;
}
