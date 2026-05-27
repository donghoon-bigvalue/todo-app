import {
  RefreshToken,
  type RefreshTokenId,
  type RefreshTokenRepository,
  type UserId,
} from "@todo-app/domain";
import { eq } from "drizzle-orm";
import type { DrizzleClient } from "./client";
import { refreshTokensTable } from "./schema";

type RefreshTokenRow = typeof refreshTokensTable.$inferSelect;

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const rows = await this.db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash))
      .limit(1);
    const row = rows[0];

    return row ? toRefreshToken(row) : null;
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    await this.db.insert(refreshTokensTable).values(toInsertValue(refreshToken));
  }

  async update(refreshToken: RefreshToken): Promise<void> {
    await this.db
      .update(refreshTokensTable)
      .set(toInsertValue(refreshToken))
      .where(eq(refreshTokensTable.id, refreshToken.toSnapshot().id));
  }

  async revokeAllByUserId(userId: UserId, revokedAt: Date): Promise<void> {
    await this.db
      .update(refreshTokensTable)
      .set({ revokedAt })
      .where(eq(refreshTokensTable.userId, userId));
  }
}

function toRefreshToken(row: RefreshTokenRow): RefreshToken {
  return RefreshToken.restore({
    id: row.id as RefreshTokenId,
    userId: row.userId as UserId,
    tokenHash: row.tokenHash,
    revokedAt: row.revokedAt,
    createdAt: row.createdAt,
    expiresAt: row.expiresAt,
  });
}

function toInsertValue(refreshToken: RefreshToken): typeof refreshTokensTable.$inferInsert {
  const snapshot = refreshToken.toSnapshot();

  return {
    id: snapshot.id,
    userId: snapshot.userId,
    tokenHash: snapshot.tokenHash,
    revokedAt: snapshot.revokedAt,
    createdAt: snapshot.createdAt,
    expiresAt: snapshot.expiresAt,
  };
}
