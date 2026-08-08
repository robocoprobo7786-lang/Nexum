import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel, relations } from "drizzle-orm";
import { faculty } from "./faculty";

export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const departmentRelations = relations(department, ({ many }) => ({
  faculty: many(faculty),
}));

export type Department = InferSelectModel<typeof department>;
export type NewDepartment = InferInsertModel<typeof department>;
