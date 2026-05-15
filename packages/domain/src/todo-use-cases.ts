import { Todo, type TodoId } from "./todo";
import { todoNoteSchema } from "./todo-note-schema";
import type { TodoRepository } from "./todo-repository";
import { todoTitleSchema } from "./todo-title-schema";

export type TodoUseCaseDependencies = {
  readonly generateId: () => TodoId;
  readonly now: () => Date;
};

export class TodoNotFoundError extends Error {
  constructor(readonly id: TodoId) {
    super(`Todo를 찾을 수 없습니다: ${id}`);
    this.name = "TodoNotFoundError";
  }
}

export class ListTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    return this.repository.findMany();
  }
}

export class CreateTodoUseCase {
  constructor(
    private readonly repository: TodoRepository,
    private readonly dependencies: TodoUseCaseDependencies,
  ) {}

  async execute(input: { readonly title: string }): Promise<Todo> {
    const todo = Todo.create({
      id: this.dependencies.generateId(),
      title: todoTitleSchema.parse(input.title),
      createdAt: this.dependencies.now(),
    });

    await this.repository.create(todo);

    return todo;
  }
}

export class UpdateTodoCompletedUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: { readonly id: TodoId; readonly completed: boolean }): Promise<Todo> {
    const todo = await this.repository.findById(input.id);

    if (!todo) {
      throw new TodoNotFoundError(input.id);
    }

    if (input.completed) {
      todo.complete();
    } else {
      todo.reopen();
    }

    await this.repository.update(todo);

    return todo;
  }
}

export class UpdateTodoNoteUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: {
    readonly id: TodoId;
    readonly note?: string | null | undefined;
  }): Promise<Todo> {
    const todo = await this.repository.findById(input.id);

    if (!todo) {
      throw new TodoNotFoundError(input.id);
    }

    const note = todoNoteSchema.parse(input.note);

    if (note) {
      todo.updateNote(note);
    } else {
      todo.clearNote();
    }

    await this.repository.update(todo);

    return todo;
  }
}

export class DeleteTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(input: { readonly id: TodoId }): Promise<void> {
    const todo = await this.repository.findById(input.id);

    if (!todo) {
      throw new TodoNotFoundError(input.id);
    }

    await this.repository.delete(input.id);
  }
}
