import { describe, expect, it } from "vitest";
import { MAX_TODO_NOTE_LENGTH, todoNoteSchema } from "./todo-note-schema";

describe("todoNoteSchema", () => {
  it("앞뒤 공백을 제거하고 줄바꿈은 유지한다", () => {
    const note = todoNoteSchema.parse("  첫 줄\n둘째 줄  ");

    expect(note).toBe("첫 줄\n둘째 줄");
  });

  it("빈 문자열은 메모 없음으로 정리한다", () => {
    expect(todoNoteSchema.parse("")).toBeNull();
  });

  it("공백만 있는 메모는 메모 없음으로 정리한다", () => {
    expect(todoNoteSchema.parse("   \t\n  ")).toBeNull();
  });

  it("null과 undefined는 메모 없음으로 정리한다", () => {
    expect(todoNoteSchema.parse(null)).toBeNull();
    expect(todoNoteSchema.parse(undefined)).toBeNull();
  });

  it("최대 길이까지의 메모는 허용한다", () => {
    const note = "가".repeat(MAX_TODO_NOTE_LENGTH);

    expect(todoNoteSchema.parse(note)).toBe(note);
  });

  it("최대 길이를 넘는 메모는 거부한다", () => {
    const note = "가".repeat(MAX_TODO_NOTE_LENGTH + 1);
    const result = todoNoteSchema.safeParse(note);

    expect(result.success).toBe(false);
  });
});
