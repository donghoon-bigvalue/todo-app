import type { RefreshToken } from "./refresh-token";
import type { UserId } from "./user";

export interface RefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  create(refreshToken: RefreshToken): Promise<void>;
  update(refreshToken: RefreshToken): Promise<void>;
  revokeAllByUserId(userId: UserId, revokedAt: Date): Promise<void>;
}
