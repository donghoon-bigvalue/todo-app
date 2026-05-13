import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type ErrorMessageProps = HTMLAttributes<HTMLParagraphElement>;

export function ErrorMessage({ className, ...props }: ErrorMessageProps) {
  return (
    <p
      className={cn("text-[13px] font-normal leading-none text-[#DC2626]", className)}
      {...props}
    />
  );
}
