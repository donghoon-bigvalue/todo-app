// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TextInput } from "./text-input";

afterEach(() => {
  cleanup();
});

describe("TextInput", () => {
  it("textbox 요소로 렌더링한다", () => {
    render(<TextInput aria-label="할 일" placeholder="할 일을 입력하세요" />);

    expect(screen.getByRole("textbox", { name: "할 일" })).toBeInTheDocument();
  });

  it("에러 상태를 표현한다", () => {
    render(<TextInput aria-invalid aria-label="할 일" />);

    expect(screen.getByRole("textbox", { name: "할 일" })).toHaveClass("border-[#DC2626]");
  });
});
