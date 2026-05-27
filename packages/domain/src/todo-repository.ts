import type { Todo, TodoId } from "./todo";
import type { UserId } from "./user";

export interface TodoRepository {
  findMany(): Promise<Todo[]>;
  findById(id: TodoId): Promise<Todo | null>;
  create(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(id: TodoId): Promise<void>;
}

export interface UserScopedTodoRepository {
  findManyByUserId(userId: UserId): Promise<Todo[]>;
  findByIdForUser(id: TodoId, userId: UserId): Promise<Todo | null>;
  createForUser(todo: Todo, userId: UserId): Promise<void>;
}
