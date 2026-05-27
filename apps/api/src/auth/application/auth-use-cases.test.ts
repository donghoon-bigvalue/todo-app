import {
  RefreshToken,
  User,
  type EmailVerification,
  type EmailVerificationPurpose,
  type EmailVerificationRepository,
  type RefreshTokenRepository,
  type UserId,
  type UserRepository,
  createEmailVerificationId,
  createRefreshTokenId,
  createUserId,
} from "@todo-app/domain";
import { describe, expect, it } from "vitest";
import {
  DuplicateEmailError,
  DuplicateLoginIdError,
  InvalidCredentialsError,
  LoginUseCase,
  LogoutUseCase,
  RefreshAccessTokenUseCase,
  RequestFindLoginIdCodeUseCase,
  RequestPasswordResetCodeUseCase,
  ResetPasswordUseCase,
  SignupUseCase,
  UserEmailNotFoundError,
  VerifyFindLoginIdCodeUseCase,
  type AuthUseCaseDependencies,
  type PasswordHasher,
  type RefreshTokenHasher,
  type AccessTokenIssuer,
} from "./auth-use-cases";
import type { MailSender } from "./mail-sender";

describe("Auth use cases", () => {
  it("회원가입 시 사용자 정보를 검증하고 비밀번호 hash를 저장한다", async () => {
    const userRepository = new FakeUserRepository();
    const refreshTokenRepository = new FakeRefreshTokenRepository();
    const dependencies = createDependencies();
    const useCase = new SignupUseCase(userRepository, dependencies);

    const user = await useCase.execute({
      loginId: " todo_user ",
      nickname: " 도훈 ",
      email: " USER@example.COM ",
      password: "password1",
      passwordConfirm: "password1",
    });

    expect(user.toSnapshot()).toMatchObject({
      id: createUserId("user-1"),
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      passwordHash: "hashed:password1",
    });
    await expect(userRepository.findByLoginId("todo_user")).resolves.toEqual(user);
    expect(refreshTokenRepository.tokens).toEqual([]);
  });

  it("중복 loginId 또는 email로 회원가입할 수 없다", async () => {
    const userRepository = new FakeUserRepository([
      User.create({
        id: createUserId("user-1"),
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
        passwordHash: "hashed:password1",
        createdAt: new Date("2026-05-27T08:00:00.000Z"),
      }),
    ]);
    const useCase = new SignupUseCase(userRepository, createDependencies());

    await expect(
      useCase.execute({
        loginId: "todo_user",
        nickname: "새 사용자",
        email: "new@example.com",
        password: "password1",
        passwordConfirm: "password1",
      }),
    ).rejects.toThrow(DuplicateLoginIdError);

    await expect(
      useCase.execute({
        loginId: "new_user",
        nickname: "새 사용자",
        email: "user@example.com",
        password: "password1",
        passwordConfirm: "password1",
      }),
    ).rejects.toThrow(DuplicateEmailError);
  });

  it("로그인하면 access token과 refresh token을 발급하고 refresh token hash를 저장한다", async () => {
    const user = createUser();
    const userRepository = new FakeUserRepository([user]);
    const refreshTokenRepository = new FakeRefreshTokenRepository();
    const useCase = new LoginUseCase(userRepository, refreshTokenRepository, createDependencies());

    const result = await useCase.execute({
      loginId: "todo_user",
      password: "password1",
    });

    expect(result).toMatchObject({
      accessToken: "access:user-1",
      refreshToken: "refresh-token-value",
      refreshTokenExpiresAt: new Date("2026-06-26T08:00:00.000Z"),
    });
    expect(refreshTokenRepository.tokens[0]?.toSnapshot()).toMatchObject({
      id: createRefreshTokenId("refresh-token-1"),
      userId: createUserId("user-1"),
      tokenHash: "refresh-hash:refresh-token-value",
      revokedAt: null,
      expiresAt: new Date("2026-06-26T08:00:00.000Z"),
    });
  });

  it("잘못된 로그인 ID 또는 비밀번호로 로그인할 수 없다", async () => {
    const userRepository = new FakeUserRepository([createUser()]);
    const useCase = new LoginUseCase(
      userRepository,
      new FakeRefreshTokenRepository(),
      createDependencies(),
    );

    await expect(useCase.execute({ loginId: "missing", password: "password1" })).rejects.toThrow(
      InvalidCredentialsError,
    );
    await expect(useCase.execute({ loginId: "todo_user", password: "wrong" })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  it("refresh token으로 access token을 재발급한다", async () => {
    const userRepository = new FakeUserRepository([createUser()]);
    const refreshTokenRepository = new FakeRefreshTokenRepository([
      RefreshToken.create({
        id: createRefreshTokenId("refresh-token-1"),
        userId: createUserId("user-1"),
        tokenHash: "refresh-hash:refresh-token-value",
        createdAt: new Date("2026-05-27T08:00:00.000Z"),
        expiresAt: new Date("2026-06-26T08:00:00.000Z"),
      }),
    ]);
    const useCase = new RefreshAccessTokenUseCase(
      userRepository,
      refreshTokenRepository,
      createDependencies(),
    );

    await expect(useCase.execute({ refreshToken: "refresh-token-value" })).resolves.toEqual({
      accessToken: "access:user-1",
    });
  });

  it("로그아웃하면 refresh token을 무효화한다", async () => {
    const refreshTokenRepository = new FakeRefreshTokenRepository([
      RefreshToken.create({
        id: createRefreshTokenId("refresh-token-1"),
        userId: createUserId("user-1"),
        tokenHash: "refresh-hash:refresh-token-value",
        createdAt: new Date("2026-05-27T08:00:00.000Z"),
        expiresAt: new Date("2026-06-26T08:00:00.000Z"),
      }),
    ]);
    const useCase = new LogoutUseCase(refreshTokenRepository, createDependencies());

    await useCase.execute({ refreshToken: "refresh-token-value" });

    expect(refreshTokenRepository.tokens[0]?.revokedAt).toEqual(
      new Date("2026-05-27T08:00:00.000Z"),
    );
  });

  it("아이디 찾기 인증 코드를 생성하고 메일로 발송한다", async () => {
    const userRepository = new FakeUserRepository([createUser()]);
    const emailVerificationRepository = new FakeEmailVerificationRepository();
    const dependencies = createDependencies();
    const useCase = new RequestFindLoginIdCodeUseCase(
      userRepository,
      emailVerificationRepository,
      dependencies,
    );

    await useCase.execute({ email: " USER@example.COM " });

    expect(emailVerificationRepository.verifications[0]?.toSnapshot()).toMatchObject({
      id: createEmailVerificationId("email-verification-1"),
      email: "user@example.com",
      code: "333333",
      purpose: "find-login-id",
      expiresAt: new Date("2026-05-27T08:10:00.000Z"),
    });
    expect(dependencies.mailSender.sentMessages).toEqual([
      {
        to: "user@example.com",
        code: "333333",
        purpose: "find-login-id",
      },
    ]);
  });

  it("이메일 인증 후 로그인 ID를 반환한다", async () => {
    const userRepository = new FakeUserRepository([createUser()]);
    const emailVerificationRepository = new FakeEmailVerificationRepository();
    const dependencies = createDependencies();
    await new RequestFindLoginIdCodeUseCase(
      userRepository,
      emailVerificationRepository,
      dependencies,
    ).execute({ email: "user@example.com" });
    const useCase = new VerifyFindLoginIdCodeUseCase(
      userRepository,
      emailVerificationRepository,
      dependencies,
    );

    await expect(useCase.execute({ email: "user@example.com", code: "333333" })).resolves.toEqual({
      loginId: "todo_user",
    });
    expect(emailVerificationRepository.verifications[0]?.isUsed()).toBe(true);
  });

  it("비밀번호 재설정 인증 코드를 생성하고 메일로 발송한다", async () => {
    const userRepository = new FakeUserRepository([createUser()]);
    const emailVerificationRepository = new FakeEmailVerificationRepository();
    const dependencies = createDependencies();
    const useCase = new RequestPasswordResetCodeUseCase(
      userRepository,
      emailVerificationRepository,
      dependencies,
    );

    await useCase.execute({ email: "user@example.com" });

    expect(emailVerificationRepository.verifications[0]?.toSnapshot()).toMatchObject({
      email: "user@example.com",
      code: "333333",
      purpose: "reset-password",
    });
    expect(dependencies.mailSender.sentMessages[0]).toMatchObject({
      to: "user@example.com",
      code: "333333",
      purpose: "reset-password",
    });
  });

  it("이메일 인증 후 비밀번호를 재설정하고 기존 refresh token을 무효화한다", async () => {
    const user = createUser();
    const userRepository = new FakeUserRepository([user]);
    const refreshTokenRepository = new FakeRefreshTokenRepository([
      RefreshToken.create({
        id: createRefreshTokenId("refresh-token-1"),
        userId: createUserId("user-1"),
        tokenHash: "refresh-hash:refresh-token-value",
        createdAt: new Date("2026-05-27T08:00:00.000Z"),
        expiresAt: new Date("2026-06-26T08:00:00.000Z"),
      }),
    ]);
    const emailVerificationRepository = new FakeEmailVerificationRepository();
    const dependencies = createDependencies();
    await new RequestPasswordResetCodeUseCase(
      userRepository,
      emailVerificationRepository,
      dependencies,
    ).execute({ email: "user@example.com" });
    const useCase = new ResetPasswordUseCase(
      userRepository,
      refreshTokenRepository,
      emailVerificationRepository,
      dependencies,
    );

    await useCase.execute({
      email: "user@example.com",
      code: "333333",
      password: "new-password1",
      passwordConfirm: "new-password1",
    });

    await expect(userRepository.findByEmail("user@example.com")).resolves.toMatchObject({
      passwordHash: "hashed:new-password1",
    });
    expect(refreshTokenRepository.tokens[0]?.revokedAt).toEqual(
      new Date("2026-05-27T08:00:00.000Z"),
    );
  });

  it("가입되지 않은 이메일로 인증 코드를 요청할 수 없다", async () => {
    const useCase = new RequestFindLoginIdCodeUseCase(
      new FakeUserRepository(),
      new FakeEmailVerificationRepository(),
      createDependencies(),
    );

    await expect(useCase.execute({ email: "missing@example.com" })).rejects.toThrow(
      UserEmailNotFoundError,
    );
  });
});

function createUser(passwordHash = "hashed:password1"): User {
  return User.create({
    id: createUserId("user-1"),
    loginId: "todo_user",
    nickname: "도훈",
    email: "user@example.com",
    passwordHash,
    createdAt: new Date("2026-05-27T08:00:00.000Z"),
  });
}

function createDependencies(): AuthUseCaseDependencies & { readonly mailSender: FakeMailSender } {
  const mailSender = new FakeMailSender();

  return {
    generateUserId: () => createUserId("user-1"),
    generateRefreshTokenId: () => createRefreshTokenId("refresh-token-1"),
    generateEmailVerificationId: () => createEmailVerificationId("email-verification-1"),
    generateRefreshTokenValue: () => "refresh-token-value",
    generateEmailVerificationDigit: () => 3,
    now: () => new Date("2026-05-27T08:00:00.000Z"),
    refreshTokenTtlMs: 30 * 24 * 60 * 60 * 1000,
    emailVerificationTtlMs: 10 * 60 * 1000,
    passwordHasher: new FakePasswordHasher(),
    refreshTokenHasher: new FakeRefreshTokenHasher(),
    accessTokenIssuer: new FakeAccessTokenIssuer(),
    mailSender,
  };
}

class FakeMailSender implements MailSender {
  readonly sentMessages: Array<{
    readonly to: string;
    readonly code: string;
    readonly purpose: EmailVerificationPurpose;
  }> = [];

  async sendEmailVerificationCode(input: {
    readonly to: string;
    readonly code: string;
    readonly purpose: EmailVerificationPurpose;
  }): Promise<void> {
    this.sentMessages.push(input);
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return `hashed:${password}`;
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    return passwordHash === `hashed:${password}`;
  }
}

class FakeRefreshTokenHasher implements RefreshTokenHasher {
  hash(refreshToken: string): string {
    return `refresh-hash:${refreshToken}`;
  }
}

class FakeAccessTokenIssuer implements AccessTokenIssuer {
  issue(input: { readonly userId: UserId }): string {
    return `access:${input.userId}`;
  }
}

class FakeUserRepository implements UserRepository {
  constructor(readonly users: User[] = []) {}

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByLoginId(loginId: string): Promise<User | null> {
    return this.users.find((user) => user.loginId === loginId) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async updatePasswordHash(user: User): Promise<void> {
    const index = this.users.findIndex((savedUser) => savedUser.id === user.id);
    this.users[index] = user;
  }

  async delete(id: UserId): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    this.users.splice(index, 1);
  }
}

class FakeRefreshTokenRepository implements RefreshTokenRepository {
  constructor(readonly tokens: RefreshToken[] = []) {}

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.tokens.find((token) => token.toSnapshot().tokenHash === tokenHash) ?? null;
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.tokens.push(refreshToken);
  }

  async update(refreshToken: RefreshToken): Promise<void> {
    const index = this.tokens.findIndex(
      (token) => token.toSnapshot().id === refreshToken.toSnapshot().id,
    );
    this.tokens[index] = refreshToken;
  }

  async revokeAllByUserId(userId: UserId, revokedAt: Date): Promise<void> {
    for (const token of this.tokens) {
      if (token.toSnapshot().userId === userId) {
        token.revoke(revokedAt);
      }
    }
  }
}

class FakeEmailVerificationRepository implements EmailVerificationRepository {
  constructor(readonly verifications: EmailVerification[] = []) {}

  async findLatestByEmailAndPurpose(
    email: string,
    purpose: EmailVerificationPurpose,
  ): Promise<EmailVerification | null> {
    return (
      this.verifications
        .filter((verification) => {
          const snapshot = verification.toSnapshot();

          return snapshot.email === email && snapshot.purpose === purpose;
        })
        .sort(
          (left, right) =>
            right.toSnapshot().createdAt.getTime() - left.toSnapshot().createdAt.getTime(),
        )[0] ?? null
    );
  }

  async create(emailVerification: EmailVerification): Promise<void> {
    this.verifications.push(emailVerification);
  }

  async update(emailVerification: EmailVerification): Promise<void> {
    const index = this.verifications.findIndex(
      (verification) => verification.toSnapshot().id === emailVerification.toSnapshot().id,
    );
    this.verifications[index] = emailVerification;
  }
}
