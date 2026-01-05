
/**
 * Parses a command string into an array of arguments, respecting quotes.
 * Example: '-f "best video" url' -> ['-f', 'best video', 'url']
 */
export function parseArgs(command: string): string[] {
  const args: string[] = [];
  let current = '';
  let quote: string | null = null;
  let escape = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
    } else {
      if (char === '"' || char === "'") {
        quote = char;
      } else if (/\s/.test(char)) {
        if (current.length > 0) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
  }

  if (current.length > 0) {
    args.push(current);
  }

  return args;
}
