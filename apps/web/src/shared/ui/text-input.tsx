import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type TextInputState = "default" | "focus" | "error";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly state?: TextInputState;
};

export function TextInput({
  className,
  state = "default",
  type = "text",
  ...props
}: TextInputProps) {
  const invalid =
    state === "error" || props["aria-invalid"] === true || props["aria-invalid"] === "true";
  const focused = state === "focus";

  return (
    <input
      className={cn(
        [
          "h-12 w-full rounded-[8px] border bg-white px-[14px] text-[15px] text-[#1F2937]",
          "placeholder:text-[#6B7280]",
          "focus-visible:border-[#2563EB] focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-[#DC2626]" : focused ? "border-[#2563EB]" : "border-[#E5E7EB]",
        ],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
