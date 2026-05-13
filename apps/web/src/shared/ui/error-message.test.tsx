// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorMessage } from "./error-message";

describe("ErrorMessage", () => {
  it("에러 메시지를 danger 색상으로 렌더링한다", () => {
    render(<ErrorMessage>할 일을 입력해주세요.</ErrorMessage>);

    expect(screen.getByText("할 일을 입력해주세요.")).toHaveClass("text-[#DC2626]");
  });
});
