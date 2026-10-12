import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-sm font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E0E0E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-[#0E0E0E] text-white px-7 py-3 hover:bg-[#262626] shadow-sm group",
        link:
          "text-[#0E0E0E] underline-offset-4 hover:underline p-0 h-auto font-normal",
        outline:
          "rounded-full border border-[#0E0E0E]/20 text-[#0E0E0E] px-6 py-2.5 hover:border-[#0E0E0E] hover:bg-white/40",
        ghost:
          "rounded-full text-[#6B6860] hover:text-[#0E0E0E] hover:bg-black/5 px-4 py-2",
        glass:
          "rounded-full glass text-[#0E0E0E] px-6 py-2.5 hover:bg-white/80",
        secondary:
          "rounded-full bg-white text-[#0E0E0E] border border-black/10 px-6 py-2.5 hover:bg-[#F9F7F2]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
