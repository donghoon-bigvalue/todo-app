import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  readonly label: string;
  readonly hideLabel?: boolean;
};

export function Checkbox({ className, hideLabel = false, label, ...props }: CheckboxProps) {
  return (
    <label className="relative inline-flex items-center gap-2 text-sm font-normal text-[#1F2937]">
      <input
        className="peer absolute left-0 top-1/2 size-5 -translate-y-1/2 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        type="checkbox"
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          [
            "pointer-events-none flex size-5 items-center justify-center rounded-[5px] border border-[#E5E7EB] bg-white",
            "text-[14px] font-bold leading-none text-white",
            "peer-checked:border-[#2563EB] peer-checked:bg-[#2563EB]",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2563EB]",
            "peer-disabled:opacity-50",
          ],
          className,
        )}
      >
        ✓
      </span>
      <span className={cn(hideLabel && "sr-only")}>{label}</span>
    </label>
  );
}
