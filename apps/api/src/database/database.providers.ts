import {
  DrizzleEmailVerificationRepository,
  DrizzleRefreshTokenRepository,
  DrizzleTodoRepository,
  DrizzleUserRepository,
  applyMigrations,
  createDrizzleClient,
  createInMemoryPglite,
  type DrizzleClient,
  type PgliteClient,
} from "@todo-app/db";
import type {
  EmailVerificationRepository,
  RefreshTokenRepository,
  TodoRepository,
  UserRepository,
  UserScopedTodoRepository,
} from "@todo-app/domain";
import type { Provider } from "@nestjs/common";
import { fileURLToPath } from "node:url";
import {
  AUTH_DRIZZLE_CLIENT,
  AUTH_PGLITE_CLIENT,
  EMAIL_VERIFICATION_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from "../auth/auth.tokens";
import { DRIZZLE_CLIENT, PGLITE_CLIENT, TODO_REPOSITORY } from "../todos/todos.tokens";
import { DATABASE_READY } from "./database.tokens";

const migrationsFolder = fileURLToPath(new URL("../../../../packages/db/drizzle", import.meta.url));

type TodoRepositoryContract = TodoRepository & UserScopedTodoRepository;

export const databaseProviders: Provider[] = [
  {
    provide: PGLITE_CLIENT,
    useFactory: () => createInMemoryPglite(),
  },
  {
    provide: AUTH_PGLITE_CLIENT,
    useExisting: PGLITE_CLIENT,
  },
  {
    provide: DRIZZLE_CLIENT,
    inject: [PGLITE_CLIENT],
    useFactory: (pglite: PgliteClient) => createDrizzleClient(pglite),
  },
  {
    provide: AUTH_DRIZZLE_CLIENT,
    useExisting: DRIZZLE_CLIENT,
  },
  {
    provide: DATABASE_READY,
    inject: [DRIZZLE_CLIENT],
    useFactory: async (db: DrizzleClient): Promise<true> => {
      await applyMigrations(db, { migrationsFolder });

      return true;
    },
  },
  {
    provide: TODO_REPOSITORY,
    inject: [DRIZZLE_CLIENT, DATABASE_READY],
    useFactory: (db: DrizzleClient): TodoRepositoryContract => new DrizzleTodoRepository(db),
  },
  {
    provide: USER_REPOSITORY,
    inject: [DRIZZLE_CLIENT, DATABASE_READY],
    useFactory: (db: DrizzleClient): UserRepository => new DrizzleUserRepository(db),
  },
  {
    provide: REFRESH_TOKEN_REPOSITORY,
    inject: [DRIZZLE_CLIENT, DATABASE_READY],
    useFactory: (db: DrizzleClient): RefreshTokenRepository =>
      new DrizzleRefreshTokenRepository(db),
  },
  {
    provide: EMAIL_VERIFICATION_REPOSITORY,
    inject: [DRIZZLE_CLIENT, DATABASE_READY],
    useFactory: (db: DrizzleClient): EmailVerificationRepository =>
      new DrizzleEmailVerificationRepository(db),
  },
];
