import { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import { clearAccessToken, createApiClient, getAccessToken, setAccessToken } from "./api-client";
import {
  changePassword,
  deleteAccount,
  login,
  logout,
  refreshAccessToken,
  requestFindLoginIdCode,
  requestPasswordResetCode,
  resetPassword,
  signup,
  verifyFindLoginIdCode,
} from "./auth-api";

function createMockAdapter(response: AxiosAdapter): AxiosAdapter {
  return response;
}

describe("auth-api", () => {
  beforeEach(() => {
    clearAccessToken();
  });

  it("회원가입한다", async () => {
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/signup");

      return {
        config,
        data: {
          id: "user-1",
          loginId: "todo_user",
          nickname: "도훈",
          email: "user@example.com",
          createdAt: "2026-05-27T08:00:00.000Z",
        },
        headers: {},
        status: 201,
        statusText: "Created",
      } as AxiosResponse;
    });

    await expect(
      signup(
        {
          loginId: "todo_user",
          nickname: "도훈",
          email: "user@example.com",
          password: "password1",
          passwordConfirm: "password1",
        },
        client,
      ),
    ).resolves.toMatchObject({ loginId: "todo_user" });
  });

  it("회원가입 검증 실패 메시지를 유지한다", async () => {
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      const response = {
        config,
        data: {
          message: [
            {
              message: "로그인 ID는 영문, 숫자, _, -만 사용할 수 있습니다.",
            },
          ],
        },
        headers: {},
        status: 400,
        statusText: "Bad Request",
      } as AxiosResponse;

      throw AxiosError.from(new Error("Bad Request"), undefined, config, undefined, response);
    });

    await expect(
      signup(
        {
          loginId: "user@example.com",
          nickname: "도훈",
          email: "user@example.com",
          password: "password1",
          passwordConfirm: "password1",
        },
        client,
      ),
    ).rejects.toThrow("로그인 ID는 영문, 숫자, _, -만 사용할 수 있습니다.");
  });

  it("로그인하면 access token을 저장한다", async () => {
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/login");

      return {
        config,
        data: {
          accessToken: "access-token",
          user: {
            id: "user-1",
            loginId: "todo_user",
            nickname: "도훈",
            email: "user@example.com",
          },
        },
        headers: {},
        status: 200,
        statusText: "OK",
      } as AxiosResponse;
    });

    await login({ loginId: "todo_user", password: "password1" }, client);

    expect(getAccessToken()).toBe("access-token");
  });

  it("refresh로 access token을 갱신한다", async () => {
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/refresh");

      return {
        config,
        data: { accessToken: "new-access-token" },
        headers: {},
        status: 200,
        statusText: "OK",
      } as AxiosResponse;
    });

    await expect(refreshAccessToken(client)).resolves.toBe("new-access-token");
    expect(getAccessToken()).toBe("new-access-token");
  });

  it("로그아웃하면 access token을 지운다", async () => {
    setAccessToken("access-token");
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/logout");

      return {
        config,
        data: undefined,
        headers: {},
        status: 204,
        statusText: "No Content",
      } as AxiosResponse;
    });

    await logout(client);

    expect(getAccessToken()).toBeNull();
  });

  it("아이디 찾기 인증 코드를 요청하고 확인한다", async () => {
    const requestedUrls: string[] = [];
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      requestedUrls.push(config.url ?? "");

      return {
        config,
        data:
          config.url === "/auth/find-login-id/verify" ? { loginId: "todo_user" } : { sent: true },
        headers: {},
        status: 200,
        statusText: "OK",
      } as AxiosResponse;
    });

    await requestFindLoginIdCode({ email: "user@example.com" }, client);
    await expect(
      verifyFindLoginIdCode({ email: "user@example.com", code: "333333" }, client),
    ).resolves.toEqual({ loginId: "todo_user" });
    expect(requestedUrls).toEqual([
      "/auth/find-login-id/request-code",
      "/auth/find-login-id/verify",
    ]);
  });

  it("비밀번호 재설정 인증 코드를 요청하고 새 비밀번호를 저장한다", async () => {
    const requestedUrls: string[] = [];
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      requestedUrls.push(config.url ?? "");

      return {
        config,
        data: config.url === "/auth/reset-password/request-code" ? { sent: true } : undefined,
        headers: {},
        status: config.url === "/auth/reset-password/verify" ? 204 : 200,
        statusText: "OK",
      } as AxiosResponse;
    });

    await requestPasswordResetCode({ email: "user@example.com" }, client);
    await resetPassword(
      {
        email: "user@example.com",
        code: "333333",
        password: "new-password1",
        passwordConfirm: "new-password1",
      },
      client,
    );
    expect(requestedUrls).toEqual([
      "/auth/reset-password/request-code",
      "/auth/reset-password/verify",
    ]);
  });

  it("로그인 후 비밀번호를 변경하면 access token을 지운다", async () => {
    setAccessToken("access-token");
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/password");

      return {
        config,
        data: undefined,
        headers: {},
        status: 204,
        statusText: "No Content",
      } as AxiosResponse;
    });

    await changePassword(
      {
        currentPassword: "password1",
        password: "new-password1",
        passwordConfirm: "new-password1",
      },
      client,
    );

    expect(getAccessToken()).toBeNull();
  });

  it("회원탈퇴하면 access token을 지운다", async () => {
    setAccessToken("access-token");
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      expect(config.url).toBe("/auth/account");

      return {
        config,
        data: undefined,
        headers: {},
        status: 204,
        statusText: "No Content",
      } as AxiosResponse;
    });

    await deleteAccount({ password: "password1" }, client);

    expect(getAccessToken()).toBeNull();
  });

  it("API client가 access token을 첨부하고 401이면 refresh 후 재시도한다", async () => {
    setAccessToken("old-access-token");
    const requestedAuthHeaders: unknown[] = [];
    const client = createApiClient();
    client.defaults.adapter = createMockAdapter(async (config) => {
      requestedAuthHeaders.push(config.headers.Authorization);

      if (config.url === "/todos" && requestedAuthHeaders.length === 1) {
        const response = {
          config,
          data: { message: "Unauthorized" },
          headers: {},
          status: 401,
          statusText: "Unauthorized",
        } as AxiosResponse;

        throw AxiosError.from(new Error("Unauthorized"), undefined, config, undefined, response);
      }

      if (config.url === "/auth/refresh") {
        return {
          config,
          data: { accessToken: "new-access-token" },
          headers: {},
          status: 200,
          statusText: "OK",
        } as AxiosResponse;
      }

      return {
        config,
        data: [],
        headers: {},
        status: 200,
        statusText: "OK",
      } as AxiosResponse;
    });

    await expect(client.get("/todos")).resolves.toMatchObject({ data: [] });
    expect(requestedAuthHeaders).toEqual([
      "Bearer old-access-token",
      "Bearer old-access-token",
      "Bearer new-access-token",
    ]);
  });
});
