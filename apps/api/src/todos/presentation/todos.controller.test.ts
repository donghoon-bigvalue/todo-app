import { createTodoId, type TodoUseCaseDependencies } from "@todo-app/domain";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TODO_USE_CASE_DEPENDENCIES } from "../todos.tokens";
import { TodosModule } from "../todos.module";
import { TodosController } from "./todos.controller";

describe("TodosController", () => {
  let module: TestingModule;
  let controller: TodosController;
  let nextId = 1;

  beforeEach(async () => {
    nextId = 1;

    module = await Test.createTestingModule({
      imports: [TodosModule],
    })
      .overrideProvider(TODO_USE_CASE_DEPENDENCIES)
      .useValue({
        generateId: () => createTodoId(`todo-${nextId++}`),
        now: () => new Date("2026-05-13T09:00:00.000Z"),
      } satisfies TodoUseCaseDependencies)
      .compile();

    controller = module.get(TodosController);
  });

  afterEach(async () => {
    await module.close();
  });

  it("Todo를 생성하고 목록에서 조회한다", async () => {
    await expect(controller.create({ title: "  첫   번째 할 일  " })).resolves.toEqual({
      id: "todo-1",
      title: "첫 번째 할 일",
      completed: false,
      createdAt: "2026-05-13T09:00:00.000Z",
    });

    await expect(controller.list()).resolves.toEqual([
      {
        id: "todo-1",
        title: "첫 번째 할 일",
        completed: false,
        createdAt: "2026-05-13T09:00:00.000Z",
      },
    ]);
  });

  it("빈 제목으로 Todo 생성을 요청하면 BadRequestException을 던진다", async () => {
    await expect(controller.create({ title: "   " })).rejects.toThrow(BadRequestException);
  });

  it("Todo 완료 상태를 변경한다", async () => {
    await controller.create({ title: "완료할 일" });

    await expect(controller.updateCompleted("todo-1", { completed: true })).resolves.toEqual({
      id: "todo-1",
      title: "완료할 일",
      completed: true,
      createdAt: "2026-05-13T09:00:00.000Z",
    });
  });

  it("없는 Todo의 완료 상태를 변경하려 하면 NotFoundException을 던진다", async () => {
    await expect(controller.updateCompleted("missing", { completed: true })).rejects.toThrow(
      NotFoundException,
    );
  });

  it("Todo를 삭제한다", async () => {
    await controller.create({ title: "삭제할 일" });

    await expect(controller.delete("todo-1")).resolves.toBeUndefined();
    await expect(controller.list()).resolves.toEqual([]);
  });
});
