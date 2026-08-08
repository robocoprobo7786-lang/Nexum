import { pgTable, serial, integer, check, unique } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, sql, relations } from "drizzle-orm";
import { publication } from "./publication";
import { faculty } from "./faculty";
import { externalAuthor } from "./externalAuthor";

export const publicationAuthor = pgTable("publication_author", {
  id: serial("id").primaryKey(),
  publicationId: integer("publication_id").notNull().references(() => publication.id, { onDelete: 'cascade' }),
  facultyId: integer("faculty_id").references(() => faculty.id, { onDelete: 'restrict' }),
  externalAuthorId: integer("external_author_id").references(() => externalAuthor.id, { onDelete: 'restrict' }),
  authorOrder: integer("author_order").notNull(),
}, (t) => ({
  authorTypeCheck: check(
    "author_type_check",
    sql`(faculty_id IS NOT NULL)::int + (external_author_id IS NOT NULL)::int = 1`
  ),
  uniquePubFaculty: unique("unique_pub_faculty").on(t.publicationId, t.facultyId),
  uniquePubExternalAuthor: unique("unique_pub_external_author").on(t.publicationId, t.externalAuthorId),
  uniquePubOrder: unique("unique_pub_order").on(t.publicationId, t.authorOrder),
}));

export const publicationAuthorRelations = relations(publicationAuthor, ({ one }) => ({
  publication: one(publication, {
    fields: [publicationAuthor.publicationId],
    references: [publication.id],
  }),
  faculty: one(faculty, {
    fields: [publicationAuthor.facultyId],
    references: [faculty.id],
  }),
  externalAuthor: one(externalAuthor, {
    fields: [publicationAuthor.externalAuthorId],
    references: [externalAuthor.id],
  }),
}));

export type PublicationAuthor = InferSelectModel<typeof publicationAuthor>;
export type NewPublicationAuthor = InferInsertModel<typeof publicationAuthor>;
