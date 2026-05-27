import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { applyMigrations } from "./migrate";
import { emailVerificationsTable, refreshTokensTable, todosTable, usersTable } from "./schema";

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
        userId: null,
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      },
    ]);
    await pglite.close();
  });

  it("Auth 저장 구조 migration을 적용하고 사용자 삭제 시 소유 Todo와 refresh token을 함께 삭제한다", async () => {
    const pglite = createInMemoryPglite();
    const db = createDrizzleClient(pglite);

    await applyMigrations(db, { migrationsFolder });
    await db.insert(usersTable).values({
      id: "user-1",
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "password-hash",
      createdAt: new Date("2026-05-27T08:00:00.000Z"),
    });
    await db.insert(todosTable).values({
      id: "todo-1",
      userId: "user-1",
      title: "사용자 소유 Todo",
      completed: false,
      note: null,
      createdAt: new Date("2026-05-27T08:01:00.000Z"),
    });
    await db.insert(refreshTokensTable).values({
      id: "refresh-token-1",
      userId: "user-1",
      tokenHash: "refresh-token-hash",
      revokedAt: null,
      createdAt: new Date("2026-05-27T08:02:00.000Z"),
      expiresAt: new Date("2026-06-26T08:02:00.000Z"),
    });
    await db.insert(emailVerificationsTable).values({
      id: "email-verification-1",
      email: "user@example.com",
      code: "123456",
      purpose: "reset-password",
      usedAt: null,
      createdAt: new Date("2026-05-27T08:03:00.000Z"),
      expiresAt: new Date("2026-05-27T08:13:00.000Z"),
    });

    await db.delete(usersTable).where(eq(usersTable.id, "user-1"));

    await expect(db.select().from(todosTable)).resolves.toEqual([]);
    await expect(db.select().from(refreshTokensTable)).resolves.toEqual([]);
    await expect(db.select().from(emailVerificationsTable)).resolves.toHaveLength(1);
    await pglite.close();
  });
});
