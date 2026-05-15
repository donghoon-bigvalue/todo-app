// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

  it("메모가 있으면 제목 아래에 2줄 표시 영역과 수정 버튼을 렌더링한다", () => {
    const onNoteEdit = vi.fn();

    render(
      <TodoItem
        completed={false}
        note="우유, 계란, 커피 원두를 확인하고 필요한 것만 사기"
        onNoteEdit={onNoteEdit}
        title="장보기"
      />,
    );

    expect(screen.getByText("우유, 계란, 커피 원두를 확인하고 필요한 것만 사기")).toHaveClass(
      "line-clamp-2",
      "text-[#6B7280]",
    );

    screen.getByRole("button", { name: "장보기 메모 수정" }).click();
    expect(onNoteEdit).toHaveBeenCalledTimes(1);
  });

  it("메모가 없으면 메모 추가 버튼만 렌더링한다", () => {
    render(<TodoItem completed={false} onNoteEdit={vi.fn()} title="장보기" />);

    expect(screen.getByRole("button", { name: "장보기 메모 추가" })).toBeInTheDocument();
    expect(screen.queryByText("우유, 계란, 커피 원두를 확인하고 필요한 것만 사기")).toBeNull();
  });

  it("메모 편집 상태에서는 textarea와 저장, 취소 동작을 렌더링한다", () => {
    const onNoteChange = vi.fn();
    const onNoteSave = vi.fn();
    const onNoteCancel = vi.fn();

    render(
      <TodoItem
        completed={false}
        isNoteEditing
        note="기존 메모"
        noteDraft="수정 중인 메모"
        onNoteCancel={onNoteCancel}
        onNoteChange={onNoteChange}
        onNoteSave={onNoteSave}
        title="장보기"
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "장보기 메모" });
    expect(textarea).toHaveValue("수정 중인 메모");
    expect(textarea).toHaveClass("h-[66px]", "w-[264px]");

    fireEvent.change(textarea, { target: { value: "새 메모" } });
    screen.getByRole("button", { name: "장보기 메모 저장" }).click();
    screen.getByRole("button", { name: "장보기 메모 취소" }).click();

    expect(onNoteChange).toHaveBeenCalledWith("새 메모");
    expect(onNoteSave).toHaveBeenCalledTimes(1);
    expect(onNoteCancel).toHaveBeenCalledTimes(1);
  });
});
