import { AxiosError, type AxiosAdapter, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it } from "vitest";
import { clearAccessToken, createApiClient, getAccessToken, setAccessToken } from "./api-client";
import { login, logout, refreshAccessToken, signup } from "./auth-api";

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
