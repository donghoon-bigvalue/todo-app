import {
  CreateUserTodoUseCase,
  DeleteUserTodoUseCase,
  ListUserTodosUseCase,
  UpdateUserTodoCompletedUseCase,
  UpdateUserTodoNoteUseCase,
  createTodoId,
  type TodoRepository,
  type TodoUseCaseDependencies,
  type UserScopedTodoRepository,
} from "@todo-app/domain";
import { randomUUID } from "node:crypto";
import type { Provider } from "@nestjs/common";
import { createAuthConfig } from "../../auth/infrastructure/auth-config";
import { JwtAccessTokenVerifier } from "../../auth/infrastructure/jwt-access-token-issuer";
import {
  ACCESS_TOKEN_VERIFIER,
  CREATE_TODO_USE_CASE,
  DELETE_TODO_USE_CASE,
  LIST_TODOS_USE_CASE,
  TODO_REPOSITORY,
  TODO_USE_CASE_DEPENDENCIES,
  UPDATE_TODO_COMPLETED_USE_CASE,
  UPDATE_TODO_NOTE_USE_CASE,
} from "../todos.tokens";

type TodoRepositoryContract = TodoRepository & UserScopedTodoRepository;

export const todoUseCaseProviders: Provider[] = [
  {
    provide: ACCESS_TOKEN_VERIFIER,
    useFactory: () => new JwtAccessTokenVerifier(createAuthConfig(process.env).jwtSecret),
  },
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
    useFactory: (repository: TodoRepositoryContract) => new ListUserTodosUseCase(repository),
  },
  {
    provide: CREATE_TODO_USE_CASE,
    inject: [TODO_REPOSITORY, TODO_USE_CASE_DEPENDENCIES],
    useFactory: (repository: TodoRepositoryContract, dependencies: TodoUseCaseDependencies) =>
      new CreateUserTodoUseCase(repository, dependencies),
  },
  {
    provide: UPDATE_TODO_COMPLETED_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepositoryContract) =>
      new UpdateUserTodoCompletedUseCase(repository),
  },
  {
    provide: UPDATE_TODO_NOTE_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepositoryContract) => new UpdateUserTodoNoteUseCase(repository),
  },
  {
    provide: DELETE_TODO_USE_CASE,
    inject: [TODO_REPOSITORY],
    useFactory: (repository: TodoRepositoryContract) => new DeleteUserTodoUseCase(repository),
  },
];
