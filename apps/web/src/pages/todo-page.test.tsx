// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createQueryClient } from "../app/query-client";
import { TodoPage } from "./todo-page";

vi.mock("../shared/api", () => ({
  listTodos: vi.fn(),
}));

const { listTodos } = await import("../shared/api");

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
});
