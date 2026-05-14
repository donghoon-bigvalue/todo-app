declare const todoIdBrand: unique symbol;

export type TodoId = string & { readonly [todoIdBrand]: "TodoId" };

export type TodoSnapshot = {
  readonly id: TodoId;
  readonly title: string;
  readonly completed: boolean;
  readonly note?: string | null;
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
  #note: string | null;
  readonly #createdAt: Date;

  private constructor(snapshot: TodoSnapshot) {
    this.#id = snapshot.id;
    this.#title = snapshot.title;
    this.#completed = snapshot.completed;
    this.#note = snapshot.note ?? null;
    this.#createdAt = new Date(snapshot.createdAt);
  }

  static create(input: CreateTodoInput): Todo {
    return new Todo({
      id: input.id,
      title: input.title,
      completed: false,
      note: null,
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

  get note(): string | null {
    return this.#note;
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

  updateNote(note: string): void {
    this.#note = note;
  }

  clearNote(): void {
    this.#note = null;
  }

  toSnapshot(): TodoSnapshot {
    return {
      id: this.#id,
      title: this.#title,
      completed: this.#completed,
      note: this.#note,
      createdAt: new Date(this.#createdAt),
    };
  }
}
