import { pgTable, text, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  hasCode: boolean("has_code").default(false),
  projectId: serial("project_id").references(() => projects.id),
});

export const insertProjectSchema = createInsertSchema(projects);
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
