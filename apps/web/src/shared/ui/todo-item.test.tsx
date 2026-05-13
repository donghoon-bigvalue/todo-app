// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TodoItem } from "./todo-item";

afterEach(() => {
  cleanup();
});

describe("TodoItem", () => {
  it("미완료 Todo 항목을 렌더링한다", () => {
    render(<TodoItem completed={false} title="장보기" />);

    expect(screen.getByText("장보기")).toHaveClass("text-[#1F2937]");
    expect(screen.getByRole("checkbox", { name: "장보기 완료 처리" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "장보기 삭제" })).toBeInTheDocument();
  });

  it("완료 Todo 항목은 낮은 강조도와 취소선으로 렌더링한다", () => {
    render(<TodoItem completed title="이메일 답장하기" />);

    expect(screen.getByText("이메일 답장하기")).toHaveClass("text-[#6B7280]", "line-through");
    expect(screen.getByRole("checkbox", { name: "이메일 답장하기 완료 취소" })).toBeChecked();
  });

  it("상태 변경과 삭제 동작을 전달한다", () => {
    const onCompletedChange = vi.fn();
    const onDelete = vi.fn();
    render(
      <TodoItem
        completed={false}
        onCompletedChange={onCompletedChange}
        onDelete={onDelete}
        title="장보기"
      />,
    );

    screen.getByRole("checkbox", { name: "장보기 완료 처리" }).click();
    screen.getByRole("button", { name: "장보기 삭제" }).click();

    expect(onCompletedChange).toHaveBeenCalledWith(true);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
