import { describe, expect, it } from "vitest";
import { Sha256RefreshTokenHasher } from "./refresh-token-hasher";

describe("Sha256RefreshTokenHasher", () => {
  it("refresh token 원문을 deterministic hash로 변환한다", () => {
    const hasher = new Sha256RefreshTokenHasher();

    expect(hasher.hash("refresh-token-value")).toBe(hasher.hash("refresh-token-value"));
    expect(hasher.hash("refresh-token-value")).not.toBe("refresh-token-value");
  });
});
