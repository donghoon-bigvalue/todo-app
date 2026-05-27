import { User, type UserId, type UserRepository } from "@todo-app/domain";
import { eq } from "drizzle-orm";
import type { DrizzleClient } from "./client";
import { emailVerificationsTable, usersTable } from "./schema";

type UserRow = typeof usersTable.$inferSelect;

export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly db: DrizzleClient) {}

  async findById(id: UserId): Promise<User | null> {
    const rows = await this.db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    const row = rows[0];

    return row ? toUser(row) : null;
  }

  async findByLoginId(loginId: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.loginId, loginId))
      .limit(1);
    const row = rows[0];

    return row ? toUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    const row = rows[0];

    return row ? toUser(row) : null;
  }

  async create(user: User): Promise<void> {
    await this.db.insert(usersTable).values(toInsertValue(user));
  }

  async updatePasswordHash(user: User): Promise<void> {
    await this.db
      .update(usersTable)
      .set({ passwordHash: user.passwordHash })
      .where(eq(usersTable.id, user.id));
  }

  async delete(id: UserId): Promise<void> {
    const user = await this.findById(id);

    if (user) {
      await this.db
        .delete(emailVerificationsTable)
        .where(eq(emailVerificationsTable.email, user.email));
    }

    await this.db.delete(usersTable).where(eq(usersTable.id, id));
  }
}

function toUser(row: UserRow): User {
  return User.restore({
    id: row.id as UserId,
    loginId: row.loginId,
    nickname: row.nickname,
    email: row.email,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
  });
}

function toInsertValue(user: User): typeof usersTable.$inferInsert {
  return {
    id: user.id,
    loginId: user.loginId,
    nickname: user.nickname,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
  };
}
