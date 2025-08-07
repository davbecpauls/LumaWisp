import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  wispstars: integer("wispstars").default(0),
  crystalCrumbs: integer("crystal_crumbs").default(0),
  currentRealm: text("current_realm").default("aether"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const lumaConversations = pgTable("luma_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  messages: jsonb("messages").notNull(),
  realm: text("realm").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  challengeType: text("challenge_type").notNull(),
  completed: timestamp("completed"),
  realm: text("realm"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(lumaConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LumaConversation = typeof lumaConversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export const realmSchema = z.enum(["aether", "fire", "water", "earth", "air"]);
export type Realm = z.infer<typeof realmSchema>;

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "luma"]),
  content: z.string(),
  timestamp: z.string(),
  realm: realmSchema.optional(),
});

export type Message = z.infer<typeof messageSchema>;
