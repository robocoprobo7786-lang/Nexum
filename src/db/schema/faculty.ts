import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { department } from "./department";

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  departmentId: integer("department_id").notNull().references(() => department.id, { onDelete: 'restrict' }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export type Faculty = InferSelectModel<typeof faculty>;
export type NewFaculty = InferInsertModel<typeof faculty>;
