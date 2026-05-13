import {
  DrizzleTodoRepository,
  applyMigrations,
  createDrizzleClient,
  createInMemoryPglite,
  type DrizzleClient,
  type PgliteClient,
} from "@todo-app/db";
import type { TodoRepository } from "@todo-app/domain";
import type { Provider } from "@nestjs/common";
import { fileURLToPath } from "node:url";
import { DRIZZLE_CLIENT, PGLITE_CLIENT, TODO_REPOSITORY } from "../todos.tokens";

const migrationsFolder = fileURLToPath(
  new URL("../../../../../packages/db/drizzle", import.meta.url),
);

export const todoDatabaseProviders: Provider[] = [
  {
    provide: PGLITE_CLIENT,
    useFactory: () => createInMemoryPglite(),
  },
  {
    provide: DRIZZLE_CLIENT,
    inject: [PGLITE_CLIENT],
    useFactory: (pglite: PgliteClient) => createDrizzleClient(pglite),
  },
  {
    provide: TODO_REPOSITORY,
    inject: [DRIZZLE_CLIENT],
    useFactory: async (db: DrizzleClient): Promise<TodoRepository> => {
      await applyMigrations(db, { migrationsFolder });

      return new DrizzleTodoRepository(db);
    },
  },
];
