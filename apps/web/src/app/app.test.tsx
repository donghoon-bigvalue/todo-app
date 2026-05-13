// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { routes } from "./routes";

describe("Web app routing", () => {
  it("기본 경로에서 Todo 앱 화면을 보여준다", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: "Todo App" })).toBeInTheDocument();
  });

  it("showcase 경로에서 디자인 시스템 showcase 화면을 보여준다", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/showcase"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: "Showcase" })).toBeInTheDocument();
  });
});
