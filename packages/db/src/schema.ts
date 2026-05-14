import { boolean, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
});
