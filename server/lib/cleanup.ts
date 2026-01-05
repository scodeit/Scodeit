
import fs from 'fs';
import path from 'path';

export async function cleanup(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
    
    // Also try to clean up .part files if they exist
    const partPath = filePath + '.part';
    if (fs.existsSync(partPath)) {
      await fs.promises.unlink(partPath);
    }
  } catch (err) {
    console.error(`Failed to cleanup file ${filePath}:`, err);
  }
}

export async function cleanupDir(dir: string, ttlMinutes: number) {
  try {
    if (!fs.existsSync(dir)) return;
    
    const files = await fs.promises.readdir(dir);
    const now = Date.now();
    const ttlMs = ttlMinutes * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      
      if (now - stats.mtimeMs > ttlMs) {
        await fs.promises.unlink(filePath);
        console.log(`Cleaned up old file: ${filePath}`);
      }
    }
  } catch (err) {
    console.error("Background cleanup failed:", err);
  }
}
