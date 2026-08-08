import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const externalAuthor = pgTable("external_author", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  affiliation: varchar("affiliation", { length: 255 }),
});

export type ExternalAuthor = InferSelectModel<typeof externalAuthor>;
export type NewExternalAuthor = InferInsertModel<typeof externalAuthor>;
