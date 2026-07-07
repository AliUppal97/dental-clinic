import { cn } from "@/lib/utils";

interface SectionSkeletonProps {
  className?: string;
}

export function SectionSkeleton({ className }: SectionSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "min-h-[24rem] w-full bg-muted/20 motion-safe:animate-pulse",
        className
      )}
    />
  );
}
