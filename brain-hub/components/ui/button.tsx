import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--teal-deep)] text-white shadow-sm hover:bg-[var(--teal-mid)] active:translate-y-px",
        secondary:
          "bg-white/90 text-[var(--teal-deep)] border border-[var(--teal-deep)]/15 hover:bg-white hover:border-[var(--teal-deep)]/30",
        outline:
          "border border-[var(--teal-deep)]/20 bg-transparent text-[var(--teal-deep)] hover:bg-[var(--teal-deep)]/5",
        ghost: "text-[var(--teal-deep)] hover:bg-[var(--teal-deep)]/8",
        accent:
          "bg-[var(--coral)] text-white shadow-sm hover:bg-[var(--coral-deep)] active:translate-y-px",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
