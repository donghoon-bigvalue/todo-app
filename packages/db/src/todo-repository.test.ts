import { Todo, createTodoId } from "@todo-app/domain";
import { describe, expect, it } from "vitest";
import { createDrizzleClient, createInMemoryPglite } from "./client";
import { applyMigrations } from "./migrate";
import { DrizzleTodoRepository } from "./todo-repository";

const migrationsFolder = "packages/db/drizzle";

async function createRepository() {
  const pglite = createInMemoryPglite();
  const db = createDrizzleClient(pglite);

  await applyMigrations(db, { migrationsFolder });

  return {
    pglite,
    repository: new DrizzleTodoRepository(db),
  };
}

describe("DrizzleTodoRepository", () => {
  it("Todo를 생성하고 id로 조회한다", async () => {
    const { pglite, repository } = await createRepository();
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "첫 번째 할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    await repository.create(todo);

    await expect(repository.findById(createTodoId("todo-1"))).resolves.toEqual(todo);
    await pglite.close();
  });

  it("Todo 목록을 생성일 오름차순으로 조회한다", async () => {
    const { pglite, repository } = await createRepository();
    const laterTodo = Todo.create({
      id: createTodoId("todo-2"),
      title: "나중에 만든 할 일",
      createdAt: new Date("2026-05-13T10:00:00.000Z"),
    });
    const earlierTodo = Todo.create({
      id: createTodoId("todo-1"),
      title: "먼저 만든 할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });

    await repository.create(laterTodo);
    await repository.create(earlierTodo);

    await expect(repository.findMany()).resolves.toEqual([earlierTodo, laterTodo]);
    await pglite.close();
  });

  it("Todo 완료 상태를 저장한다", async () => {
    const { pglite, repository } = await createRepository();
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "완료할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    await repository.create(todo);

    todo.complete();
    await repository.update(todo);

    await expect(repository.findById(createTodoId("todo-1"))).resolves.toMatchObject({
      completed: true,
    });
    await pglite.close();
  });

  it("Todo 메모를 저장하고 조회한다", async () => {
    const { pglite, repository } = await createRepository();
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "메모가 있는 할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    todo.updateNote("우유, 계란, 커피 원두 확인");

    await repository.create(todo);

    const foundTodo = await repository.findById(createTodoId("todo-1"));

    expect(foundTodo?.toSnapshot().note).toBe("우유, 계란, 커피 원두 확인");
    await pglite.close();
  });

  it("Todo 메모를 수정하고 비운다", async () => {
    const { pglite, repository } = await createRepository();
    const todo = Todo.create({
      id: createTodoId("todo-1"),
      title: "메모를 수정할 할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    await repository.create(todo);

    todo.updateNote("처음 메모");
    await repository.update(todo);

    const updatedTodo = await repository.findById(createTodoId("todo-1"));
    expect(updatedTodo?.toSnapshot().note).toBe("처음 메모");

    todo.clearNote();
    await repository.update(todo);

    const clearedTodo = await repository.findById(createTodoId("todo-1"));
    expect(clearedTodo?.toSnapshot().note).toBeNull();
    await pglite.close();
  });

  it("Todo를 삭제한다", async () => {
    const { pglite, repository } = await createRepository();
    const id = createTodoId("todo-1");
    const todo = Todo.create({
      id,
      title: "삭제할 일",
      createdAt: new Date("2026-05-13T09:00:00.000Z"),
    });
    await repository.create(todo);

    await repository.delete(id);

    await expect(repository.findById(id)).resolves.toBeNull();
    await pglite.close();
  });
});
