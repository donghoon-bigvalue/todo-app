import {
  LoginUseCase,
  LogoutUseCase,
  RefreshAccessTokenUseCase,
  RequestFindLoginIdCodeUseCase,
  RequestPasswordResetCodeUseCase,
  ResetPasswordUseCase,
  SignupUseCase,
  type AuthUseCaseDependencies,
  VerifyFindLoginIdCodeUseCase,
} from "./auth-use-cases";
import type {
  EmailVerificationRepository,
  RefreshTokenRepository,
  UserRepository,
} from "@todo-app/domain";
import { createEmailVerificationId, createRefreshTokenId, createUserId } from "@todo-app/domain";
import type { Provider } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AUTH_USE_CASE_DEPENDENCIES,
  EMAIL_VERIFICATION_REPOSITORY,
  LOGIN_USE_CASE,
  LOGOUT_USE_CASE,
  REFRESH_ACCESS_TOKEN_USE_CASE,
  REFRESH_TOKEN_REPOSITORY,
  REQUEST_FIND_LOGIN_ID_CODE_USE_CASE,
  REQUEST_PASSWORD_RESET_CODE_USE_CASE,
  RESET_PASSWORD_USE_CASE,
  SIGNUP_USE_CASE,
  USER_REPOSITORY,
  VERIFY_FIND_LOGIN_ID_CODE_USE_CASE,
} from "../auth.tokens";
import { createAuthConfig, generateRefreshTokenValue } from "../infrastructure/auth-config";
import { BcryptPasswordHasher } from "../infrastructure/bcrypt-password-hasher";
import { JwtAccessTokenIssuer } from "../infrastructure/jwt-access-token-issuer";
import { createNodemailerMailSender } from "../infrastructure/nodemailer-mail-sender";
import { Sha256RefreshTokenHasher } from "../infrastructure/refresh-token-hasher";
import { createSmtpMailConfig } from "../infrastructure/smtp-mail-config";

export const authUseCaseProviders: Provider[] = [
  {
    provide: AUTH_USE_CASE_DEPENDENCIES,
    useFactory: (): AuthUseCaseDependencies => {
      const config = createAuthConfig(process.env);

      return {
        generateUserId: () => createUserId(randomUUID()),
        generateRefreshTokenId: () => createRefreshTokenId(randomUUID()),
        generateEmailVerificationId: () => createEmailVerificationId(randomUUID()),
        generateRefreshTokenValue,
        generateEmailVerificationDigit: () => Math.floor(Math.random() * 10),
        now: () => new Date(),
        refreshTokenTtlMs: config.refreshTokenTtlMs,
        emailVerificationTtlMs: config.emailVerificationTtlMs,
        passwordHasher: new BcryptPasswordHasher(),
        refreshTokenHasher: new Sha256RefreshTokenHasher(),
        accessTokenIssuer: new JwtAccessTokenIssuer({
          secret: config.jwtSecret,
          expiresInSeconds: config.accessTokenExpiresInSeconds,
        }),
        mailSender: createNodemailerMailSender(createSmtpMailConfig(process.env)),
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
  {
    provide: REQUEST_FIND_LOGIN_ID_CODE_USE_CASE,
    inject: [USER_REPOSITORY, EMAIL_VERIFICATION_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      userRepository: UserRepository,
      emailVerificationRepository: EmailVerificationRepository,
      dependencies: AuthUseCaseDependencies,
    ) =>
      new RequestFindLoginIdCodeUseCase(userRepository, emailVerificationRepository, dependencies),
  },
  {
    provide: VERIFY_FIND_LOGIN_ID_CODE_USE_CASE,
    inject: [USER_REPOSITORY, EMAIL_VERIFICATION_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      userRepository: UserRepository,
      emailVerificationRepository: EmailVerificationRepository,
      dependencies: AuthUseCaseDependencies,
    ) =>
      new VerifyFindLoginIdCodeUseCase(userRepository, emailVerificationRepository, dependencies),
  },
  {
    provide: REQUEST_PASSWORD_RESET_CODE_USE_CASE,
    inject: [USER_REPOSITORY, EMAIL_VERIFICATION_REPOSITORY, AUTH_USE_CASE_DEPENDENCIES],
    useFactory: (
      userRepository: UserRepository,
      emailVerificationRepository: EmailVerificationRepository,
      dependencies: AuthUseCaseDependencies,
    ) =>
      new RequestPasswordResetCodeUseCase(
        userRepository,
        emailVerificationRepository,
        dependencies,
      ),
  },
  {
    provide: RESET_PASSWORD_USE_CASE,
    inject: [
      USER_REPOSITORY,
      REFRESH_TOKEN_REPOSITORY,
      EMAIL_VERIFICATION_REPOSITORY,
      AUTH_USE_CASE_DEPENDENCIES,
    ],
    useFactory: (
      userRepository: UserRepository,
      refreshTokenRepository: RefreshTokenRepository,
      emailVerificationRepository: EmailVerificationRepository,
      dependencies: AuthUseCaseDependencies,
    ) =>
      new ResetPasswordUseCase(
        userRepository,
        refreshTokenRepository,
        emailVerificationRepository,
        dependencies,
      ),
  },
];
