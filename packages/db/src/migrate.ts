import { migrate } from "drizzle-orm/pglite/migrator";
import type { DrizzleClient } from "./client";

export type ApplyMigrationsOptions = {
  readonly migrationsFolder: string;
};

export async function applyMigrations(
  db: DrizzleClient,
  options: ApplyMigrationsOptions,
): Promise<void> {
  await migrate(db, {
    migrationsFolder: options.migrationsFolder,
  });
}
