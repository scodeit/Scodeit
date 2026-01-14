
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
      "/dl <arguments>\n" +
      "/help - Show yt-dlp help\n\n" +
      "Example:\n" +
      "/dl https://youtube.com/watch?v=...\n" +
      "/dl -f bestaudio https://..."
    );
  });

  bot.command("help", async (ctx) => {
    const { spawn } = await import('child_process');
    const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';
    
    await ctx.reply("Fetching help info...");
    
    const child = spawn(YTDLP_PATH, ["--help"]);
    let output = "";
    
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    child.on("close", async () => {
      // Telegram has a 4096 char limit per message.
      // We'll send the first part and suggest using a file if it's too long, 
      // but for simplicity let's just send the most important part or the beginning.
      // Actually, it's better to send it as a file since it's very long.
      const helpPath = "/tmp/ytdlp_help.txt";
      await fs.promises.writeFile(helpPath, output);
      await ctx.replyWithDocument(new InputFile(helpPath));
    });
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
