import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#0E0E0E]/5 text-[#0E0E0E] border border-[rgba(14,14,14,0.12)]",
        lime:
          "bg-white/80 text-[#0E0E0E] border border-[rgba(14,14,14,0.15)] shadow-xs",
        glass:
          "glass text-[#0E0E0E]",
        outline:
          "border border-[rgba(14,14,14,0.2)] text-[#0E0E0E]",
        solid:
          "bg-[#0E0E0E] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
