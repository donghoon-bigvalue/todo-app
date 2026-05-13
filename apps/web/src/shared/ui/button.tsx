import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex h-10 items-center justify-center rounded-[8px] px-4 text-sm font-semibold",
    "border border-transparent transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F7F8FA]",
        accent: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} type={type} {...props} />;
}
