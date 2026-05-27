import jwt from "jsonwebtoken";
import type { AccessTokenIssuer } from "../application/auth-use-cases";

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
