import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  type CreateTodoUseCase,
  type DeleteTodoUseCase,
  type ListTodosUseCase,
  type Todo,
  TodoNotFoundError,
  type UpdateTodoCompletedUseCase,
  createTodoId,
} from "@todo-app/domain";
import { ZodError, z } from "zod";
import {
  CREATE_TODO_USE_CASE,
  DELETE_TODO_USE_CASE,
  LIST_TODOS_USE_CASE,
  UPDATE_TODO_COMPLETED_USE_CASE,
} from "../todos.tokens";

const createTodoRequestSchema = z.object({
  title: z.string(),
});

const updateTodoCompletedRequestSchema = z.object({
  completed: z.boolean(),
});

export type TodoResponse = {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
  readonly createdAt: string;
};

@Controller("todos")
export class TodosController {
  constructor(
    @Inject(LIST_TODOS_USE_CASE)
    private readonly listTodosUseCase: ListTodosUseCase,
    @Inject(CREATE_TODO_USE_CASE)
    private readonly createTodoUseCase: CreateTodoUseCase,
    @Inject(UPDATE_TODO_COMPLETED_USE_CASE)
    private readonly updateTodoCompletedUseCase: UpdateTodoCompletedUseCase,
    @Inject(DELETE_TODO_USE_CASE)
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
  ) {}

  @Get()
  async list(): Promise<TodoResponse[]> {
    const todos = await this.listTodosUseCase.execute();

    return todos.map(toTodoResponse);
  }

  @Post()
  async create(@Body() body: unknown): Promise<TodoResponse> {
    try {
      const request = createTodoRequestSchema.parse(body);
      const todo = await this.createTodoUseCase.execute(request);

      return toTodoResponse(todo);
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  @Patch(":id/completed")
  async updateCompleted(@Param("id") id: string, @Body() body: unknown): Promise<TodoResponse> {
    try {
      const request = updateTodoCompletedRequestSchema.parse(body);
      const todo = await this.updateTodoCompletedUseCase.execute({
        id: createTodoId(id),
        completed: request.completed,
      });

      return toTodoResponse(todo);
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: string): Promise<void> {
    try {
      await this.deleteTodoUseCase.execute({ id: createTodoId(id) });
    } catch (error) {
      throw mapTodoApiError(error);
    }
  }
}

function toTodoResponse(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
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
