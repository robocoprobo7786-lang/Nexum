import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { publicationType } from "./publicationType";
import { publicationAuthor } from "./publicationAuthor";
import { evidence } from "./evidence";

export type Quartile = "Q1" | "Q2" | "Q3" | "Q4";

export const publication = pgTable("publication", {
  id: serial("id").primaryKey(),
  publicationTypeId: integer("publication_type_id").notNull().references(() => publicationType.id),
  title: varchar("title", { length: 500 }).notNull(),
  journalOrConference: varchar("journal_or_conference", { length: 500 }),
  year: integer("year").notNull(),
  doiOrReference: varchar("doi_or_reference", { length: 500 }),
  quartile: varchar("quartile", { length: 10 }).$type<Quartile>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const publicationRelations = relations(publication, ({ one, many }) => ({
  publicationType: one(publicationType, {
    fields: [publication.publicationTypeId],
    references: [publicationType.id],
  }),
  publicationAuthors: many(publicationAuthor),
  evidences: many(evidence),
}));

export type Publication = InferSelectModel<typeof publication>;
export type NewPublication = InferInsertModel<typeof publication>;

