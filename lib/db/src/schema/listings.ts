import { pgTable, text, timestamp, serial, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.steamId),
  game: text("game", { enum: ["CS2", "TF2", "Roblox"] }).notNull().default("CS2"),
  skinName: text("skin_name").notNull(),
  itemType: text("item_type").notNull(),
  wear: text("wear"),
  float: real("float"),
  imageUrl: text("image_url"),
  status: text("status", { enum: ["active", "traded", "cancelled"] }).notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, updatedAt: true, status: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
