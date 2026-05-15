import { describe, expect, it } from "vitest";
import { Todo, type TodoId, type TodoSnapshot, createTodoId } from "./todo";
import type { TodoRepository } from "./todo-repository";
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  ListTodosUseCase,
  TodoNotFoundError,
  UpdateTodoCompletedUseCase,
  UpdateTodoNoteUseCase,
} from "./todo-use-cases";

class FakeTodoRepository implements TodoRepository {
  readonly #todos = new Map<TodoId, TodoSnapshot>();

  constructor(todos: Todo[] = []) {
    for (const todo of todos) {
      this.#todos.set(todo.id, todo.toSnapshot());
    }
  }

  async findMany(): Promise<Todo[]> {
    return [...this.#todos.values()].map((snapshot) => Todo.restore(snapshot));
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const snapshot = this.#todos.get(id);

    return snapshot ? Todo.restore(snapshot) : null;
  }

  async create(todo: Todo): Promise<void> {
    this.#todos.set(todo.id, todo.toSnapshot());
  }

  async update(todo: Todo): Promise<void> {
    this.#todos.set(todo.id, todo.toSnapshot());
  }

  async delete(id: TodoId): Promise<void> {
    this.#todos.delete(id);
  }
}

describe("Todo use cases", () => {
  it("Todo 목록을 조회한다", async () => {
    const repository = new FakeTodoRepository([
      Todo.create({
        id: createTodoId("todo-1"),
        title: "첫 번째 할 일",
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      }),
    ]);
    const useCase = new ListTodosUseCase(repository);

    const todos = await useCase.execute();

    expect(todos.map((todo) => todo.toSnapshot())).toEqual([
      {
        id: createTodoId("todo-1"),
        title: "첫 번째 할 일",
        completed: false,
        note: null,
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      },
    ]);
  });

  it("제목을 검증하고 정리해 Todo를 생성한다", async () => {
    const repository = new FakeTodoRepository();
    const useCase = new CreateTodoUseCase(repository, {
      generateId: () => createTodoId("todo-1"),
      now: () => new Date("2026-05-13T09:00:00.000Z"),
    });

    const todo = await useCase.execute({ title: "  첫   번째 할 일  " });

    expect(todo.toSnapshot()).toEqual({
      id: createTodoId("todo-1"),
      title: "첫 번째 할 일",
      completed: false,
      note: null,
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    await expect(repository.findById(createTodoId("todo-1"))).resolves.not.toBeNull();
  });

  it("Todo 완료 상태를 지정한 값으로 변경한다", async () => {
    const id = createTodoId("todo-1");
    const repository = new FakeTodoRepository([
      Todo.create({
        id,
        title: "완료할 일",
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      }),
    ]);
    const useCase = new UpdateTodoCompletedUseCase(repository);

    const todo = await useCase.execute({ id, completed: true });

    expect(todo.completed).toBe(true);
    await expect(repository.findById(id)).resolves.toMatchObject({ completed: true });
  });

  it("없는 Todo의 완료 상태를 변경하려 하면 에러를 던진다", async () => {
    const repository = new FakeTodoRepository();
    const useCase = new UpdateTodoCompletedUseCase(repository);

    await expect(useCase.execute({ id: createTodoId("missing"), completed: true })).rejects.toThrow(
      TodoNotFoundError,
    );
  });

  it("Todo 메모를 검증하고 수정한다", async () => {
    const id = createTodoId("todo-1");
    const repository = new FakeTodoRepository([
      Todo.create({
        id,
        title: "메모할 일",
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      }),
    ]);
    const useCase = new UpdateTodoNoteUseCase(repository);

    const todo = await useCase.execute({ id, note: "  첫 줄\n둘째 줄  " });

    expect(todo.note).toBe("첫 줄\n둘째 줄");
    await expect(repository.findById(id)).resolves.toMatchObject({ note: "첫 줄\n둘째 줄" });
  });

  it("빈 Todo 메모는 메모 없음으로 정리한다", async () => {
    const id = createTodoId("todo-1");
    const todo = Todo.create({
      id,
      title: "메모를 비울 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    todo.updateNote("기존 메모");
    const repository = new FakeTodoRepository([todo]);
    const useCase = new UpdateTodoNoteUseCase(repository);

    const updatedTodo = await useCase.execute({ id, note: "   \n  " });

    expect(updatedTodo.note).toBeNull();
    await expect(repository.findById(id)).resolves.toMatchObject({ note: null });
  });

  it("없는 Todo의 메모를 수정하려 하면 에러를 던진다", async () => {
    const repository = new FakeTodoRepository();
    const useCase = new UpdateTodoNoteUseCase(repository);

    await expect(useCase.execute({ id: createTodoId("missing"), note: "메모" })).rejects.toThrow(
      TodoNotFoundError,
    );
  });

  it("Todo를 삭제한다", async () => {
    const id = createTodoId("todo-1");
    const repository = new FakeTodoRepository([
      Todo.create({
        id,
        title: "삭제할 일",
        createdAt: new Date("2026-05-13T09:00:00.000Z"),
      }),
    ]);
    const useCase = new DeleteTodoUseCase(repository);

    await useCase.execute({ id });

    await expect(repository.findById(id)).resolves.toBeNull();
  });

  it("없는 Todo를 삭제하려 하면 에러를 던진다", async () => {
    const repository = new FakeTodoRepository();
    const useCase = new DeleteTodoUseCase(repository);

    await expect(useCase.execute({ id: createTodoId("missing") })).rejects.toThrow(
      TodoNotFoundError,
    );
  });
});
