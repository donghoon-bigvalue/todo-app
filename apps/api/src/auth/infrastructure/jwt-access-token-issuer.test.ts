import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { createUserId } from "@todo-app/domain";
import { JwtAccessTokenIssuer } from "./jwt-access-token-issuer";

describe("JwtAccessTokenIssuer", () => {
  it("사용자 정보를 담은 JWT access token을 발급한다", () => {
    const issuer = new JwtAccessTokenIssuer({
      secret: "test-secret",
      expiresInSeconds: 900,
    });

    const token = issuer.issue({
      userId: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
    });

    expect(jwt.verify(token, "test-secret")).toMatchObject({
      sub: "user-1",
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
    });
  });
});
