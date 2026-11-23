import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-soft hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-md active:translate-y-0",
        secondary:
          "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-soft hover:-translate-y-0.5 hover:bg-[var(--muted)] active:translate-y-0",
        outline:
          "border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:bg-[var(--muted)] active:translate-y-0",
        ghost:
          "text-[var(--foreground-soft)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        accent:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-soft hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] active:translate-y-0",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-soft hover:opacity-90 active:translate-y-px",
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
