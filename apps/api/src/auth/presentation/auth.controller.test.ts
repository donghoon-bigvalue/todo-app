import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { createRefreshTokenId, createUserId } from "@todo-app/domain";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AuthModule } from "../auth.module";
import {
  AUTH_USE_CASE_DEPENDENCIES,
  type CookieResponse,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../auth.tokens";
import type { AuthUseCaseDependencies } from "../application/auth-use-cases";
import { AuthController } from "./auth.controller";

describe("AuthController", () => {
  let module: TestingModule;
  let controller: AuthController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AUTH_USE_CASE_DEPENDENCIES)
      .useValue({
        generateUserId: () => createUserId("user-1"),
        generateRefreshTokenId: () => createRefreshTokenId("refresh-token-1"),
        generateRefreshTokenValue: () => "refresh-token-value",
        now: () => new Date("2026-05-27T08:00:00.000Z"),
        refreshTokenTtlMs: 30 * 24 * 60 * 60 * 1000,
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
      } satisfies AuthUseCaseDependencies)
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
      value: "refresh-token-value",
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
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value`),
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
      controller.logout(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value`, logoutResponse),
    ).resolves.toBeUndefined();
    expect(logoutResponse.clearedCookies).toEqual([REFRESH_TOKEN_COOKIE_NAME]);
    await expect(
      controller.refresh(`${REFRESH_TOKEN_COOKIE_NAME}=refresh-token-value`),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("잘못된 요청과 인증 실패를 명확한 예외로 변환한다", async () => {
    await expect(controller.signup({ loginId: "bad" })).rejects.toThrow(BadRequestException);
    await expect(
      controller.login({ loginId: "missing", password: "password1" }, createCookieResponse()),
    ).rejects.toThrow(UnauthorizedException);
    await expect(controller.refresh(undefined)).rejects.toThrow(UnauthorizedException);
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
