
import { Bot, InputFile } from "grammy";
import { parseArgs } from "./lib/parseArgs";
import { validateArgs } from "./lib/validate";
import { downloadMedia } from "./lib/ytdlp";
import { cleanup } from "./lib/cleanup";
import fs from "fs";

let bot: Bot;

export function startBot() {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN is missing");
  }

  bot = new Bot(process.env.BOT_TOKEN);

  bot.command("start", (ctx) => {
    ctx.reply(
      "Welcome to the yt-dlp wrapper bot!\n\n" +
      "Usage:\n" +
      "/dl <arguments>\n\n" +
      "Example:\n" +
      "/dl https://youtube.com/watch?v=...\n" +
      "/dl -f bestaudio https://..."
    );
  });

  bot.command("dl", async (ctx) => {
    // Get the raw text after the command
    const match = ctx.message?.text?.match(/^\/dl\s+(.+)$/);
    if (!match) {
      return ctx.reply("Usage: /dl <args>");
    }

    const rawArgs = match[1];
    let filePaths: string[] = [];

    try {
      const args = parseArgs(rawArgs);
      
      const validation = validateArgs(args);
      if (!validation.valid) {
        return ctx.reply(`Error: ${validation.error}`);
      }

      await ctx.reply("Downloading... This may take a while.");
      
      const result = await downloadMedia(args);
      filePaths = result.filePaths;

      await ctx.reply("Download complete. Uploading to Telegram...");

      // Send all files as documents
      for (const filePath of filePaths) {
        await ctx.replyWithDocument(new InputFile(filePath));
      }

    } catch (err: any) {
      console.error("Download/Upload error:", err);
      
      let message = "An error occurred.";
      
      // Handle Telegram API errors specifically if possible
      if (err.description && err.description.includes("file is too big")) {
        message = "File is too big for Telegram. Please try changing format/quality options (e.g. -f 'best[filesize<50M]').";
      } else if (err.message) {
        message = `Error: ${err.message}`;
      }

      await ctx.reply(message);
    } finally {
      // Always cleanup
      for (const filePath of filePaths) {
        await cleanup(filePath);
      }
    }
  });

  // Handle non-commands
  bot.on("message", (ctx) => {
    if (!ctx.message.text?.startsWith('/')) {
        ctx.reply("Use /dl <yt-dlp args> to download media.");
    }
  });

  bot.start();
  console.log("Bot started successfully.");
}
