import { randomBytes } from "node:crypto";
import { ACCESS_TOKEN_EXPIRES_IN_SECONDS } from "./jwt-access-token-issuer";

export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

export type AuthConfig = {
  readonly jwtSecret: string;
  readonly accessTokenExpiresInSeconds: number;
  readonly refreshTokenTtlMs: number;
};

export function createAuthConfig(env: NodeJS.ProcessEnv): AuthConfig {
  return {
    jwtSecret: env.AUTH_JWT_SECRET?.trim() || "todo-app-local-dev-secret",
    accessTokenExpiresInSeconds: readPositiveInteger(
      env.AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    ),
    refreshTokenTtlMs:
      readPositiveInteger(env.AUTH_REFRESH_TOKEN_EXPIRES_IN_DAYS, REFRESH_TOKEN_EXPIRES_IN_DAYS) *
      24 *
      60 *
      60 *
      1000,
  };
}

export function generateRefreshTokenValue(): string {
  return randomBytes(32).toString("base64url");
}

function readPositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
