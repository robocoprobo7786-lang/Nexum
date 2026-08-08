import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { publication } from "./publication";

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  publicationId: integer("publication_id").notNull().references(() => publication.id, { onDelete: 'cascade' }),
  evidenceType: varchar("evidence_type", { length: 100 }).notNull(),
  reference: varchar("reference", { length: 500 }).notNull(),
  verificationStatus: varchar("verification_status", { length: 50 }).notNull().default('pending'),
});

export const evidenceRelations = relations(evidence, ({ one }) => ({
  publication: one(publication, {
    fields: [evidence.publicationId],
    references: [publication.id],
  }),
}));

export type Evidence = InferSelectModel<typeof evidence>;
export type NewEvidence = InferInsertModel<typeof evidence>;
