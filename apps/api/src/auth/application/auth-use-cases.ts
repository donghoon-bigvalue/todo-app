import {
  RefreshToken,
  User,
  type RefreshTokenId,
  type RefreshTokenRepository,
  type UserId,
  type UserRepository,
  signupSchema,
} from "@todo-app/domain";

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
  readonly generateRefreshTokenValue: () => string;
  readonly now: () => Date;
  readonly refreshTokenTtlMs: number;
  readonly passwordHasher: PasswordHasher;
  readonly refreshTokenHasher: RefreshTokenHasher;
  readonly accessTokenIssuer: AccessTokenIssuer;
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
