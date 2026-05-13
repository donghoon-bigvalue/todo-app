// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("button 요소로 렌더링한다", () => {
    render(<Button>추가</Button>);

    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
  });

  it("variant에 맞는 className을 적용한다", () => {
    render(<Button variant="danger">삭제</Button>);

    expect(screen.getByRole("button", { name: "삭제" })).toHaveClass("bg-[#DC2626]");
  });

  it("비활성 상태를 표현한다", () => {
    render(<Button disabled>추가</Button>);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "추가" })).toHaveClass("disabled:bg-[#F3F4F6]");
  });
});
