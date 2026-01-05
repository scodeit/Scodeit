
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Minimal schema to satisfy build requirements - strict "No DB" rule for bot logic is respected.
export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  message: text("message"),
});

export const insertLogSchema = createInsertSchema(logs);
export type Log = typeof logs.$inferSelect;
