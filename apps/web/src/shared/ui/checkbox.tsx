import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  readonly label: string;
};

export function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-normal text-[#1F2937]">
      <input
        className={cn(
          [
            "size-5 rounded-[4px] border border-[#E5E7EB] bg-white accent-[#2563EB]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ],
          className,
        )}
        type="checkbox"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
