import {
  AxiosError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { describe, expect, it } from "vitest";
import { createApiClient } from "./api-client";
import {
  ApiError,
  createTodo,
  deleteTodo,
  listTodos,
  updateTodoCompleted,
  type TodoDto,
} from "./todo-api";

function createMockAdapter(
  response: (config: InternalAxiosRequestConfig) => Partial<AxiosResponse>,
) {
  const requests: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (config) => {
    requests.push(config);

    return {
      config,
      data: undefined,
      headers: {},
      status: 200,
      statusText: "OK",
      ...response(config),
    } as AxiosResponse;
  };

  return { adapter, requests };
}

describe("todo-api", () => {
  it("Todo 목록을 조회한다", async () => {
    const todos: TodoDto[] = [
      {
        id: "todo-1",
        title: "장보기",
        completed: false,
        createdAt: "2026-05-13T09:00:00.000Z",
      },
    ];
    const { adapter, requests } = createMockAdapter(() => ({ data: todos }));
    const client = createApiClient();
    client.defaults.adapter = adapter;

    await expect(listTodos(client)).resolves.toEqual(todos);
    expect(requests[0]).toMatchObject({ method: "get", url: "/todos" });
  });

  it("Todo를 생성한다", async () => {
    const todo: TodoDto = {
      id: "todo-1",
      title: "장보기",
      completed: false,
      createdAt: "2026-05-13T09:00:00.000Z",
    };
    const { adapter, requests } = createMockAdapter(() => ({ data: todo, status: 201 }));
    const client = createApiClient();
    client.defaults.adapter = adapter;

    await expect(createTodo({ title: "장보기" }, client)).resolves.toEqual(todo);
    expect(requests[0]).toMatchObject({ method: "post", url: "/todos" });
    expect(JSON.parse(String(requests[0]?.data))).toEqual({ title: "장보기" });
  });

  it("Todo 완료 상태를 변경한다", async () => {
    const todo: TodoDto = {
      id: "todo-1",
      title: "장보기",
      completed: true,
      createdAt: "2026-05-13T09:00:00.000Z",
    };
    const { adapter, requests } = createMockAdapter(() => ({ data: todo }));
    const client = createApiClient();
    client.defaults.adapter = adapter;

    await expect(updateTodoCompleted("todo-1", { completed: true }, client)).resolves.toEqual(todo);
    expect(requests[0]).toMatchObject({ method: "patch", url: "/todos/todo-1/completed" });
    expect(JSON.parse(String(requests[0]?.data))).toEqual({ completed: true });
  });

  it("Todo를 삭제한다", async () => {
    const { adapter, requests } = createMockAdapter(() => ({ status: 204 }));
    const client = createApiClient();
    client.defaults.adapter = adapter;

    await expect(deleteTodo("todo-1", client)).resolves.toBeUndefined();
    expect(requests[0]).toMatchObject({ method: "delete", url: "/todos/todo-1" });
  });

  it("API 에러 응답을 공통 에러로 변환한다", async () => {
    const { adapter } = createMockAdapter((config) => ({
      config,
      data: { message: "할 일을 입력해 주세요." },
      status: 400,
      statusText: "Bad Request",
    }));
    const client = createApiClient();
    client.defaults.adapter = async (config) => {
      const response = await adapter(config);

      throw AxiosError.from(new Error("Bad Request"), undefined, config, undefined, response);
    };

    await expect(createTodo({ title: "" }, client)).rejects.toEqual(
      new ApiError("할 일을 입력해 주세요.", 400),
    );
  });
});
