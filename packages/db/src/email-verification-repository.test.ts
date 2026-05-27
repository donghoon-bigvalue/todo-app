import {
  EmailVerification,
  createEmailVerificationId,
  type EmailVerificationPurpose,
} from "@todo-app/domain";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { DrizzleEmailVerificationRepository } from "./email-verification-repository";
import { applyMigrations } from "./migrate";

const migrationsFolder = "packages/db/drizzle";

async function createRepository() {
  const pglite = createInMemoryPglite();
  const db = createDrizzleClient(pglite);

  await applyMigrations(db, { migrationsFolder });

  return {
    pglite,
    repository: new DrizzleEmailVerificationRepository(db),
  };
}

describe("DrizzleEmailVerificationRepository", () => {
  it("이메일 인증 기록을 저장하고 목적별 최신 기록을 조회한다", async () => {
    const { pglite, repository } = await createRepository();
    const olderVerification = createVerification({
      id: "email-verification-1",
      code: "111111",
      createdAt: new Date("2026-05-27T08:00:00.000Z"),
    });
    const latestVerification = createVerification({
      id: "email-verification-2",
      code: "222222",
      createdAt: new Date("2026-05-27T08:05:00.000Z"),
    });

    await repository.create(olderVerification);
    await repository.create(latestVerification);

    await expect(
      repository.findLatestByEmailAndPurpose("user@example.com", "reset-password"),
    ).resolves.toEqual(latestVerification);
    await pglite.close();
  });

  it("이메일 인증 사용 처리를 저장한다", async () => {
    const { pglite, repository } = await createRepository();
    const verification = createVerification({
      id: "email-verification-1",
      code: "123456",
      createdAt: new Date("2026-05-27T08:00:00.000Z"),
    });
    await repository.create(verification);

    verification.use({ code: "123456", usedAt: new Date("2026-05-27T08:05:00.000Z") });
    await repository.update(verification);

    await expect(
      repository.findLatestByEmailAndPurpose("user@example.com", "reset-password"),
    ).resolves.toMatchObject({
      usedAt: new Date("2026-05-27T08:05:00.000Z"),
    });
    await pglite.close();
  });
});

function createVerification(input: {
  readonly id: string;
  readonly code: string;
  readonly createdAt: Date;
  readonly purpose?: EmailVerificationPurpose;
}): EmailVerification {
  return EmailVerification.create({
    id: createEmailVerificationId(input.id),
    email: "user@example.com",
    code: input.code,
    purpose: input.purpose ?? "reset-password",
    usedAt: null,
    createdAt: input.createdAt,
    expiresAt: new Date(input.createdAt.getTime() + 10 * 60 * 1000),
  });
}
