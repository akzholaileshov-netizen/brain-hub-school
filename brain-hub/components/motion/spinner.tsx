import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <div className={cn("bh-spinner", className)} role="status" aria-hidden />;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("bh-skeleton rounded-md", className)}
      aria-hidden
    />
  );
}
