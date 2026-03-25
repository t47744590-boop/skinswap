import { pgTable, text, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { listingsTable } from "./listings";
import { usersTable } from "./users";

export const tradesTable = pgTable("trades", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => listingsTable.id),
  buyerId: text("buyer_id").notNull().references(() => usersTable.steamId),
  sellerId: text("seller_id").notNull().references(() => usersTable.steamId),
  offeredSkinName: text("offered_skin_name").notNull(),
  offeredItemType: text("offered_item_type").notNull(),
  offeredGame: text("offered_game", { enum: ["CS2", "TF2", "Roblox"] }).notNull(),
  offeredImageUrl: text("offered_image_url"),
  message: text("message"),
  status: text("status", { enum: ["pending", "accepted", "declined"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTradeSchema = createInsertSchema(tradesTable).omit({ id: true, createdAt: true, updatedAt: true, status: true });
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof tradesTable.$inferSelect;
