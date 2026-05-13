import { Todo, type TodoId, type TodoRepository } from "@todo-app/domain";
import { asc, eq } from "drizzle-orm";
import type { DrizzleClient } from "./client";
import { todosTable } from "./schema";

type TodoRow = typeof todosTable.$inferSelect;

export class DrizzleTodoRepository implements TodoRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findMany(): Promise<Todo[]> {
    const rows = await this.db.select().from(todosTable).orderBy(asc(todosTable.createdAt));

    return rows.map(toTodo);
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const rows = await this.db.select().from(todosTable).where(eq(todosTable.id, id)).limit(1);
    const row = rows[0];

    return row ? toTodo(row) : null;
  }

  async create(todo: Todo): Promise<void> {
    await this.db.insert(todosTable).values(toInsertValue(todo));
  }

  async update(todo: Todo): Promise<void> {
    await this.db.update(todosTable).set(toInsertValue(todo)).where(eq(todosTable.id, todo.id));
  }

  async delete(id: TodoId): Promise<void> {
    await this.db.delete(todosTable).where(eq(todosTable.id, id));
  }
}

function toTodo(row: TodoRow): Todo {
  return Todo.restore({
    id: row.id as TodoId,
    title: row.title,
    completed: row.completed,
    createdAt: row.createdAt,
  });
}

function toInsertValue(todo: Todo): typeof todosTable.$inferInsert {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt,
  };
}
