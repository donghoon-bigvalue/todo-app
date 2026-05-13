import { cn } from "../lib/cn";

export type EmptyStateProps = {
  readonly className?: string;
  readonly description?: string;
  readonly title?: string;
};

export function EmptyState({
  className,
  description = "오늘 해야 할 일을 하나 추가해보세요.",
  title = "아직 할 일이 없습니다.",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-28 w-[342px] flex-col items-center justify-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-white px-6 py-7 text-center",
        className,
      )}
    >
      <p className="w-[294px] text-[16px] font-semibold leading-[22px] text-[#1F2937]">{title}</p>
      <p className="w-[294px] text-[14px] font-normal leading-5 text-[#6B7280]">{description}</p>
    </div>
  );
}
