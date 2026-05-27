import jwt from "jsonwebtoken";
import { createUserId } from "@todo-app/domain";
import type {
  AccessTokenIssuer,
  AccessTokenVerifier,
  AuthenticatedUser,
} from "../application/auth-use-cases";

export const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;

export type JwtAccessTokenIssuerOptions = {
  readonly secret: string;
  readonly expiresInSeconds: number;
};

export class JwtAccessTokenIssuer implements AccessTokenIssuer {
  constructor(private readonly options: JwtAccessTokenIssuerOptions) {}

  issue(input: Parameters<AccessTokenIssuer["issue"]>[0]): string {
    return jwt.sign(
      {
        loginId: input.loginId,
        nickname: input.nickname,
        email: input.email,
      },
      this.options.secret,
      {
        subject: input.userId,
        expiresIn: this.options.expiresInSeconds,
      },
    );
  }
}

export class JwtAccessTokenVerifier implements AccessTokenVerifier {
  constructor(private readonly secret: string) {}

  verify(accessToken: string): AuthenticatedUser | null {
    try {
      const payload = jwt.verify(accessToken, this.secret);

      if (typeof payload === "string" || typeof payload.sub !== "string") {
        return null;
      }

      return {
        userId: createUserId(payload.sub),
      };
    } catch {
      return null;
    }
  }
}
