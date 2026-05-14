import { describe, expect, it } from "vitest";
import { Todo, type TodoSnapshot, createTodoId } from "./todo";

describe("Todo", () => {
  it("주어진 id, title, createdAt으로 미완료 Todo를 생성한다", () => {
    const createdAt = new Date("2026-05-13T09:00:00.000Z");
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "첫 번째 할 일",
      createdAt,
    });

    expect(todo.toSnapshot()).toEqual<TodoSnapshot>({
      id: createTodoId("todo-1"),
      title: "첫 번째 할 일",
      completed: false,
      note: null,
      createdAt,
    });
  });

  it("기존 Todo snapshot을 복원한다", () => {
    const todo = Todo.restore({
      id: createTodoId("todo-1"),
      title: "완료된 할 일",
      completed: true,
      note: "답장 전에 첨부 파일 확인",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    expect(todo.completed).toBe(true);
    expect(todo.note).toBe("답장 전에 첨부 파일 확인");
  });

  it("도메인 동작으로 완료 상태를 변경한다", () => {
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "상태 변경할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    todo.complete();
    expect(todo.completed).toBe(true);

    todo.reopen();
    expect(todo.completed).toBe(false);

    todo.toggleCompleted();
    expect(todo.completed).toBe(true);
  });

  it("도메인 동작으로 메모를 변경하고 비운다", () => {
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "메모를 남길 할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    todo.updateNote("우유, 계란, 커피 원두 확인");
    expect(todo.note).toBe("우유, 계란, 커피 원두 확인");

    todo.clearNote();
    expect(todo.note).toBeNull();
  });

  it("createdAt이 외부 변경의 영향을 받지 않게 보호한다", () => {
    const createdAt = new Date("2026-05-13T09:00:00.000Z");
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "날짜가 있는 할 일",
      createdAt,
    });

    createdAt.setFullYear(1999);
    const snapshot = todo.toSnapshot();
    snapshot.createdAt.setFullYear(2000);

    expect(todo.createdAt).toEqual(new Date("2026-05-13T09:00:00.000Z"));
  });
});
