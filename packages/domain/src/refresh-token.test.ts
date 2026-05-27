import { describe, expect, it } from "vitest";
import { createUserId } from "./user";
import { RefreshToken, type RefreshTokenSnapshot, createRefreshTokenId } from "./refresh-token";

describe("RefreshToken", () => {
  it("refresh token snapshot을 생성한다", () => {
    const createdAt = new Date("2026-05-27T08:00:00.000Z");
    const expiresAt = new Date("2026-06-26T08:00:00.000Z");
    const token = RefreshToken.create({
      id: createRefreshTokenId("refresh-token-1"),
      userId: createUserId("user-1"),
      tokenHash: "refresh-token-hash",
      createdAt,
      expiresAt,
    });

    expect(token.toSnapshot()).toEqual<RefreshTokenSnapshot>({
      id: createRefreshTokenId("refresh-token-1"),
      userId: createUserId("user-1"),
      tokenHash: "refresh-token-hash",
      revokedAt: null,
      createdAt,
      expiresAt,
    });
  });

  it("만료되지 않고 폐기되지 않은 token만 active로 본다", () => {
    const token = createToken();

    expect(token.isExpiredAt(new Date("2026-05-28T07:59:59.000Z"))).toBe(false);
    expect(token.isActiveAt(new Date("2026-05-28T07:59:59.000Z"))).toBe(true);
    expect(token.isExpiredAt(new Date("2026-05-28T08:00:00.000Z"))).toBe(true);
    expect(token.isActiveAt(new Date("2026-05-28T08:00:00.000Z"))).toBe(false);
  });

  it("refresh token을 폐기한다", () => {
    const token = createToken();
    const revokedAt = new Date("2026-05-27T09:00:00.000Z");

    token.revoke(revokedAt);

    expect(token.revokedAt).toEqual(revokedAt);
    expect(token.isActiveAt(new Date("2026-05-27T09:00:01.000Z"))).toBe(false);
  });
});

function createToken(): RefreshToken {
  return RefreshToken.create({
    id: createRefreshTokenId("refresh-token-1"),
    userId: createUserId("user-1"),
    tokenHash: "refresh-token-hash",
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
    expiresAt: new Date("2026-05-28T08:00:00.000Z"),
  });
}
