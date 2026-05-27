import { Todo, User, createTodoId, createUserId } from "@todo-app/domain";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { applyMigrations } from "./migrate";
import { emailVerificationsTable, refreshTokensTable, todosTable } from "./schema";
import { DrizzleTodoRepository } from "./todo-repository";
import { DrizzleUserRepository } from "./user-repository";

const migrationsFolder = "packages/db/drizzle";

async function createRepositories() {
  const pglite = createInMemoryPglite();
  const db = createDrizzleClient(pglite);

  await applyMigrations(db, { migrationsFolder });

  return {
    db,
    pglite,
    todoRepository: new DrizzleTodoRepository(db),
    userRepository: new DrizzleUserRepository(db),
  };
}

describe("DrizzleUserRepository", () => {
  it("사용자를 생성하고 id, loginId, email로 조회한다", async () => {
    const { pglite, userRepository } = await createRepositories();
    const user = createUser();

    await userRepository.create(user);

    await expect(userRepository.findById(createUserId("user-1"))).resolves.toEqual(user);
    await expect(userRepository.findByLoginId("todo_user")).resolves.toEqual(user);
    await expect(userRepository.findByEmail("user@example.com")).resolves.toEqual(user);
    await pglite.close();
  });

  it("사용자 비밀번호 hash를 변경한다", async () => {
    const { pglite, userRepository } = await createRepositories();
    const user = createUser();
    await userRepository.create(user);

    user.changePasswordHash("new-password-hash");
    await userRepository.updatePasswordHash(user);

    await expect(userRepository.findById(createUserId("user-1"))).resolves.toMatchObject({
      passwordHash: "new-password-hash",
    });
    await pglite.close();
  });

  it("사용자를 삭제하면 소유 Todo, refresh token, 이메일 인증 기록을 함께 삭제한다", async () => {
    const { db, pglite, todoRepository, userRepository } = await createRepositories();
    const user = createUser();
    await userRepository.create(user);
    await todoRepository.createForUser(
      Todo.restore({
        id: createTodoId("todo-1"),
        title: "삭제될 Todo",
        completed: false,
        note: null,
        createdAt: new Date("2026-05-27T08:01:00.000Z"),
      }),
      createUserId("user-1"),
    );
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

    await userRepository.delete(createUserId("user-1"));

    await expect(userRepository.findById(createUserId("user-1"))).resolves.toBeNull();
    await expect(db.select().from(todosTable)).resolves.toEqual([]);
    await expect(db.select().from(refreshTokensTable)).resolves.toEqual([]);
    await expect(db.select().from(emailVerificationsTable)).resolves.toEqual([]);
    await pglite.close();
  });
});

function createUser(): User {
  return User.create({
    id: createUserId("user-1"),
    loginId: "todo_user",
    nickname: "도훈",
    email: "user@example.com",
    passwordHash: "password-hash",
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
  });
}
