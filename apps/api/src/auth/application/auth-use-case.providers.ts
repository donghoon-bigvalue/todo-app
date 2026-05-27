import {
  LoginUseCase,
  LogoutUseCase,
  RefreshAccessTokenUseCase,
  SignupUseCase,
  type AuthUseCaseDependencies,
} from "./auth-use-cases";
import type { RefreshTokenRepository, UserRepository } from "@todo-app/domain";
import { createRefreshTokenId, createUserId } from "@todo-app/domain";
import type { Provider } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AUTH_USE_CASE_DEPENDENCIES,
  LOGIN_USE_CASE,
  LOGOUT_USE_CASE,
  REFRESH_ACCESS_TOKEN_USE_CASE,
  REFRESH_TOKEN_REPOSITORY,
  SIGNUP_USE_CASE,
  USER_REPOSITORY,
} from "../auth.tokens";
import { createAuthConfig, generateRefreshTokenValue } from "../infrastructure/auth-config";
import { BcryptPasswordHasher } from "../infrastructure/bcrypt-password-hasher";
import { JwtAccessTokenIssuer } from "../infrastructure/jwt-access-token-issuer";
import { Sha256RefreshTokenHasher } from "../infrastructure/refresh-token-hasher";

export const authUseCaseProviders: Provider[] = [
  {
    provide: AUTH_USE_CASE_DEPENDENCIES,
    useFactory: (): AuthUseCaseDependencies => {
      const config = createAuthConfig(process.env);

      return {
        generateUserId: () => createUserId(randomUUID()),
        generateRefreshTokenId: () => createRefreshTokenId(randomUUID()),
        generateRefreshTokenValue,
        now: () => new Date(),
        refreshTokenTtlMs: config.refreshTokenTtlMs,
        passwordHasher: new BcryptPasswordHasher(),
        refreshTokenHasher: new Sha256RefreshTokenHasher(),
        accessTokenIssuer: new JwtAccessTokenIssuer({
          secret: config.jwtSecret,
          expiresInSeconds: config.accessTokenExpiresInSeconds,
        }),
      };
    },
  },
  {
    provide: SIGNUP_USE_CASE,
    inject: [USER_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (userRepository: UserRepository, dependencies: AuthUseCaseDependencies) =>
      new SignupUseCase(userRepository, dependencies),
  },
  {
    provide: LOGIN_USE_CASE,
    inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      userRepository: UserRepository,
      refreshTokenRepository: RefreshTokenRepository,
      dependencies: AuthUseCaseDependencies,
    ) => new LoginUseCase(userRepository, refreshTokenRepository, dependencies),
  },
  {
    provide: REFRESH_ACCESS_TOKEN_USE_CASE,
    inject: [USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      userRepository: UserRepository,
      refreshTokenRepository: RefreshTokenRepository,
      dependencies: AuthUseCaseDependencies,
    ) => new RefreshAccessTokenUseCase(userRepository, refreshTokenRepository, dependencies),
  },
  {
    provide: LOGOUT_USE_CASE,
    inject: [REFRESH_TOKEN_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      refreshTokenRepository: RefreshTokenRepository,
      dependencies: AuthUseCaseDependencies,
    ) => new LogoutUseCase(refreshTokenRepository, dependencies),
  },
];
