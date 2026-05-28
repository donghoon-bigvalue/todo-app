import { zodResolver } from "@hookform/resolvers/zod";
import { todoTitleSchema } from "@todo-app/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createTodo,
  deleteTodo,
  listTodos,
  updateTodoCompleted,
  updateTodoNote,
} from "../shared/api";
import { Button, EmptyState, ErrorMessage, TextInput, TodoItem } from "../shared/ui";

const todoFormSchema = z.object({
  title: todoTitleSchema,
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

export function TodoPage({
  onLogout,
  onManageAccount,
}: {
  readonly onLogout?: () => void | Promise<void>;
  readonly onManageAccount?: () => void;
}) {
  const queryClient = useQueryClient();
  const [editingNoteTodoId, setEditingNoteTodoId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const form = useForm<TodoFormValues>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(todoFormSchema),
  });
  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: () => listTodos(),
  });
  const createTodoMutation = useMutation({
    mutationFn: (values: TodoFormValues) => createTodo(values),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const updateTodoCompletedMutation = useMutation({
    mutationFn: ({ completed, id }: { readonly completed: boolean; readonly id: string }) =>
      updateTodoCompleted(id, { completed }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const updateTodoNoteMutation = useMutation({
    mutationFn: ({ id, note }: { readonly id: string; readonly note: string | null }) =>
      updateTodoNote(id, { note }),
    onSuccess: async () => {
      setEditingNoteTodoId(null);
      setNoteDraft("");
      await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
  const todos = todosQuery.data ?? [];
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const titleError = form.formState.errors.title?.message;

  function startNoteEdit(todo: (typeof todos)[number]) {
    setEditingNoteTodoId(todo.id);
    setNoteDraft(todo.note ?? "");
  }

  function saveNote(id: string) {
    const note = noteDraft.trim();

    updateTodoNoteMutation.mutate({ id, note: note.length > 0 ? note : null });
  }

  function cancelNoteEdit() {
    setEditingNoteTodoId(null);
    setNoteDraft("");
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-6 text-[#1F2937]">
      <div className="mx-auto max-w-[342px] space-y-5">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-[24px] font-semibold leading-[35px]">할 일 체크리스트</h1>
            <p className="text-[14px] leading-5 text-[#6B7280]">남은 할 일 {remainingCount}개</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {onManageAccount ? (
              <Button
                className="h-7 w-[54px] rounded-[6px] px-0 text-[12px] leading-[17px]"
                onClick={onManageAccount}
                size="sm"
              >
                계정
              </Button>
            ) : null}
            {onLogout ? (
              <Button
                className="h-7 w-[70px] rounded-[6px] px-0 text-[12px] leading-[17px]"
                onClick={() => void onLogout()}
                size="sm"
              >
                로그아웃
              </Button>
            ) : null}
          </div>
        </header>

        <form
          className="space-y-2"
          onSubmit={form.handleSubmit((values) => createTodoMutation.mutate(values))}
        >
          <div className="flex items-start gap-2">
            <div className="w-[250px] shrink-0">
              <label className="sr-only" htmlFor="todo-title">
                할 일
              </label>
              <TextInput
                aria-describedby={titleError ? "todo-title-error" : undefined}
                aria-invalid={Boolean(titleError)}
                className="h-12 rounded-[8px] px-[14px] text-[15px]"
                id="todo-title"
                placeholder="할 일을 입력하세요"
                state={titleError ? "error" : "default"}
                {...form.register("title")}
              />
            </div>
            <Button
              className="mt-[6px] h-[37px] w-[58px] shrink-0 rounded-[8px] px-0 text-[14px] leading-[17px]"
              disabled={createTodoMutation.isPending}
              type="submit"
              variant="primary"
            >
              추가
            </Button>
          </div>
          {titleError ? <ErrorMessage id="todo-title-error">{titleError}</ErrorMessage> : null}
          {createTodoMutation.isError ? (
            <ErrorMessage>할 일을 추가하지 못했습니다.</ErrorMessage>
          ) : null}
          {updateTodoCompletedMutation.isError ? (
            <ErrorMessage>할 일 상태를 변경하지 못했습니다.</ErrorMessage>
          ) : null}
          {deleteTodoMutation.isError ? (
            <ErrorMessage>할 일을 삭제하지 못했습니다.</ErrorMessage>
          ) : null}
          {updateTodoNoteMutation.isError ? (
            <ErrorMessage>할 일 메모를 저장하지 못했습니다.</ErrorMessage>
          ) : null}
        </form>

        <section aria-label="할 일 목록" className="space-y-3">
          {todosQuery.isLoading ? <p className="text-sm text-[#6B7280]">불러오는 중...</p> : null}
          {todosQuery.isError ? (
            <ErrorMessage>할 일 목록을 불러오지 못했습니다.</ErrorMessage>
          ) : null}
          {!todosQuery.isLoading && !todosQuery.isError && todos.length === 0 ? (
            <EmptyState />
          ) : null}
          {todos.map((todo) => (
            <TodoItem
              completed={todo.completed}
              isNoteEditing={editingNoteTodoId === todo.id}
              key={todo.id}
              note={todo.note}
              noteDraft={editingNoteTodoId === todo.id ? noteDraft : undefined}
              onCompletedChange={(completed) =>
                updateTodoCompletedMutation.mutate({ completed, id: todo.id })
              }
              onDelete={() => deleteTodoMutation.mutate(todo.id)}
              onNoteCancel={cancelNoteEdit}
              onNoteChange={setNoteDraft}
              onNoteEdit={() => startNoteEdit(todo)}
              onNoteSave={() => saveNote(todo.id)}
              title={todo.title}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
