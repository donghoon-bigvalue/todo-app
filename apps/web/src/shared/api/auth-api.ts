import type { AxiosInstance } from "axios";
import { apiClient, clearAccessToken, setAccessToken } from "./api-client";
import { ApiError } from "./todo-api";

export type AuthUserDto = {
  readonly id: string;
  readonly loginId: string;
  readonly nickname: string;
  readonly email: string;
};

export type SignupRequest = {
  readonly loginId: string;
  readonly nickname: string;
  readonly email: string;
  readonly password: string;
  readonly passwordConfirm: string;
};

export type SignupResponse = AuthUserDto & {
  readonly createdAt: string;
};

export type LoginRequest = {
  readonly loginId: string;
  readonly password: string;
};

export type LoginResponse = {
  readonly accessToken: string;
  readonly user: AuthUserDto;
};

export async function signup(
  input: SignupRequest,
  client: AxiosInstance = apiClient,
): Promise<SignupResponse> {
  const response = await client.post<SignupResponse>("/auth/signup", input);

  return response.data;
}

export async function login(
  input: LoginRequest,
  client: AxiosInstance = apiClient,
): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", input);

  if (!response.data.accessToken) {
    throw new ApiError("로그인 응답 형식이 올바르지 않습니다.", 0);
  }

  setAccessToken(response.data.accessToken);

  return response.data;
}

export async function refreshAccessToken(client: AxiosInstance = apiClient): Promise<string> {
  const response = await client.post<{ readonly accessToken: string }>("/auth/refresh");

  if (!response.data.accessToken) {
    throw new ApiError("Token refresh 응답 형식이 올바르지 않습니다.", 0);
  }

  setAccessToken(response.data.accessToken);

  return response.data.accessToken;
}

export async function logout(client: AxiosInstance = apiClient): Promise<void> {
  try {
    await client.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
}
