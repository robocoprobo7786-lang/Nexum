import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { publicationAuthor } from "./publicationAuthor";

export const externalAuthor = pgTable("external_author", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  affiliation: varchar("affiliation", { length: 255 }),
});

export const externalAuthorRelations = relations(externalAuthor, ({ many }) => ({
  publicationAuthors: many(publicationAuthor),
}));

export type ExternalAuthor = InferSelectModel<typeof externalAuthor>;
export type NewExternalAuthor = InferInsertModel<typeof externalAuthor>;
