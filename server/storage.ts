
// Minimal storage implementation
export interface IStorage {
  // No persistent storage required for this bot
}

export class MemStorage implements IStorage {}
export const storage = new MemStorage();
