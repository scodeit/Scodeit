
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { cleanupDir } from './cleanup';

const TMP_DIR = process.env.TMP_DIR || './tmp';
const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';

// Ensure TMP_DIR exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Start background cleanup interval (every 30 mins)
const TTL_MIN = parseInt(process.env.CLEANUP_TTL_MIN || '30', 10);
setInterval(() => cleanupDir(TMP_DIR, TTL_MIN), 30 * 60 * 1000);

interface DownloadResult {
  filePath: string;
  meta?: string;
}

export function downloadMedia(args: string[]): Promise<DownloadResult> {
  return new Promise((resolve, reject) => {
    // Unique ID for this download to avoid collisions (though yt-dlp has its own ID)
    // We rely on yt-dlp output template to avoid collisions mainly.
    // The requirement says: <TMP_DIR>/%(title).120B [%(id)s].%(ext)s
    const template = path.join(TMP_DIR, '%(title).120B [%(id)s].%(ext)s');

    const finalArgs = [
      '--newline',
      '--no-playlist',
      '-o', template,
      ...args
    ];

    console.log(`Spawning yt-dlp with args: ${finalArgs.join(' ')}`);

    const child = spawn(YTDLP_PATH, finalArgs);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', async (code) => {
      if (code !== 0) {
        // Try to extract useful error message from stderr
        const errorMsg = stderr.split('\n').find(l => l.includes('ERROR:')) || 'Unknown error occurred';
        reject(new Error(`yt-dlp failed with code ${code}: ${errorMsg}`));
        return;
      }

      // Find the most recently created file in TMP_DIR
      try {
        const files = await fs.promises.readdir(TMP_DIR);
        
        if (files.length === 0) {
          reject(new Error("No files found in temp directory after download."));
          return;
        }

        // Filter out .part files and hidden files
        const candidates = files.filter(f => !f.endsWith('.part') && !f.startsWith('.'));
        
        if (candidates.length === 0) {
          reject(new Error("No valid files found (only .part or hidden)."));
          return;
        }

        // Sort by creation time desc
        const stats = await Promise.all(candidates.map(async f => ({
          file: f,
          stat: await fs.promises.stat(path.join(TMP_DIR, f))
        })));
        
        stats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
        
        if (stats.length === 0) {
           reject(new Error("Could not determine downloaded file."));
           return;
        }

        const newest = stats[0];
        resolve({ filePath: path.join(TMP_DIR, newest.file) });

      } catch (err) {
        reject(err);
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}
