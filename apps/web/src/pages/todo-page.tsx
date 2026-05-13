import { zodResolver } from "@hookform/resolvers/zod";
import { todoTitleSchema } from "@todo-app/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, EmptyState, ErrorMessage, TextInput, TodoItem } from "../shared/ui";
import { createTodo, listTodos } from "../shared/api";

const todoFormSchema = z.object({
  title: todoTitleSchema,
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

export function TodoPage() {
  const queryClient = useQueryClient();
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
  const todos = todosQuery.data ?? [];
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const titleError = form.formState.errors.title?.message;

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 text-[#1F2937]">
      <div className="mx-auto max-w-[390px] space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">할 일 체크리스트</h1>
          <p className="text-sm text-[#6B7280]">남은 할 일 {remainingCount}개</p>
        </header>

        <form
          className="space-y-2"
          onSubmit={form.handleSubmit((values) => createTodoMutation.mutate(values))}
        >
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="todo-title">
              할 일
            </label>
            <TextInput
              aria-describedby={titleError ? "todo-title-error" : undefined}
              aria-invalid={Boolean(titleError)}
              id="todo-title"
              placeholder="할 일을 입력하세요"
              state={titleError ? "error" : "default"}
              {...form.register("title")}
            />
            <Button disabled={createTodoMutation.isPending} type="submit" variant="primary">
              추가
            </Button>
          </div>
          {titleError ? <ErrorMessage id="todo-title-error">{titleError}</ErrorMessage> : null}
          {createTodoMutation.isError ? (
            <ErrorMessage>할 일을 추가하지 못했습니다.</ErrorMessage>
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
            <TodoItem completed={todo.completed} key={todo.id} title={todo.title} />
          ))}
        </section>
      </div>
    </main>
  );
}
