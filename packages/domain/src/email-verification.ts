declare const emailVerificationIdBrand: unique symbol;

export type EmailVerificationId = string & {
  readonly [emailVerificationIdBrand]: "EmailVerificationId";
};

export type EmailVerificationPurpose = "find-login-id" | "reset-password";

export type EmailVerificationSnapshot = {
  readonly id: EmailVerificationId;
  readonly email: string;
  readonly code: string;
  readonly purpose: EmailVerificationPurpose;
  readonly usedAt: Date | null;
  readonly createdAt: Date;
  readonly expiresAt: Date;
};

export type CreateEmailVerificationInput = Omit<EmailVerificationSnapshot, "usedAt"> & {
  readonly usedAt?: Date | null;
};

export type UseEmailVerificationInput = {
  readonly code: string;
  readonly usedAt: Date;
};

export class EmailVerificationInvalidCodeError extends Error {
  constructor() {
    super("이메일 인증 코드가 일치하지 않습니다.");
    this.name = "EmailVerificationInvalidCodeError";
  }
}

export class EmailVerificationExpiredError extends Error {
  constructor() {
    super("이메일 인증 코드가 만료되었습니다.");
    this.name = "EmailVerificationExpiredError";
  }
}

export class EmailVerificationAlreadyUsedError extends Error {
  constructor() {
    super("이미 사용한 이메일 인증 코드입니다.");
    this.name = "EmailVerificationAlreadyUsedError";
  }
}

export function createEmailVerificationId(value: string): EmailVerificationId {
  return value as EmailVerificationId;
}

export function createEmailVerificationCode(generateDigit: () => number): string {
  return Array.from({ length: 6 }, () => {
    const digit = Math.trunc(generateDigit());

    return Math.min(Math.max(digit, 0), 9).toString();
  }).join("");
}

export class EmailVerification {
  readonly #id: EmailVerificationId;
  readonly #email: string;
  readonly #code: string;
  readonly #purpose: EmailVerificationPurpose;
  #usedAt: Date | null;
  readonly #createdAt: Date;
  readonly #expiresAt: Date;

  private constructor(snapshot: EmailVerificationSnapshot) {
    this.#id = snapshot.id;
    this.#email = snapshot.email;
    this.#code = snapshot.code;
    this.#purpose = snapshot.purpose;
    this.#usedAt = snapshot.usedAt ? new Date(snapshot.usedAt) : null;
    this.#createdAt = new Date(snapshot.createdAt);
    this.#expiresAt = new Date(snapshot.expiresAt);
  }

  static create(input: CreateEmailVerificationInput): EmailVerification {
    return new EmailVerification({
      ...input,
      usedAt: input.usedAt ?? null,
    });
  }

  static restore(snapshot: EmailVerificationSnapshot): EmailVerification {
    return new EmailVerification(snapshot);
  }

  get usedAt(): Date | null {
    return this.#usedAt ? new Date(this.#usedAt) : null;
  }

  isUsed(): boolean {
    return this.#usedAt !== null;
  }

  isExpiredAt(now: Date): boolean {
    return now >= this.#expiresAt;
  }

  use(input: UseEmailVerificationInput): void {
    if (this.isUsed()) {
      throw new EmailVerificationAlreadyUsedError();
    }

    if (this.isExpiredAt(input.usedAt)) {
      throw new EmailVerificationExpiredError();
    }

    if (input.code !== this.#code) {
      throw new EmailVerificationInvalidCodeError();
    }

    this.#usedAt = new Date(input.usedAt);
  }

  toSnapshot(): EmailVerificationSnapshot {
    return {
      id: this.#id,
      email: this.#email,
      code: this.#code,
      purpose: this.#purpose,
      usedAt: this.#usedAt ? new Date(this.#usedAt) : null,
      createdAt: new Date(this.#createdAt),
      expiresAt: new Date(this.#expiresAt),
    };
  }
}
