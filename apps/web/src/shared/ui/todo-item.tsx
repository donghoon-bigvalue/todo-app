import { cn } from "../lib/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

export type TodoItemProps = {
  readonly className?: string;
  readonly completed: boolean;
  readonly onCompletedChange?: (completed: boolean) => void;
  readonly onDelete?: () => void;
  readonly title: string;
};

export function TodoItem({
  className,
  completed,
  onCompletedChange,
  onDelete,
  title,
}: TodoItemProps) {
  const checkboxLabel = completed ? `${title} 완료 취소` : `${title} 완료 처리`;

  return (
    <div
      className={cn("w-[342px] rounded-[8px] border border-[#E5E7EB] bg-white p-[14px]", className)}
    >
      <div className="flex h-7 w-[308px] items-center gap-[10px]">
        <Checkbox
          checked={completed}
          hideLabel
          label={checkboxLabel}
          onChange={(event) => onCompletedChange?.(event.currentTarget.checked)}
        />
        <p
          className={cn(
            "w-56 text-[16px] font-normal leading-[22px]",
            completed ? "text-[#6B7280] line-through" : "text-[#1F2937]",
          )}
        >
          {title}
        </p>
        <Button
          aria-label={`${title} 삭제`}
          className="shrink-0"
          onClick={onDelete}
          size="sm"
          variant="dangerSoft"
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
