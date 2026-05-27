// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { createQueryClient } from "./query-client";
import { routes } from "./routes";

vi.mock("../shared/api", () => ({
  clearAccessToken: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
  login: vi.fn(),
  logout: vi.fn(),
  refreshAccessToken: vi.fn().mockRejectedValue(new Error("refresh failed")),
  signup: vi.fn(),
  createTodo: vi.fn(),
  deleteTodo: vi.fn(),
  listTodos: vi.fn().mockResolvedValue([]),
  updateTodoCompleted: vi.fn(),
  updateTodoNote: vi.fn(),
}));

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const queryClient = createQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("Web app routing", () => {
  it("기본 경로에서 인증 화면을 보여준다", async () => {
    renderRoute("/");

    expect(await screen.findByRole("heading", { name: "로그인" })).toBeInTheDocument();
  });

  it("showcase 경로에서 디자인 시스템 showcase 화면을 보여준다", () => {
    renderRoute("/showcase");

    expect(screen.getByRole("heading", { name: "Showcase" })).toBeInTheDocument();
    expect(
      screen.getAllByText("우유, 계란, 커피 원두를 확인하고 필요한 것만 사기").length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("textbox", { name: "장보기 메모" })).toHaveValue(
      "우유, 계란, 커피 원두를 확인하고 필요한 것만 사기",
    );
  });
});
