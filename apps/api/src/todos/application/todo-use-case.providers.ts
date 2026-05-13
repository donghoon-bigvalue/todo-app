import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  ListTodosUseCase,
  UpdateTodoCompletedUseCase,
  createTodoId,
  type TodoRepository,
  type TodoUseCaseDependencies,
} from "@todo-app/domain";
import { randomUUID } from "node:crypto";
import type { Provider } from "@nestjs/common";
import {
  CREATE_TODO_USE_CASE,
  DELETE_TODO_USE_CASE,
  LIST_TODOS_USE_CASE,
  TODO_REPOSITORY,
  TODO_USE_CASE_DEPENDENCIES,
  UPDATE_TODO_COMPLETED_USE_CASE,
} from "../todos.tokens";

export const todoUseCaseProviders: Provider[] = [
  {
    provide: TODO_USE_CASE_DEPENDENCIES,
    useValue: {
      generateId: () => createTodoId(randomUUID()),
      now: () => new Date(),
    } satisfies TodoUseCaseDependencies,
  },
  {
    provide: LIST_TODOS_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepository) => new ListTodosUseCase(repository),
  },
  {
    provide: CREATE_TODO_USE_CASE,
    inject: [TODO_REPOSITORY, TODO_USE_CASE_DEPENDENCIES],
    useFactory: (repository: TodoRepository, dependencies: TodoUseCaseDependencies) =>
      new CreateTodoUseCase(repository, dependencies),
  },
  {
    provide: UPDATE_TODO_COMPLETED_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepository) => new UpdateTodoCompletedUseCase(repository),
  },
  {
    provide: DELETE_TODO_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepository) => new DeleteTodoUseCase(repository),
  },
];
