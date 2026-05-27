import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  Inject,
  NotFoundException,
  Patch,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { User, UserId } from "@todo-app/domain";
import { ZodError, z } from "zod";
import {
  type AccessTokenVerifier,
  type ChangePasswordUseCase,
  type DeleteAccountUseCase,
  type LoginUseCase,
  type LogoutUseCase,
  type RefreshAccessTokenUseCase,
  type RequestFindLoginIdCodeUseCase,
  type RequestPasswordResetCodeUseCase,
  type ResetPasswordUseCase,
  type SignupUseCase,
  type VerifyFindLoginIdCodeUseCase,
  DuplicateEmailError,
  DuplicateLoginIdError,
  EmailVerificationAlreadyUsedError,
  EmailVerificationExpiredError,
  EmailVerificationInvalidCodeError,
  EmailVerificationNotFoundError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  MissingRefreshTokenError,
  UserEmailNotFoundError,
} from "../application/auth-use-cases";
import {
  AUTH_ACCESS_TOKEN_VERIFIER,
  CHANGE_PASSWORD_USE_CASE,
  type CookieResponse,
  DELETE_ACCOUNT_USE_CASE,
  LOGIN_USE_CASE,
  LOGOUT_USE_CASE,
  REFRESH_ACCESS_TOKEN_USE_CASE,
  REFRESH_TOKEN_COOKIE_NAME,
  REQUEST_FIND_LOGIN_ID_CODE_USE_CASE,
  REQUEST_PASSWORD_RESET_CODE_USE_CASE,
  RESET_PASSWORD_USE_CASE,
  SIGNUP_USE_CASE,
  VERIFY_FIND_LOGIN_ID_CODE_USE_CASE,
} from "../auth.tokens";

const loginRequestSchema = z.object({
  loginId: z.string(),
  password: z.string(),
});

const emailRequestSchema = z.object({
  email: z.string(),
});

const emailVerificationRequestSchema = z.object({
  email: z.string(),
  code: z.string(),
});

const changePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  password: z.string(),
  passwordConfirm: z.string(),
});

const deleteAccountRequestSchema = z.object({
  password: z.string(),
});

export type AuthUserResponse = {
  readonly id: string;
  readonly loginId: string;
  readonly nickname: string;
  readonly email: string;
};

