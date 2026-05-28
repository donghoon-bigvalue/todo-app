// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormField, PasswordInput, TextAction } from "./auth-form-controls";

afterEach(() => {
  cleanup();
});

describe("Auth form controls", () => {
  it("label과 placeholder를 가진 form field를 렌더링한다", () => {
    render(
      <FormField label="로그인 ID" onChange={() => undefined} placeholder="todo_user" value="" />,
    );

    expect(screen.getByRole("textbox", { name: "로그인 ID" })).toHaveAttribute(
      "placeholder",
      "todo_user",
    );
  });

  it("password input은 표시 토글로 입력 타입을 바꾼다", async () => {
    render(<PasswordInput aria-label="비밀번호" onChange={() => undefined} value="" />);

    const passwordInput = screen.getByLabelText("비밀번호");
    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "표시" }));

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "숨김" })).toBeInTheDocument();
  });

  it("text action은 button으로 동작한다", async () => {
    const handleClick = vi.fn();

    render(<TextAction onClick={handleClick}>로그인으로 돌아가기</TextAction>);
    await userEvent.click(screen.getByRole("button", { name: "로그인으로 돌아가기" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
