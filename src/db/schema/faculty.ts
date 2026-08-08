import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { department } from "./department";
import { publicationAuthor } from "./publicationAuthor";

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull().references(() => department.id, { onDelete: 'restrict' }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const facultyRelations = relations(faculty, ({ one, many }) => ({
  department: one(department, {
    fields: [faculty.departmentId],
    references: [department.id],
  }),
  publicationAuthors: many(publicationAuthor),
}));

export type Faculty = InferSelectModel<typeof faculty>;
export type NewFaculty = InferInsertModel<typeof faculty>;
