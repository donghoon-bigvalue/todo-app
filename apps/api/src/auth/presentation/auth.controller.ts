import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { User } from "@todo-app/domain";
import { ZodError, z } from "zod";
import {
  type LoginUseCase,
  type LogoutUseCase,
  type RefreshAccessTokenUseCase,
  type SignupUseCase,
  DuplicateEmailError,
  DuplicateLoginIdError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  MissingRefreshTokenError,
} from "../application/auth-use-cases";
import {
  type CookieResponse,
  LOGIN_USE_CASE,
  LOGOUT_USE_CASE,
  REFRESH_ACCESS_TOKEN_USE_CASE,
  REFRESH_TOKEN_COOKIE_NAME,
  SIGNUP_USE_CASE,
} from "../auth.tokens";

const loginRequestSchema = z.object({
  loginId: z.string(),
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

function mapAuthApiError(error: unknown): Error {
  if (error instanceof ZodError) {
    return new BadRequestException(error.issues);
  }

  if (error instanceof DuplicateLoginIdError || error instanceof DuplicateEmailError) {
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
