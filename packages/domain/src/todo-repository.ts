import type { Todo, TodoId } from "./todo";

export interface TodoRepository {
  findMany(): Promise<Todo[]>;
  findById(id: TodoId): Promise<Todo | null>;
  create(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(id: TodoId): Promise<void>;
}
