import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import type { AccessTokenVerifier } from "../../auth/application/auth-use-cases";
import {
  type CreateUserTodoUseCase,
  type DeleteUserTodoUseCase,
  type ListUserTodosUseCase,
  type Todo,
  TodoNotFoundError,
  type UpdateUserTodoCompletedUseCase,
  type UpdateUserTodoNoteUseCase,
  type UserId,
  createTodoId,
} from "@todo-app/domain";
import { ZodError, z } from "zod";
import {
  ACCESS_TOKEN_VERIFIER,
  CREATE_TODO_USE_CASE,
  DELETE_TODO_USE_CASE,
  LIST_TODOS_USE_CASE,
  UPDATE_TODO_COMPLETED_USE_CASE,
  UPDATE_TODO_NOTE_USE_CASE,
} from "../todos.tokens";

const createTodoRequestSchema = z.object({
  title: z.string(),
});

const updateTodoCompletedRequestSchema = z.object({
  completed: z.boolean(),
});

const updateTodoNoteRequestSchema = z.object({
  note: z.string().nullish(),
});

export type TodoResponse = {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly note: string | null;
  readonly createdAt: string;
};

@Controller("todos")
export class TodosController {
  constructor(
    @Inject(LIST_TODOS_USE_CASE)
    private readonly listTodosUseCase: ListUserTodosUseCase,
    @Inject(CREATE_TODO_USE_CASE)
    private readonly createTodoUseCase: CreateUserTodoUseCase,
    @Inject(UPDATE_TODO_COMPLETED_USE_CASE)
    private readonly updateTodoCompletedUseCase: UpdateUserTodoCompletedUseCase,
    @Inject(UPDATE_TODO_NOTE_USE_CASE)
    private readonly updateTodoNoteUseCase: UpdateUserTodoNoteUseCase,
    @Inject(DELETE_TODO_USE_CASE)
    private readonly deleteTodoUseCase: DeleteUserTodoUseCase,
    @Inject(ACCESS_TOKEN_VERIFIER)
    private readonly accessTokenVerifier: AccessTokenVerifier,
  ) {}

  @Get()
  async list(@Headers("authorization") authorization: string | undefined): Promise<TodoResponse[]> {
    const userId = this.authenticate(authorization);
    const todos = await this.listTodosUseCase.execute({ userId });

    return todos.map(toTodoResponse);
  }

  @Post()
  async create(
    @Body() body: unknown,
    @Headers("authorization") authorization: string | undefined,
  ): Promise<TodoResponse> {
    try {
      const userId = this.authenticate(authorization);
      const request = createTodoRequestSchema.parse(body);
      const todo = await this.createTodoUseCase.execute({
        userId,
        title: request.title,
      });

      return toTodoResponse(todo);
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  @Patch(":id/completed")
  async updateCompleted(
    @Param("id") id: string,
    @Body() body: unknown,
    @Headers("authorization") authorization: string | undefined,
  ): Promise<TodoResponse> {
    try {
      const userId = this.authenticate(authorization);
      const request = updateTodoCompletedRequestSchema.parse(body);
      const todo = await this.updateTodoCompletedUseCase.execute({
        userId,
        id: createTodoId(id),
        completed: request.completed,
      });

      return toTodoResponse(todo);
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  @Patch(":id/note")
  async updateNote(
    @Param("id") id: string,
    @Body() body: unknown,
    @Headers("authorization") authorization: string | undefined,
  ): Promise<TodoResponse> {
    try {
      const userId = this.authenticate(authorization);
      const request = updateTodoNoteRequestSchema.parse(body);
      const todo = await this.updateTodoNoteUseCase.execute({
        userId,
        id: createTodoId(id),
        note: request.note,
      });

      return toTodoResponse(todo);
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(
    @Param("id") id: string,
    @Headers("authorization") authorization: string | undefined,
  ): Promise<void> {
    try {
      const userId = this.authenticate(authorization);
      await this.deleteTodoUseCase.execute({ userId, id: createTodoId(id) });
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  private authenticate(authorization: string | undefined): UserId {
    const accessToken = readBearerToken(authorization);
    const user = accessToken ? this.accessTokenVerifier.verify(accessToken) : null;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user.userId;
  }
}

function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    note: todo.note,
    createdAt: todo.createdAt.toISOString(),
  };
}

function mapTodoApiError(error: unknown): Error {
  if (error instanceof ZodError) {
    return new BadRequestException(error.issues);
  }

  if (error instanceof TodoNotFoundError) {
    return new NotFoundException();
  }

  return error instanceof Error ? error : new Error("알 수 없는 오류가 발생했습니다.");
}

function readBearerToken(authorization: string | undefined): string | null {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length);
}
