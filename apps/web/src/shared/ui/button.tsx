import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] font-semibold",
    "border border-transparent transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]",
  ],
  {
    variants: {
      variant: {
        default: "border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#F7F8FA]",
        primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
        danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
        dangerSoft: "bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA]",
      },
      size: {
        default: "h-[37px] px-4 text-[14px] leading-[17px]",
        sm: "h-7 px-[10px] text-[13px] leading-4",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, size, variant, type = "button", ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ size, variant }), className)} type={type} {...props} />
  );
}
