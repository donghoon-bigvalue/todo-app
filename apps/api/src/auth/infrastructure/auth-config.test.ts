import { describe, expect, it } from "vitest";
import { ACCESS_TOKEN_EXPIRES_IN_SECONDS } from "./jwt-access-token-issuer";
import {
  EMAIL_VERIFICATION_EXPIRES_IN_MINUTES,
  REFRESH_TOKEN_EXPIRES_IN_DAYS,
  createAuthConfig,
} from "./auth-config";

describe("createAuthConfig", () => {
  it("Auth 환경변수를 config로 변환한다", () => {
    expect(
      createAuthConfig({
        AUTH_JWT_SECRET: "test-secret",
        AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS: "600",
        AUTH_REFRESH_TOKEN_EXPIRES_IN_DAYS: "14",
        AUTH_EMAIL_VERIFICATION_EXPIRES_IN_MINUTES: "5",
      }),
    ).toEqual({
      jwtSecret: "test-secret",
      accessTokenExpiresInSeconds: 600,
      refreshTokenTtlMs: 14 * 24 * 60 * 60 * 1000,
      emailVerificationTtlMs: 5 * 60 * 1000,
    });
  });

  it("환경변수가 없으면 로컬 기본값을 사용한다", () => {
    expect(createAuthConfig({})).toEqual({
      jwtSecret: "todo-app-local-dev-secret",
      accessTokenExpiresInSeconds: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      refreshTokenTtlMs: REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
      emailVerificationTtlMs: EMAIL_VERIFICATION_EXPIRES_IN_MINUTES * 60 * 1000,
    });
  });
});
