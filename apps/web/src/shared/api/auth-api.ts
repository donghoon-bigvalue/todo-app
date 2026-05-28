import type { AxiosError, AxiosInstance } from "axios";
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
  return request(() => client.post<SignupResponse>("/auth/signup", input));
}

export async function login(
  input: LoginRequest,
  client: AxiosInstance = apiClient,
): Promise<LoginResponse> {
  const response = await request(() => client.post<LoginResponse>("/auth/login", input));

  if (!response.accessToken) {
    throw new ApiError("로그인 응답 형식이 올바르지 않습니다.", 0);
  }

  setAccessToken(response.accessToken);

  return response;
}

export async function refreshAccessToken(client: AxiosInstance = apiClient): Promise<string> {
  const response = await request(() =>
    client.post<{ readonly accessToken: string }>("/auth/refresh"),
  );

  if (!response.accessToken) {
    throw new ApiError("Token refresh 응답 형식이 올바르지 않습니다.", 0);
  }

  setAccessToken(response.accessToken);

  return response.accessToken;
}

export async function logout(client: AxiosInstance = apiClient): Promise<void> {
  try {
    await request(() => client.post("/auth/logout"));
  } finally {
    clearAccessToken();
  }
}

export async function requestFindLoginIdCode(
  input: EmailRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await request(() => client.post("/auth/find-login-id/request-code", input));
}

export async function verifyFindLoginIdCode(
  input: VerifyFindLoginIdRequest,
  client: AxiosInstance = apiClient,
): Promise<{ readonly loginId: string }> {
  return request(() =>
    client.post<{ readonly loginId: string }>("/auth/find-login-id/verify", input),
  );
}

export async function requestPasswordResetCode(
  input: EmailRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await request(() => client.post("/auth/reset-password/request-code", input));
}

export async function resetPassword(
  input: ResetPasswordRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  await request(() => client.post("/auth/reset-password/verify", input));
}

export async function changePassword(
  input: ChangePasswordRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  try {
    await request(() => client.patch("/auth/password", input));
  } finally {
    clearAccessToken();
  }
}

export async function deleteAccount(
  input: DeleteAccountRequest,
  client: AxiosInstance = apiClient,
): Promise<void> {
  try {
    await request(() => client.delete("/auth/account", { data: input }));
  } finally {
    clearAccessToken();
  }
}

async function request<T>(callback: () => Promise<{ readonly data: T }>): Promise<T> {
  try {
    const response = await callback();

    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

function toApiError(error: unknown): Error {
  const axiosError = error as AxiosError<{ readonly message?: unknown }>;
  const status = axiosError.response?.status;

  if (!status) {
    return error instanceof Error ? error : new Error("알 수 없는 오류가 발생했습니다.");
  }

  return new ApiError(toErrorMessage(axiosError.response?.data?.message), status);
}

function toErrorMessage(message: unknown): string {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item === "object" && item && "message" in item) {
          return String(item.message);
        }

        return String(item);
      })
      .join("\n");
  }

  return "요청을 처리하지 못했습니다.";
}
