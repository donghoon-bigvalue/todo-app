import { describe, expect, it } from "vitest";
import { MAX_TODO_TITLE_LENGTH, todoTitleSchema } from "./todo-title-schema";

describe("todoTitleSchema", () => {
  it("앞뒤 공백을 제거하고 연속된 공백을 하나로 정리한다", () => {
    const title = todoTitleSchema.parse("  첫   번째\t할 일\n작성  ");

    expect(title).toBe("첫 번째 할 일 작성");
  });

  it("공백만 있는 제목은 거부한다", () => {
    const result = todoTitleSchema.safeParse("   \t\n  ");

    expect(result.success).toBe(false);
  });

  it("최대 길이까지의 제목은 허용한다", () => {
    const title = "가".repeat(MAX_TODO_TITLE_LENGTH);

    expect(todoTitleSchema.parse(title)).toBe(title);
  });

  it("최대 길이를 넘는 제목은 거부한다", () => {
    const title = "가".repeat(MAX_TODO_TITLE_LENGTH + 1);
    const result = todoTitleSchema.safeParse(title);

    expect(result.success).toBe(false);
  });
});
