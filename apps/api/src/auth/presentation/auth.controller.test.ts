import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { createEmailVerificationId, createRefreshTokenId, createUserId } from "@todo-app/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AuthModule } from "../auth.module";
import {
  AUTH_ACCESS_TOKEN_VERIFIER,
  AUTH_USE_CASE_DEPENDENCIES,
  type CookieResponse,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../auth.tokens";
import type { AuthUseCaseDependencies } from "../application/auth-use-cases";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let module: TestingModule;
  let controller: AuthController;
  let nextRefreshTokenId: number;
  let nextRefreshTokenValue: number;

  beforeEach(async () => {
    nextRefreshTokenId = 1;
    nextRefreshTokenValue = 1;

    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AUTH_USE_CASE_DEPENDENCIES)
      .useValue({
        generateUserId: () => createUserId("user-1"),
        generateRefreshTokenId: () => createRefreshTokenId(`refresh-token-${nextRefreshTokenId++}`),
        generateEmailVerificationId: () => createEmailVerificationId("email-verification-1"),
        generateRefreshTokenValue: () => `refresh-token-value-${nextRefreshTokenValue++}`,
        generateEmailVerificationDigit: () => 3,
        now: () => new Date("2026-05-27T08:00:00.000Z"),
        refreshTokenTtlMs: 30 * 24 * 60 * 60 * 1000,
        emailVerificationTtlMs: 10 * 60 * 1000,
        passwordHasher: {
          hash: async (password: string) => `hashed:${password}`,
          verify: async (password: string, passwordHash: string) =>
            passwordHash === `hashed:${password}`,
        },
        refreshTokenHasher: {
          hash: (refreshToken: string) => `refresh-hash:${refreshToken}`,
        },
        accessTokenIssuer: {
          issue: ({ userId }: { readonly userId: string }) => `access:${userId}`,
        },
        mailSender: {
          sendEmailVerificationCode: async () => {},
        },
      } satisfies AuthUseCaseDependencies)
      .overrideProvider(AUTH_ACCESS_TOKEN_VERIFIER)
      .useValue({
        verify: (accessToken: string) =>
          accessToken === "access:user-1" ? { userId: createUserId("user-1") } : null,
      })
      .compile();

    controller = module.get(AuthController);
  });

  afterEach(async () => {
    await module.close();
  });

  it("회원가입한다", async () => {
    await expect(
      controller.signup({
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
        password: "password1",
        passwordConfirm: "password1",
      }),
    ).resolves.toEqual({
      id: "user-1",
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      createdAt: "2026-05-27T08:00:00.000Z",
    });
  });

  it("로그인하면 access token을 반환하고 refresh token cookie를 설정한다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const response = createCookieResponse();

    await expect(
      controller.login({ loginId: "todo_user", password: "password1" }, response),
    ).resolves.toEqual({
      accessToken: "access:user-1",
      user: {
        id: "user-1",
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
      },
    });
    expect(response.cookies[0]).toMatchObject({
      name: REFRESH_TOKEN_COOKIE_NAME,
      value: "refresh-token-value-1",
      options: {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date("2026-06-26T08:00:00.000Z"),
      },
    });
  });

  it("refresh token cookie로 access token을 재발급한다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const response = createCookieResponse();
    await controller.login({ loginId: "todo_user", password: "password1" }, response);

    await expect(
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value-1`),
    ).resolves.toEqual({
      accessToken: "access:user-1",
    });
  });

  it("로그아웃하면 refresh token을 무효화하고 cookie를 지운다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const loginResponse = createCookieResponse();
    await controller.login({ loginId: "todo_user", password: "password1" }, loginResponse);
    const logoutResponse = createCookieResponse();

    await expect(
      controller.logout(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value-1`, logoutResponse),
    ).resolves.toBeUndefined();
    expect(logoutResponse.clearedCookies).toEqual([REFRESH_TOKEN_COOKIE_NAME]);
    await expect(
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value-1`),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("잘못된 요청과 인증 실패를 명확한 예외로 변환한다", async () => {
    await expect(controller.signup({ loginId: "bad" })).rejects.toThrow(BadRequestException);
    await expect(
      controller.login({ loginId: "missing", password: "password1" }, createCookieResponse()),
    ).rejects.toThrow(UnauthorizedException);
    await expect(controller.refresh(undefined)).rejects.toThrow(UnauthorizedException);
  });

  it("이메일 인증으로 로그인 ID를 찾는다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });

    await expect(controller.requestFindLoginIdCode({ email: "user@example.com" })).resolves.toEqual(
      {
        sent: true,
      },
    );
    await expect(
      controller.verifyFindLoginIdCode({ email: "user@example.com", code: "333333" }),
    ).resolves.toEqual({
      loginId: "todo_user",
    });
  });

  it("이메일 인증으로 비밀번호를 재설정한다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const loginResponse = createCookieResponse();
    await controller.login({ loginId: "todo_user", password: "password1" }, loginResponse);

    await expect(
      controller.requestPasswordResetCode({ email: "user@example.com" }),
    ).resolves.toEqual({
      sent: true,
    });
    await expect(
      controller.resetPassword({
        email: "user@example.com",
        code: "333333",
        password: "new-password1",
        passwordConfirm: "new-password1",
      }),
    ).resolves.toBeUndefined();
    await expect(
      controller.login({ loginId: "todo_user", password: "password1" }, createCookieResponse()),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      controller.login({ loginId: "todo_user", password: "new-password1" }, createCookieResponse()),
    ).resolves.toMatchObject({
      accessToken: "access:user-1",
    });
    await expect(
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value-1`),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("로그인 사용자가 현재 비밀번호 확인 후 비밀번호를 변경한다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const loginResponse = createCookieResponse();
    await controller.login({ loginId: "todo_user", password: "password1" }, loginResponse);

    await expect(
      controller.changePassword(
        {
          currentPassword: "password1",
          password: "new-password1",
          passwordConfirm: "new-password1",
        },
        "Bearer access:user-1",
      ),
    ).resolves.toBeUndefined();
    await expect(
      controller.login({ loginId: "todo_user", password: "password1" }, createCookieResponse()),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      controller.login({ loginId: "todo_user", password: "new-password1" }, createCookieResponse()),
    ).resolves.toMatchObject({
      accessToken: "access:user-1",
    });
    await expect(
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value-1`),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("로그인 사용자가 비밀번호 재확인 후 계정을 탈퇴한다", async () => {
    await controller.signup({
      loginId: "todo_user",
      nickname: "도훈",
      email: "user@example.com",
      password: "password1",
      passwordConfirm: "password1",
    });
    const loginResponse = createCookieResponse();
    await controller.login({ loginId: "todo_user", password: "password1" }, loginResponse);

    await expect(
      controller.deleteAccount(
        { password: "password1" },
        "Bearer access:user-1",
        createCookieResponse(),
      ),
    ).resolves.toBeUndefined();
    await expect(
      controller.login({ loginId: "todo_user", password: "password1" }, createCookieResponse()),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      controller.signup({
        loginId: "todo_user",
        nickname: "도훈",
        email: "user@example.com",
        password: "password1",
        passwordConfirm: "password1",
      }),
    ).resolves.toMatchObject({
      loginId: "todo_user",
      email: "user@example.com",
    });
  });
});

function createCookieResponse(): CookieResponse & {
  readonly cookies: Array<{
    readonly name: string;
    readonly value: string;
    readonly options: unknown;
  }>;
  readonly clearedCookies: string[];
} {
  const cookies: Array<{
    readonly name: string;
    readonly value: string;
    readonly options: unknown;
  }> = [];
  const clearedCookies: string[] = [];

  return {
    cookies,
    clearedCookies,
    cookie(name, value, options) {
      cookies.push({ name, value, options });
    },
    clearCookie(name) {
      clearedCookies.push(name);
    },
  };
}
