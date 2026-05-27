import type { UserId } from "./user";

declare const refreshTokenIdBrand: unique symbol;

export type RefreshTokenId = string & { readonly [refreshTokenIdBrand]: "RefreshTokenId" };

export type RefreshTokenSnapshot = {
  readonly id: RefreshTokenId;
  readonly userId: UserId;
  readonly tokenHash: string;
  readonly revokedAt: Date | null;
  readonly createdAt: Date;
  readonly expiresAt: Date;
};

export type CreateRefreshTokenInput = Omit<RefreshTokenSnapshot, "revokedAt"> & {
  readonly revokedAt?: Date | null;
};

export function createRefreshTokenId(value: string): RefreshTokenId {
  return value as RefreshTokenId;
}

export class RefreshToken {
  readonly #id: RefreshTokenId;
  readonly #userId: UserId;
  readonly #tokenHash: string;
  #revokedAt: Date | null;
  readonly #createdAt: Date;
  readonly #expiresAt: Date;

  private constructor(snapshot: RefreshTokenSnapshot) {
    this.#id = snapshot.id;
    this.#userId = snapshot.userId;
    this.#tokenHash = snapshot.tokenHash;
    this.#revokedAt = snapshot.revokedAt ? new Date(snapshot.revokedAt) : null;
    this.#createdAt = new Date(snapshot.createdAt);
    this.#expiresAt = new Date(snapshot.expiresAt);
  }

  static create(input: CreateRefreshTokenInput): RefreshToken {
    return new RefreshToken({
      ...input,
      revokedAt: input.revokedAt ?? null,
    });
  }

  static restore(snapshot: RefreshTokenSnapshot): RefreshToken {
    return new RefreshToken(snapshot);
  }

  get revokedAt(): Date | null {
    return this.#revokedAt ? new Date(this.#revokedAt) : null;
  }

  revoke(revokedAt: Date): void {
    this.#revokedAt = new Date(revokedAt);
  }

  isExpiredAt(now: Date): boolean {
    return now >= this.#expiresAt;
  }

  isActiveAt(now: Date): boolean {
    return this.#revokedAt === null && !this.isExpiredAt(now);
  }

  toSnapshot(): RefreshTokenSnapshot {
    return {
      id: this.#id,
      userId: this.#userId,
      tokenHash: this.#tokenHash,
      revokedAt: this.#revokedAt ? new Date(this.#revokedAt) : null,
      createdAt: new Date(this.#createdAt),
      expiresAt: new Date(this.#expiresAt),
    };
  }
}
