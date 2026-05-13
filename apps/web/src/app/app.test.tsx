// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { createQueryClient } from "./query-client";
import { routes } from "./routes";

vi.mock("../shared/api", () => ({
  listTodos: vi.fn().mockResolvedValue([]),
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
  it("기본 경로에서 Todo 앱 화면을 보여준다", () => {
    renderRoute("/");

    expect(screen.getByRole("heading", { name: "할 일 체크리스트" })).toBeInTheDocument();
  });

  it("showcase 경로에서 디자인 시스템 showcase 화면을 보여준다", () => {
    renderRoute("/showcase");

    expect(screen.getByRole("heading", { name: "Showcase" })).toBeInTheDocument();
  });
});
