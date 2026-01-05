
const FORBIDDEN_FLAGS = [
  '-U', '--update',
  '--rm-cache-dir',
  '--exec',
  '--postprocessor-args',
  '--config-location',
  '--paths', '-P',
  '-o', '--output',
  '--print', '--dump-json',
  '--cookies-from-browser',
  '--username', '--password', '--netrc',
  '--proxy',
  '--cache-dir',
  '--write-info-json',
  '--write-description',
  '--write-thumbnail'
];

export function validateArgs(args: string[]): { valid: boolean; error?: string } {
  if (args.length === 0) {
    return { valid: false, error: "Arguments cannot be empty." };
  }

  // Check for forbidden flags
  for (const arg of args) {
    // Check exact matches or starts with for flags that might take values with = (e.g. --output=...)
    // Although --output=val is usually split, but let's be safe.
    // yt-dlp usually treats --flag value as separate, but --flag=value is also possible.
    const cleanArg = arg.split('=')[0];
    
    if (FORBIDDEN_FLAGS.includes(cleanArg)) {
      return { valid: false, error: `Forbidden flag detected: ${cleanArg}` };
    }
  }

  // Check if there is at least one URL (heuristic: contains http/https)
  const hasUrl = args.some(arg => arg.startsWith('http://') || arg.startsWith('https://'));
  if (!hasUrl) {
    return { valid: false, error: "No URL found in arguments." };
  }

  return { valid: true };
}
