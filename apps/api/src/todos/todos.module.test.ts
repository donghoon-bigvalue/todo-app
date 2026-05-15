import {
  CREATE_TODO_USE_CASE,
  DELETE_TODO_USE_CASE,
  LIST_TODOS_USE_CASE,
  UPDATE_TODO_COMPLETED_USE_CASE,
  UPDATE_TODO_NOTE_USE_CASE,
} from "./todos.tokens";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";
import { TodosModule } from "./todos.module";

describe("TodosModule 구조", () => {
  it("Todo use case provider 경계를 구성한다", async () => {
    const module = await Test.createTestingModule({
      imports: [TodosModule],
    }).compile();

    expect(module.get(LIST_TODOS_USE_CASE)).toBeDefined();
    expect(module.get(CREATE_TODO_USE_CASE)).toBeDefined();
    expect(module.get(UPDATE_TODO_COMPLETED_USE_CASE)).toBeDefined();
    expect(module.get(UPDATE_TODO_NOTE_USE_CASE)).toBeDefined();
    expect(module.get(DELETE_TODO_USE_CASE)).toBeDefined();

    await module.close();
  });
});
