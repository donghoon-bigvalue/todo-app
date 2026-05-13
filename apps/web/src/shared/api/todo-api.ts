import type { AxiosError, AxiosInstance } from "axios";
import { apiClient } from "./api-client";

export type TodoDto = {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly createdAt: string;
};

export type CreateTodoRequest = {
  readonly title: string;
};

export type UpdateTodoCompletedRequest = {
  readonly completed: boolean;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function listTodos(client: AxiosInstance = apiClient): Promise<TodoDto[]> {
  return request(() => client.get<TodoDto[]>("/todos"));
}

export async function createTodo(
  input: CreateTodoRequest,
  client: AxiosInstance = apiClient,
): Promise<TodoDto> {
  return request(() => client.post<TodoDto>("/todos", input));
}

export async function updateTodoCompleted(
  id: string,
  input: UpdateTodoCompletedRequest,
  client: AxiosInstance = apiClient,
): Promise<TodoDto> {
  return request(() => client.patch<TodoDto>(`/todos/${id}/completed`, input));
}

export async function deleteTodo(id: string, client: AxiosInstance = apiClient): Promise<void> {
  await request(() => client.delete(`/todos/${id}`));
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
