import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  subtle?: boolean;
}

export function GlassCard({
  children,
  className,
  subtle = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300",
        subtle ? "glass-subtle" : "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