export type SignupResponse = AuthUserResponse & {
  readonly createdAt: string;
};

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(SIGNUP_USE_CASE)
    private readonly signupUseCase: SignupUseCase,
    @Inject(LOGIN_USE_CASE)
    private readonly loginUseCase: LoginUseCase,
    @Inject(REFRESH_ACCESS_TOKEN_USE_CASE)
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    @Inject(LOGOUT_USE_CASE)
    private readonly logoutUseCase: LogoutUseCase,
    @Inject(REQUEST_FIND_LOGIN_ID_CODE_USE_CASE)
    private readonly requestFindLoginIdCodeUseCase: RequestFindLoginIdCodeUseCase,
    @Inject(VERIFY_FIND_LOGIN_ID_CODE_USE_CASE)
    private readonly verifyFindLoginIdCodeUseCase: VerifyFindLoginIdCodeUseCase,
    @Inject(REQUEST_PASSWORD_RESET_CODE_USE_CASE)
    private readonly requestPasswordResetCodeUseCase: RequestPasswordResetCodeUseCase,
    @Inject(RESET_PASSWORD_USE_CASE)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @Inject(CHANGE_PASSWORD_USE_CASE)
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    @Inject(DELETE_ACCOUNT_USE_CASE)
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    @Inject(AUTH_ACCESS_TOKEN_VERIFIER)
    private readonly accessTokenVerifier: AccessTokenVerifier,
  ) {}

  @Post("signup")
  async signup(@Body() body: unknown): Promise<SignupResponse> {
    try {
      const user = await this.signupUseCase.execute(body);

      return toSignupResponse(user);
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: CookieResponse,
  ): Promise<{ readonly accessToken: string; readonly user: AuthUserResponse }> {
    try {
      const request = loginRequestSchema.parse(body);
      const result = await this.loginUseCase.execute(request);

      response.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
        expires: result.refreshTokenExpiresAt,
      });

      return {
        accessToken: result.accessToken,
        user: toAuthUserResponse(result.user),
      };
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @Headers("cookie") cookieHeader: string | undefined,
  ): Promise<{ readonly accessToken: string }> {
    try {
      return await this.refreshAccessTokenUseCase.execute({
        refreshToken: readCookie(cookieHeader, REFRESH_TOKEN_COOKIE_NAME),
      });
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("logout")
  @HttpCode(204)
  async logout(
    @Headers("cookie") cookieHeader: string | undefined,
    @Res({ passthrough: true }) response: CookieResponse,
  ): Promise<void> {
    try {
      await this.logoutUseCase.execute({
        refreshToken: readCookie(cookieHeader, REFRESH_TOKEN_COOKIE_NAME),
      });
      response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
      });
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("find-login-id/request-code")
  @HttpCode(200)
  async requestFindLoginIdCode(@Body() body: unknown): Promise<{ readonly sent: true }> {
    try {
      await this.requestFindLoginIdCodeUseCase.execute(emailRequestSchema.parse(body));

      return { sent: true };
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("find-login-id/verify")
  @HttpCode(200)
  async verifyFindLoginIdCode(@Body() body: unknown): Promise<{ readonly loginId: string }> {
    try {
      return await this.verifyFindLoginIdCodeUseCase.execute(
        emailVerificationRequestSchema.parse(body),
      );
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("reset-password/request-code")
  @HttpCode(200)
  async requestPasswordResetCode(@Body() body: unknown): Promise<{ readonly sent: true }> {
    try {
      await this.requestPasswordResetCodeUseCase.execute(emailRequestSchema.parse(body));

      return { sent: true };
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Post("reset-password/verify")
  @HttpCode(204)
  async resetPassword(@Body() body: unknown): Promise<void> {
    try {
      await this.resetPasswordUseCase.execute(body);
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Patch("password")
  @HttpCode(204)
  async changePassword(
    @Body() body: unknown,
    @Headers("authorization") authorization: string | undefined,
  ): Promise<void> {
    try {
      await this.changePasswordUseCase.execute({
        ...changePasswordRequestSchema.parse(body),
        userId: this.authenticate(authorization),
      });
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  @Delete("account")
  @HttpCode(204)
  async deleteAccount(
    @Body() body: unknown,
    @Headers("authorization") authorization: string | undefined,
    @Res({ passthrough: true }) response?: CookieResponse,
  ): Promise<void> {
    try {
      await this.deleteAccountUseCase.execute({
        ...deleteAccountRequestSchema.parse(body),
        userId: this.authenticate(authorization),
      });
      response?.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
      });
    } catch (error) {
      throw mapAuthApiError(error);
    }
  }

  private authenticate(authorization: string | undefined): UserId {
    const accessToken = readBearerToken(authorization);
    const user = accessToken ? this.accessTokenVerifier.verify(accessToken) : null;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user.userId;
  }
}

function toSignupResponse(user: User): SignupResponse {
  return {
    ...toAuthUserResponse(user),
    createdAt: user.createdAt.toISOString(),
  };
}

function toAuthUserResponse(user: User): AuthUserResponse {
  return {
    id: user.id,
    loginId: user.loginId,
    nickname: user.nickname,
    email: user.email,
  };
}

function readCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = part.trim().split("=");

    if (cookieName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function readBearerToken(authorization: string | undefined): string | null {
  const [scheme, token] = authorization?.split(" ") ?? [];

  return scheme === "Bearer" && token ? token : null;
}

function mapAuthApiError(error: unknown): Error {
  if (error instanceof ZodError) {
    return new BadRequestException(error.issues);
  }

  if (error instanceof DuplicateLoginIdError || error instanceof DuplicateEmailError) {
    return new BadRequestException(error.message);
  }

  if (error instanceof UserEmailNotFoundError) {
    return new NotFoundException();
  }

  if (
    error instanceof EmailVerificationNotFoundError ||
    error instanceof EmailVerificationInvalidCodeError ||
    error instanceof EmailVerificationExpiredError ||
    error instanceof EmailVerificationAlreadyUsedError
  ) {
    return new BadRequestException(error.message);
  }

  if (
    error instanceof InvalidCredentialsError ||
    error instanceof MissingRefreshTokenError ||
    error instanceof InvalidRefreshTokenError
  ) {
    return new UnauthorizedException();
  }

  return error instanceof Error ? error : new Error("알 수 없는 오류가 발생했습니다.");
}
