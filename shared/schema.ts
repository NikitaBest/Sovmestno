import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const compatibilitySessions = pgTable("compatibility_sessions", {
  id: serial("id").primaryKey(),
  telegramUserId: text("telegram_user_id"),
  person1Date: text("person1_date").notNull(),
  person1Time: text("person1_time").notNull(),
  person2Date: text("person2_date").notNull(),
  person2Time: text("person2_time").notNull(),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCompatibilitySessionSchema = createInsertSchema(compatibilitySessions).pick({
  telegramUserId: true,
  person1Date: true,
  person1Time: true,
  person2Date: true,
  person2Time: true,
  results: true,
});

export const compatibilityRequestSchema = z.object({
  person1Date: z.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Date must be in DD.MM.YYYY format")
    .refine((date) => {
      const [day, month, year] = date.split('.').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getDate() === day && 
             dateObj.getMonth() === month - 1 && 
             dateObj.getFullYear() === year &&
             dateObj <= new Date();
    }, "Invalid date or date in the future"),
  person1Time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  person2Date: z.string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Date must be in DD.MM.YYYY format")
    .refine((date) => {
      const [day, month, year] = date.split('.').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.getDate() === day && 
             dateObj.getMonth() === month - 1 && 
             dateObj.getFullYear() === year &&
             dateObj <= new Date();
    }, "Invalid date or date in the future"),
  person2Time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  telegramUserId: z.string().optional(),
});

export const compatibilityResultsSchema = z.object({
  zodiac_compatibility: z.number().min(0).max(100),
  elemental_compatibility: z.number().min(0).max(100),
  numerological_compatibility: z.number().min(0).max(100),
  emotional_compatibility: z.number().min(0).max(100),
  intellectual_compatibility: z.number().min(0).max(100),
  overall_compatibility: z.number().min(0).max(100),
  compatibility_message: z.string().optional(),
  detailed_description: z.string().optional(),
  zodiac_signs: z.object({
    person1: z.string(),
    person2: z.string(),
  }).optional(),
  lucky_colors: z.array(z.string()).optional(),
  best_activities: z.array(z.string()).optional(),
  best_dates: z.array(z.string()).optional(),
  best_dates_comment: z.string().optional(),
  relationship_tips: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCompatibilitySession = z.infer<typeof insertCompatibilitySessionSchema>;
export type CompatibilitySession = typeof compatibilitySessions.$inferSelect;
export type CompatibilityRequest = z.infer<typeof compatibilityRequestSchema>;
export type CompatibilityResults = z.infer<typeof compatibilityResultsSchema>;
