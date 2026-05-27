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

export type EmailRequest = {
  readonly email: string;
};

export type VerifyFindLoginIdRequest = EmailRequest & {
  readonly code: string;
};

export type ResetPasswordRequest = VerifyFindLoginIdRequest & {
  readonly password: string;
  readonly passwordConfirm: string;
};

export type ChangePasswordRequest = {
  readonly currentPassword: string;
  readonly password: string;
  readonly passwordConfirm: string;
};

export type DeleteAccountRequest = {
  readonly password: string;
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

export async function requestFindLoginIdCode(
  input: EmailRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await client.post("/auth/find-login-id/request-code", input);
}

export async function verifyFindLoginIdCode(
  input: VerifyFindLoginIdRequest,
  client: AxiosInstance = apiClient,
): Promise<{ readonly loginId: string }> {
  const response = await client.post<{ readonly loginId: string }>(
    "/auth/find-login-id/verify",
    input,
  );

  return response.data;
}

export async function requestPasswordResetCode(
  input: EmailRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await client.post("/auth/reset-password/request-code", input);
}

export async function resetPassword(
  input: ResetPasswordRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await client.post("/auth/reset-password/verify", input);
}

export async function changePassword(
  input: ChangePasswordRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  try {
    await client.patch("/auth/password", input);
  } finally {
    clearAccessToken();
  }
}

export async function deleteAccount(
  input: DeleteAccountRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  try {
    await client.delete("/auth/account", { data: input });
  } finally {
    clearAccessToken();
  }
}
