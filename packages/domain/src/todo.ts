declare const todoIdBrand: unique symbol;

export type TodoId = string & { readonly [todoIdBrand]: "TodoId" };

export type TodoSnapshot = {
  readonly id: TodoId;
  readonly title: string;
  readonly completed: boolean;
  readonly createdAt: Date;
};

export type CreateTodoInput = {
  readonly id: TodoId;
  readonly title: string;
  readonly createdAt?: Date;
};

export function createTodoId(value: string): TodoId {
  return value as TodoId;
}

export class Todo {
  readonly #id: TodoId;
  readonly #title: string;
  #completed: boolean;
  readonly #createdAt: Date;

  private constructor(snapshot: TodoSnapshot) {
    this.#id = snapshot.id;
    this.#title = snapshot.title;
    this.#completed = snapshot.completed;
    this.#createdAt = new Date(snapshot.createdAt);
  }

  static create(input: CreateTodoInput): Todo {
    return new Todo({
      id: input.id,
      title: input.title,
      completed: false,
      createdAt: input.createdAt ?? new Date(),
    });
  }

  static restore(snapshot: TodoSnapshot): Todo {
    return new Todo(snapshot);
  }

  get id(): TodoId {
    return this.#id;
  }

  get title(): string {
    return this.#title;
  }

  get completed(): boolean {
    return this.#completed;
  }

  get createdAt(): Date {
    return new Date(this.#createdAt);
  }

  complete(): void {
    this.#completed = true;
  }

  reopen(): void {
    this.#completed = false;
  }

  toggleCompleted(): void {
    this.#completed = !this.#completed;
  }

  toSnapshot(): TodoSnapshot {
    return {
      id: this.#id,
      title: this.#title,
      completed: this.#completed,
      createdAt: new Date(this.#createdAt),
    };
  }
}
