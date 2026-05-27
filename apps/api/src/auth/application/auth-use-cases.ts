import {
  EmailVerification,
  EmailVerificationAlreadyUsedError,
  EmailVerificationExpiredError,
  EmailVerificationInvalidCodeError,
  type EmailVerificationId,
  type EmailVerificationPurpose,
  type EmailVerificationRepository,
  RefreshToken,
  User,
  type RefreshTokenId,
  type RefreshTokenRepository,
  type UserId,
  type UserRepository,
  createEmailVerificationCode,
  passwordSchema,
  signupSchema,
  userEmailSchema,
} from "@todo-app/domain";
import { z } from "zod";
import type { MailSender } from "./mail-sender";

export type PasswordHasher = {
  hash(password: string): Promise<string>;
  verify(password: string, passwordHash: string): Promise<boolean>;
};

export type RefreshTokenHasher = {
  hash(refreshToken: string): string;
};

export type AccessTokenIssuer = {
  issue(input: {
    readonly userId: UserId;
    readonly loginId: string;
    readonly nickname: string;
    readonly email: string;
  }): string;
};

export type AuthUseCaseDependencies = {
  readonly generateUserId: () => UserId;
  readonly generateRefreshTokenId: () => RefreshTokenId;
  readonly generateEmailVerificationId: () => EmailVerificationId;
  readonly generateRefreshTokenValue: () => string;
  readonly generateEmailVerificationDigit: () => number;
  readonly now: () => Date;
  readonly refreshTokenTtlMs: number;
  readonly emailVerificationTtlMs: number;
  readonly passwordHasher: PasswordHasher;
  readonly refreshTokenHasher: RefreshTokenHasher;
  readonly accessTokenIssuer: AccessTokenIssuer;
  readonly mailSender: MailSender;
};

export type LoginResult = {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAt: Date;
};

export class DuplicateLoginIdError extends Error {
  constructor(readonly loginId: string) {
    super(`이미 사용 중인 로그인 ID입니다: ${loginId}`);
    this.name = "DuplicateLoginIdError";
  }
}

export class DuplicateEmailError extends Error {
  constructor(readonly email: string) {
    super(`이미 사용 중인 이메일입니다: ${email}`);
    this.name = "DuplicateEmailError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("로그인 정보가 올바르지 않습니다.");
    this.name = "InvalidCredentialsError";
  }
}

export class MissingRefreshTokenError extends Error {
  constructor() {
    super("refresh token이 필요합니다.");
    this.name = "MissingRefreshTokenError";
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor() {
    super("refresh token이 올바르지 않습니다.");
    this.name = "InvalidRefreshTokenError";
  }
}

export class UserEmailNotFoundError extends Error {
  constructor(readonly email: string) {
    super(`가입된 이메일을 찾을 수 없습니다: ${email}`);
    this.name = "UserEmailNotFoundError";
  }
}

export class EmailVerificationNotFoundError extends Error {
  constructor(
    readonly email: string,
    readonly purpose: EmailVerificationPurpose,
  ) {
    super(`이메일 인증 기록을 찾을 수 없습니다: ${email}, ${purpose}`);
    this.name = "EmailVerificationNotFoundError";
  }
}

const resetPasswordSchema = z
  .object({
    email: userEmailSchema,
    code: z.string(),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((input) => input.password === input.passwordConfirm, {
    message: "비밀번호 확인이 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export class SignupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: unknown): Promise<User> {
    const request = signupSchema.parse(input);

    if (await this.userRepository.findByLoginId(request.loginId)) {
      throw new DuplicateLoginIdError(request.loginId);
    }

    if (await this.userRepository.findByEmail(request.email)) {
      throw new DuplicateEmailError(request.email);
    }

    const user = User.create({
      id: this.dependencies.generateUserId(),
      loginId: request.loginId,
      nickname: request.nickname,
      email: request.email,
      passwordHash: await this.dependencies.passwordHasher.hash(request.password),
      createdAt: this.dependencies.now(),
    });

    await this.userRepository.create(user);

    return user;
  }
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: {
    readonly loginId: string;
    readonly password: string;
  }): Promise<LoginResult> {
    const user = await this.userRepository.findByLoginId(input.loginId);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!(await this.dependencies.passwordHasher.verify(input.password, user.passwordHash))) {
      throw new InvalidCredentialsError();
    }

    return issueLoginResult(user, this.refreshTokenRepository, this.dependencies);
  }
}

export class RefreshAccessTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: {
    readonly refreshToken?: string | null;
  }): Promise<{ readonly accessToken: string }> {
    const refreshToken = input.refreshToken;

    if (!refreshToken) {
      throw new MissingRefreshTokenError();
    }

    const token = await this.refreshTokenRepository.findByTokenHash(
      this.dependencies.refreshTokenHasher.hash(refreshToken),
    );

    if (!token?.isActiveAt(this.dependencies.now())) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findById(token.toSnapshot().userId);

    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    return {
      accessToken: issueAccessToken(user, this.dependencies),
    };
  }
}

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: { readonly refreshToken?: string | null }): Promise<void> {
    const refreshToken = input.refreshToken;

    if (!refreshToken) {
      throw new MissingRefreshTokenError();
    }

    const token = await this.refreshTokenRepository.findByTokenHash(
      this.dependencies.refreshTokenHasher.hash(refreshToken),
    );

    if (token?.isActiveAt(this.dependencies.now())) {
      token.revoke(this.dependencies.now());
      await this.refreshTokenRepository.update(token);
    }
  }
}

export class RequestFindLoginIdCodeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: { readonly email: string }): Promise<void> {
    await requestEmailVerificationCode(
      "find-login-id",
      input,
      this.userRepository,
      this.emailVerificationRepository,
      this.dependencies,
    );
  }
}

export class VerifyFindLoginIdCodeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: { readonly email: string; readonly code: string }): Promise<{
    readonly loginId: string;
  }> {
    const email = userEmailSchema.parse(input.email);
    const user = await findUserByEmailOrThrow(this.userRepository, email);
    const verification = await findLatestVerificationOrThrow(
      this.emailVerificationRepository,
      email,
      "find-login-id",
    );

    verification.use({
      code: input.code,
      usedAt: this.dependencies.now(),
    });
    await this.emailVerificationRepository.update(verification);

    return {
      loginId: user.loginId,
    };
  }
}

export class RequestPasswordResetCodeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: { readonly email: string }): Promise<void> {
    await requestEmailVerificationCode(
      "reset-password",
      input,
      this.userRepository,
      this.emailVerificationRepository,
      this.dependencies,
    );
  }
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly dependencies: AuthUseCaseDependencies,
  ) {}

  async execute(input: unknown): Promise<void> {
    const request = resetPasswordSchema.parse(input);
    const user = await findUserByEmailOrThrow(this.userRepository, request.email);
    const verification = await findLatestVerificationOrThrow(
      this.emailVerificationRepository,
      request.email,
      "reset-password",
    );

    verification.use({
      code: request.code,
      usedAt: this.dependencies.now(),
    });
    user.changePasswordHash(await this.dependencies.passwordHasher.hash(request.password));

    await this.emailVerificationRepository.update(verification);
    await this.userRepository.updatePasswordHash(user);
    await this.refreshTokenRepository.revokeAllByUserId(user.id, this.dependencies.now());
  }
}

async function issueLoginResult(
  user: User,
  refreshTokenRepository: RefreshTokenRepository,
  dependencies: AuthUseCaseDependencies,
): Promise<LoginResult> {
  const now = dependencies.now();
  const refreshToken = dependencies.generateRefreshTokenValue();
  const refreshTokenExpiresAt = new Date(now.getTime() + dependencies.refreshTokenTtlMs);

  await refreshTokenRepository.create(
    RefreshToken.create({
      id: dependencies.generateRefreshTokenId(),
      userId: user.id,
      tokenHash: dependencies.refreshTokenHasher.hash(refreshToken),
      createdAt: now,
      expiresAt: refreshTokenExpiresAt,
    }),
  );

  return {
    user,
    accessToken: issueAccessToken(user, dependencies),
    refreshToken,
    refreshTokenExpiresAt,
  };
}

function issueAccessToken(user: User, dependencies: AuthUseCaseDependencies): string {
  return dependencies.accessTokenIssuer.issue({
    userId: user.id,
    loginId: user.loginId,
    nickname: user.nickname,
    email: user.email,
  });
}

async function requestEmailVerificationCode(
  purpose: EmailVerificationPurpose,
  input: { readonly email: string },
  userRepository: UserRepository,
  emailVerificationRepository: EmailVerificationRepository,
  dependencies: AuthUseCaseDependencies,
): Promise<void> {
  const email = userEmailSchema.parse(input.email);
  await findUserByEmailOrThrow(userRepository, email);

  const now = dependencies.now();
  const code = createEmailVerificationCode(dependencies.generateEmailVerificationDigit);

  await emailVerificationRepository.create(
    EmailVerification.create({
      id: dependencies.generateEmailVerificationId(),
      email,
      code,
      purpose,
      createdAt: now,
      expiresAt: new Date(now.getTime() + dependencies.emailVerificationTtlMs),
    }),
  );
  await dependencies.mailSender.sendEmailVerificationCode({
    to: email,
    code,
    purpose,
  });
}

async function findUserByEmailOrThrow(
  userRepository: UserRepository,
  email: string,
): Promise<User> {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new UserEmailNotFoundError(email);
  }

  return user;
}

async function findLatestVerificationOrThrow(
  emailVerificationRepository: EmailVerificationRepository,
  email: string,
  purpose: EmailVerificationPurpose,
): Promise<EmailVerification> {
  const verification = await emailVerificationRepository.findLatestByEmailAndPurpose(
    email,
    purpose,
  );

  if (!verification) {
    throw new EmailVerificationNotFoundError(email, purpose);
  }

  return verification;
}

export {
  EmailVerificationAlreadyUsedError,
  EmailVerificationExpiredError,
  EmailVerificationInvalidCodeError,
};
