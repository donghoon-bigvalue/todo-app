// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "../app/query-client";
import { TodoPage } from "./todo-page";

vi.mock("../shared/api", () => ({
  createTodo: vi.fn(),
  listTodos: vi.fn(),
}));

const { createTodo, listTodos } = await import("../shared/api");

function renderTodoPage() {
  const queryClient = createQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <TodoPage />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("TodoPage", () => {
  it("조회한 Todo 목록과 남은 할 일 개수를 보여준다", async () => {
    vi.mocked(listTodos).mockResolvedValue([
      {
        id: "todo-1",
        title: "장보기",
        completed: false,
        createdAt: "2026-05-13T09:00:00.000Z",
      },
      {
        id: "todo-2",
        title: "이메일 답장하기",
        completed: true,
        createdAt: "2026-05-13T10:00:00.000Z",
      },
    ]);

    renderTodoPage();

    expect(await screen.findByText("장보기")).toBeInTheDocument();
    expect(screen.getByText("이메일 답장하기")).toBeInTheDocument();
    expect(screen.getByText("남은 할 일 1개")).toBeInTheDocument();
  });

  it("Todo가 없으면 빈 상태를 보여준다", async () => {
    vi.mocked(listTodos).mockResolvedValue([]);

    renderTodoPage();

    expect(await screen.findByText("아직 할 일이 없습니다.")).toBeInTheDocument();
  });

  it("빈 제목으로 제출하면 에러 메시지를 보여준다", async () => {
    vi.mocked(listTodos).mockResolvedValue([]);

    renderTodoPage();
    await userEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("할 일을 입력해 주세요.")).toBeInTheDocument();
    expect(createTodo).not.toHaveBeenCalled();
  });

  it("Todo 입력 행을 Figma 화면 폭과 버튼 위치에 맞춘다", async () => {
    vi.mocked(listTodos).mockResolvedValue([]);

    renderTodoPage();

    const titleInput = screen.getByRole("textbox", { name: "할 일" });
    const submitButton = screen.getByRole("button", { name: "추가" });

    expect(await screen.findByText("아직 할 일이 없습니다.")).toBeInTheDocument();
    expect(titleInput.parentElement).toHaveClass("w-[250px]");
    expect(submitButton).toHaveClass("mt-[6px]", "w-[58px]");
  });

  it("유효한 제목을 제출하면 Todo를 생성하고 목록을 다시 조회한다", async () => {
    vi.mocked(listTodos)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: "todo-1",
          title: "장보기",
          completed: false,
          createdAt: "2026-05-13T09:00:00.000Z",
        },
      ]);
    vi.mocked(createTodo).mockResolvedValue({
      id: "todo-1",
      title: "장보기",
      completed: false,
      createdAt: "2026-05-13T09:00:00.000Z",
    });

    renderTodoPage();
    await userEvent.type(screen.getByRole("textbox", { name: "할 일" }), "  장보기  ");
    await userEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(createTodo).toHaveBeenCalledWith({ title: "장보기" });
    expect(await screen.findByText("장보기")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "할 일" })).toHaveValue("");
  });
});
