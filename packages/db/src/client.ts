import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

export type PgliteClient = PGlite;
export type DrizzleClient = ReturnType<typeof createDrizzleClient>;

export function createInMemoryPglite(): PgliteClient {
  return new PGlite();
}

export function createDrizzleClient(pglite: PgliteClient) {
  return drizzle(pglite, { schema });
}
