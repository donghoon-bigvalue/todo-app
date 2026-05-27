import {
  DrizzleRefreshTokenRepository,
  DrizzleUserRepository,
  applyMigrations,
  createDrizzleClient,
  createInMemoryPglite,
  type DrizzleClient,
  type PgliteClient,
} from "@todo-app/db";
import type { RefreshTokenRepository, UserRepository } from "@todo-app/domain";
import type { Provider } from "@nestjs/common";
import { fileURLToPath } from "node:url";
import {
  AUTH_DRIZZLE_CLIENT,
  AUTH_PGLITE_CLIENT,
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from "../auth.tokens";

const migrationsFolder = fileURLToPath(
  new URL("../../../../../packages/db/drizzle", import.meta.url),
);

export const authDatabaseProviders: Provider[] = [
  {
    provide: AUTH_PGLITE_CLIENT,
    useFactory: () => createInMemoryPglite(),
  },
  {
    provide: AUTH_DRIZZLE_CLIENT,
    inject: [AUTH_PGLITE_CLIENT],
    useFactory: (pglite: PgliteClient) => createDrizzleClient(pglite),
  },
  {
    provide: USER_REPOSITORY,
    inject: [AUTH_DRIZZLE_CLIENT],
    useFactory: async (db: DrizzleClient): Promise<UserRepository> => {
      await applyMigrations(db, { migrationsFolder });

      return new DrizzleUserRepository(db);
    },
  },
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    inject: [AUTH_DRIZZLE_CLIENT],
    useFactory: (db: DrizzleClient): RefreshTokenRepository =>
      new DrizzleRefreshTokenRepository(db),
  },
];
