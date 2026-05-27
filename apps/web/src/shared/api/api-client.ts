import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const accessTokenStorageKey = "todo-app.access-token";
let memoryAccessToken = readStoredAccessToken();

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function createApiClient(baseURL = "/api"): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(undefined, async (error) => {
    const status = error.response?.status;
    const config = error.config as RetryableRequestConfig | undefined;

    if (status !== 401 || !config || config._retry || config.url === "/auth/refresh") {
      throw error;
    }

    const response = await client.post<{ readonly accessToken: string }>("/auth/refresh");
    setAccessToken(response.data.accessToken);
    config._retry = true;
    config.headers.Authorization = `Bearer ${response.data.accessToken}`;

    return client.request(config);
  });

  return client;
}

export const apiClient = createApiClient();

export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function setAccessToken(accessToken: string): void {
  memoryAccessToken = accessToken;
  globalThis.localStorage?.setItem(accessTokenStorageKey, accessToken);
}

export function clearAccessToken(): void {
  memoryAccessToken = null;
  globalThis.localStorage?.removeItem(accessTokenStorageKey);
}

function readStoredAccessToken(): string | null {
  return globalThis.localStorage?.getItem(accessTokenStorageKey) ?? null;
}
