import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";

describe("db client", () => {
  it("in-memory PGlite로 Drizzle SQL을 실행한다", async () => {
    const pglite = createInMemoryPglite();
    const db = createDrizzleClient(pglite);

    const result = await db.execute<{ value: number }>(sql`select 1 as value`);

    expect(result.rows).toEqual([{ value: 1 }]);
    await pglite.close();
  });
});
