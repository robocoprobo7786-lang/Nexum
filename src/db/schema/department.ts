import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export type Department = InferSelectModel<typeof department>;
export type NewDepartment = InferInsertModel<typeof department>;
