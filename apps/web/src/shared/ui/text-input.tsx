import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, type = "text", ...props }: TextInputProps) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true";

  return (
    <input
      className={cn(
        [
          "h-10 w-full rounded-[8px] border bg-white px-3 text-base text-[#1F2937]",
          "placeholder:text-[#6B7280]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-[#DC2626]" : "border-[#E5E7EB]",
        ],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
