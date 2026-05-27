import { RefreshToken, createRefreshTokenId, createUserId } from "@todo-app/domain";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { applyMigrations } from "./migrate";
import { DrizzleRefreshTokenRepository } from "./refresh-token-repository";
import { usersTable } from "./schema";

const migrationsFolder = "packages/db/drizzle";

async function createRepository() {
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

  return {
    pglite,
    repository: new DrizzleRefreshTokenRepository(db),
  };
}

describe("DrizzleRefreshTokenRepository", () => {
  it("refresh token을 저장하고 token hash로 조회한다", async () => {
    const { pglite, repository } = await createRepository();
    const token = createToken("refresh-token-1", "refresh-token-hash");

    await repository.create(token);

    await expect(repository.findByTokenHash("refresh-token-hash")).resolves.toEqual(token);
    await pglite.close();
  });

  it("refresh token을 무효화한다", async () => {
    const { pglite, repository } = await createRepository();
    const token = createToken("refresh-token-1", "refresh-token-hash");
    await repository.create(token);

    token.revoke(new Date("2026-05-27T09:00:00.000Z"));
    await repository.update(token);

    await expect(repository.findByTokenHash("refresh-token-hash")).resolves.toMatchObject({
      revokedAt: new Date("2026-05-27T09:00:00.000Z"),
    });
    await pglite.close();
  });

  it("사용자의 모든 refresh token을 무효화한다", async () => {
    const { pglite, repository } = await createRepository();
    await repository.create(createToken("refresh-token-1", "refresh-token-hash-1"));
    await repository.create(createToken("refresh-token-2", "refresh-token-hash-2"));

    await repository.revokeAllByUserId(
      createUserId("user-1"),
      new Date("2026-05-27T09:00:00.000Z"),
    );

    await expect(repository.findByTokenHash("refresh-token-hash-1")).resolves.toMatchObject({
      revokedAt: new Date("2026-05-27T09:00:00.000Z"),
    });
    await expect(repository.findByTokenHash("refresh-token-hash-2")).resolves.toMatchObject({
      revokedAt: new Date("2026-05-27T09:00:00.000Z"),
    });
    await pglite.close();
  });
});

function createToken(id: string, tokenHash: string): RefreshToken {
  return RefreshToken.create({
    id: createRefreshTokenId(id),
    userId: createUserId("user-1"),
    tokenHash,
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
    expiresAt: new Date("2026-06-26T08:00:00.000Z"),
  });
}
