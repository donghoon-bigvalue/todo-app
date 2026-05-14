import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { applyMigrations } from "./migrate";
import { todosTable } from "./schema";

const migrationsFolder = "packages/db/drizzle";

describe("db migrations", () => {
  it("Todo table migration을 적용한다", async () => {
    const pglite = createInMemoryPglite();
    const db = createDrizzleClient(pglite);

    await applyMigrations(db, { migrationsFolder });
    await db.insert(todosTable).values({
      id: "todo-1",
      title: "첫 번째 할 일",
      completed: false,
      note: null,
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    const todos = await db.select().from(todosTable).where(eq(todosTable.id, "todo-1"));

    expect(todos).toEqual([
      {
        id: "todo-1",
        title: "첫 번째 할 일",
        completed: false,
        note: null,
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      },
    ]);
    await pglite.close();
  });
});
