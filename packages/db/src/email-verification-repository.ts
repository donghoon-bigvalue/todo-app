import {
  EmailVerification,
  type EmailVerificationId,
  type EmailVerificationPurpose,
  type EmailVerificationRepository,
} from "@todo-app/domain";
import { and, desc, eq } from "drizzle-orm";
import type { DrizzleClient } from "./client";
import { emailVerificationsTable } from "./schema";

type EmailVerificationRow = typeof emailVerificationsTable.$inferSelect;

export class DrizzleEmailVerificationRepository implements EmailVerificationRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findLatestByEmailAndPurpose(
    email: string,
    purpose: EmailVerificationPurpose,
  ): Promise<EmailVerification | null> {
    const rows = await this.db
      .select()
      .from(emailVerificationsTable)
      .where(
        and(eq(emailVerificationsTable.email, email), eq(emailVerificationsTable.purpose, purpose)),
      )
      .orderBy(desc(emailVerificationsTable.createdAt))
      .limit(1);
    const row = rows[0];

    return row ? toEmailVerification(row) : null;
  }

  async create(emailVerification: EmailVerification): Promise<void> {
    await this.db.insert(emailVerificationsTable).values(toInsertValue(emailVerification));
  }

  async update(emailVerification: EmailVerification): Promise<void> {
    const snapshot = emailVerification.toSnapshot();

    await this.db
      .update(emailVerificationsTable)
      .set(toInsertValue(emailVerification))
      .where(eq(emailVerificationsTable.id, snapshot.id));
  }
}

function toEmailVerification(row: EmailVerificationRow): EmailVerification {
  return EmailVerification.restore({
    id: row.id as EmailVerificationId,
    email: row.email,
    code: row.code,
    purpose: row.purpose as EmailVerificationPurpose,
    usedAt: row.usedAt,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
  });
}

function toInsertValue(
  emailVerification: EmailVerification,
): typeof emailVerificationsTable.$inferInsert {
  const snapshot = emailVerification.toSnapshot();

  return {
    id: snapshot.id,
    email: snapshot.email,
    code: snapshot.code,
    purpose: snapshot.purpose,
    usedAt: snapshot.usedAt,
    createdAt: snapshot.createdAt,
    expiresAt: snapshot.expiresAt,
  };
}
