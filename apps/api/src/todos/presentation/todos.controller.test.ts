import {
  createEmailVerificationId,
  createRefreshTokenId,
  createTodoId,
  createUserId,
  type TodoUseCaseDependencies,
} from "@todo-app/domain";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../../app.module";
import { AUTH_USE_CASE_DEPENDENCIES } from "../../auth/auth.tokens";
import type {
  AccessTokenVerifier,
  AuthUseCaseDependencies,
} from "../../auth/application/auth-use-cases";
import { AuthController } from "../../auth/presentation/auth.controller";
import { ACCESS_TOKEN_VERIFIER, TODO_USE_CASE_DEPENDENCIES } from "../todos.tokens";
import { TodosController } from "./todos.controller";

describe("TodosController", () => {
  let module: TestingModule;
  let authController: AuthController;
  let controller: TodosController;
  let nextId = 1;
  let nextUserId = 1;
  let nextRefreshTokenId = 1;
  let nextRefreshTokenValue = 1;

  beforeEach(async () => {
    nextId = 1;
    nextUserId = 1;
    nextRefreshTokenId = 1;
    nextRefreshTokenValue = 1;

    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AUTH_USE_CASE_DEPENDENCIES)
      .useValue({
        generateUserId: () => createUserId(`user-${nextUserId++}`),
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
      .overrideProvider(ACCESS_TOKEN_VERIFIER)
      .useValue({
        verify: (accessToken: string) => {
          if (!accessToken.startsWith("access:")) {
            return null;
          }

          return {
            userId: createUserId(accessToken.slice("access:".length)),
          };
        },
      } satisfies AccessTokenVerifier)
      .overrideProvider(TODO_USE_CASE_DEPENDENCIES)
      .useValue({
        generateId: () => createTodoId(`todo-${nextId++}`),
        now: () => new Date("2026-05-13T09:00:00.000Z"),
      } satisfies TodoUseCaseDependencies)
      .compile();

    authController = module.get(AuthController);
    controller = module.get(TodosController);
  });

  afterEach(async () => {
    await module.close();
  });

  it("Todo를 생성하고 목록에서 조회한다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");

    await expect(
      controller.create({ title: "  첫   번째 할 일  " }, authorization),
    ).resolves.toEqual({
      id: "todo-1",
      title: "첫 번째 할 일",
      completed: false,
      note: null,
      createdAt: "2026-05-13T09:00:00.000Z",
    });

    await expect(controller.list(authorization)).resolves.toEqual([
      {
        id: "todo-1",
        title: "첫 번째 할 일",
        completed: false,
        note: null,
        createdAt: "2026-05-13T09:00:00.000Z",
      },
    ]);
  });

  it("빈 제목으로 Todo 생성을 요청하면 BadRequestException을 던진다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");

    await expect(controller.create({ title: "   " }, authorization)).rejects.toThrow(
      BadRequestException,
    );
  });

  it("Todo 완료 상태를 변경한다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");
    await controller.create({ title: "완료할 일" }, authorization);

    await expect(
      controller.updateCompleted("todo-1", { completed: true }, authorization),
    ).resolves.toEqual({
      id: "todo-1",
      title: "완료할 일",
      completed: true,
      note: null,
      createdAt: "2026-05-13T09:00:00.000Z",
    });
  });

  it("없는 Todo의 완료 상태를 변경하려 하면 NotFoundException을 던진다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");

    await expect(
      controller.updateCompleted("missing", { completed: true }, authorization),
    ).rejects.toThrow(NotFoundException);
  });

  it("Todo 메모를 수정하고 응답에 포함한다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");
    await controller.create({ title: "메모할 일" }, authorization);

    await expect(
      controller.updateNote("todo-1", { note: "  첫 줄\n둘째 줄  " }, authorization),
    ).resolves.toEqual({
      id: "todo-1",
      title: "메모할 일",
      completed: false,
      note: "첫 줄\n둘째 줄",
      createdAt: "2026-05-13T09:00:00.000Z",
    });

    await expect(controller.list(authorization)).resolves.toEqual([
      {
        id: "todo-1",
        title: "메모할 일",
        completed: false,
        note: "첫 줄\n둘째 줄",
        createdAt: "2026-05-13T09:00:00.000Z",
      },
    ]);
  });

  it("빈 Todo 메모 저장 요청은 메모 없음으로 처리한다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");
    await controller.create({ title: "메모를 비울 일" }, authorization);
    await controller.updateNote("todo-1", { note: "기존 메모" }, authorization);

    await expect(
      controller.updateNote("todo-1", { note: "   \n  " }, authorization),
    ).resolves.toMatchObject({
      id: "todo-1",
      note: null,
    });
  });

  it("긴 Todo 메모 저장 요청은 BadRequestException을 던진다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");
    await controller.create({ title: "메모할 일" }, authorization);

    await expect(
      controller.updateNote("todo-1", { note: "가".repeat(501) }, authorization),
    ).rejects.toThrow(BadRequestException);
  });

  it("없는 Todo의 메모를 수정하려 하면 NotFoundException을 던진다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");

    await expect(controller.updateNote("missing", { note: "메모" }, authorization)).rejects.toThrow(
      NotFoundException,
    );
  });

  it("Todo를 삭제한다", async () => {
    const authorization = await signupAndLogin("todo_user", "user@example.com");
    await controller.create({ title: "삭제할 일" }, authorization);

    await expect(controller.delete("todo-1", authorization)).resolves.toBeUndefined();
    await expect(controller.list(authorization)).resolves.toEqual([]);
  });

  it("로그인하지 않은 요청은 거부한다", async () => {
    await expect(controller.list(undefined)).rejects.toThrow(UnauthorizedException);
  });

  it("다른 사용자의 Todo는 조회하거나 변경할 수 없다", async () => {
    const firstAuthorization = await signupAndLogin("first_user", "first@example.com");
    const secondAuthorization = await signupAndLogin("second_user", "second@example.com");

    await controller.create({ title: "첫 번째 사용자 Todo" }, firstAuthorization);
    await controller.create({ title: "두 번째 사용자 Todo" }, secondAuthorization);

    await expect(controller.list(firstAuthorization)).resolves.toMatchObject([
      {
        id: "todo-1",
        title: "첫 번째 사용자 Todo",
      },
    ]);
    await expect(controller.list(secondAuthorization)).resolves.toMatchObject([
      {
        id: "todo-2",
        title: "두 번째 사용자 Todo",
      },
    ]);
    await expect(
      controller.updateCompleted("todo-2", { completed: true }, firstAuthorization),
    ).rejects.toThrow(NotFoundException);
  });

  async function signupAndLogin(loginId: string, email: string): Promise<string> {
    await authController.signup({
      loginId,
      nickname: loginId,
      email,
      password: "password1",
      passwordConfirm: "password1",
    });
    const loginResult = await authController.login(
      { loginId, password: "password1" },
      {
        cookie: () => {},
        clearCookie: () => {},
      },
    );

    return `Bearer ${loginResult.accessToken}`;
  }
});
