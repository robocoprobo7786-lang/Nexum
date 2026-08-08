import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { publication } from "./publication";

export const publicationType = pgTable("publication_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const publicationTypeRelations = relations(publicationType, ({ many }) => ({
  publications: many(publication),
}));

export type PublicationType = InferSelectModel<typeof publicationType>;
export type NewPublicationType = InferInsertModel<typeof publicationType>;
