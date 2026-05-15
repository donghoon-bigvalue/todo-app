import { cn } from "../lib/cn";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

export type TodoItemProps = {
  readonly className?: string;
  readonly completed: boolean;
  readonly isNoteEditing?: boolean;
  readonly note?: string | null;
  readonly noteDraft?: string | undefined;
  readonly onCompletedChange?: (completed: boolean) => void;
  readonly onDelete?: () => void;
  readonly onNoteCancel?: () => void;
  readonly onNoteChange?: (note: string) => void;
  readonly onNoteEdit?: () => void;
  readonly onNoteSave?: () => void;
  readonly title: string;
};

export function TodoItem({
  className,
  completed,
  isNoteEditing = false,
  note,
  noteDraft,
  onCompletedChange,
  onDelete,
  onNoteCancel,
  onNoteChange,
  onNoteEdit,
  onNoteSave,
  title,
}: TodoItemProps) {
  const checkboxLabel = completed ? `${title} 완료 취소` : `${title} 완료 처리`;
  const hasNote = Boolean(note);
  const shouldShowNoteAction = Boolean(onNoteEdit) || isNoteEditing || hasNote;
  const noteActionLabel = hasNote ? `${title} 메모 수정` : `${title} 메모 추가`;
  const titleWidthClass = shouldShowNoteAction ? "w-[160px]" : "w-56";

  return (
    <div
      className={cn("w-[342px] rounded-[8px] border border-[#E5E7EB] bg-white p-[13px]", className)}
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
            "text-[16px] font-normal leading-[22px]",
            titleWidthClass,
            completed ? "text-[#6B7280] line-through" : "text-[#1F2937]",
          )}
        >
          {title}
        </p>
        {shouldShowNoteAction ? (
          <Button
            aria-label={noteActionLabel}
            className="w-[44px] shrink-0 px-0 text-[12px] font-normal text-[#6B7280]"
            onClick={onNoteEdit}
            size="sm"
            variant="default"
          >
            수정
          </Button>
        ) : null}
        <Button
          aria-label={`${title} 삭제`}
          className="w-[44px] shrink-0 px-0"
          onClick={onDelete}
          size="sm"
          variant="dangerSoft"
        >
          삭제
        </Button>
      </div>
      {isNoteEditing ? (
        <>
          <textarea
            aria-label={`${title} 메모`}
            className="mt-[10px] ml-[30px] h-[66px] w-[264px] resize-none rounded-[8px] border border-[#E5E7EB] bg-white px-[11px] py-[9px] text-[14px] leading-[20px] text-[#1F2937] focus-visible:border-[#2563EB] focus-visible:outline-none"
            onChange={(event) => onNoteChange?.(event.currentTarget.value)}
            value={noteDraft ?? note ?? ""}
          />
          <div className="mt-[10px] ml-[198px] flex w-[96px] items-center gap-2">
            <Button
              aria-label={`${title} 메모 저장`}
              className="w-[44px] px-0 text-[12px] font-normal"
              onClick={onNoteSave}
              size="sm"
              variant="primary"
            >
              저장
            </Button>
            <Button
              aria-label={`${title} 메모 취소`}
              className="w-[44px] px-0 text-[12px] font-normal text-[#6B7280]"
              onClick={onNoteCancel}
              size="sm"
              variant="default"
            >
              취소
            </Button>
          </div>
        </>
      ) : hasNote ? (
        <p className="mt-[10px] ml-[30px] line-clamp-2 h-[36px] w-[264px] text-[14px] leading-[18px] text-[#6B7280]">
          {note}
        </p>
      ) : null}
    </div>
  );
}
