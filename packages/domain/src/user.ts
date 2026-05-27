declare const userIdBrand: unique symbol;

export type UserId = string & { readonly [userIdBrand]: "UserId" };

export type UserSnapshot = {
  readonly id: UserId;
  readonly loginId: string;
  readonly nickname: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
};

export type CreateUserInput = UserSnapshot;

export function createUserId(value: string): UserId {
  return value as UserId;
}

export class User {
  readonly #id: UserId;
  readonly #loginId: string;
  readonly #nickname: string;
  readonly #email: string;
  #passwordHash: string;
  readonly #createdAt: Date;

  private constructor(snapshot: UserSnapshot) {
    this.#id = snapshot.id;
    this.#loginId = snapshot.loginId;
    this.#nickname = snapshot.nickname;
    this.#email = snapshot.email;
    this.#passwordHash = snapshot.passwordHash;
    this.#createdAt = new Date(snapshot.createdAt);
  }

  static create(input: CreateUserInput): User {
    return new User(input);
  }

  static restore(snapshot: UserSnapshot): User {
    return new User(snapshot);
  }

  get id(): UserId {
    return this.#id;
  }

  get loginId(): string {
    return this.#loginId;
  }

  get nickname(): string {
    return this.#nickname;
  }

  get email(): string {
    return this.#email;
  }

  get passwordHash(): string {
    return this.#passwordHash;
  }

  get createdAt(): Date {
    return new Date(this.#createdAt);
  }

  changePasswordHash(passwordHash: string): void {
    this.#passwordHash = passwordHash;
  }

  toSnapshot(): UserSnapshot {
    return {
      id: this.#id,
      loginId: this.#loginId,
      nickname: this.#nickname,
      email: this.#email,
      passwordHash: this.#passwordHash,
      createdAt: new Date(this.#createdAt),
    };
  }
}
