"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyMapEmbedProps {
  title: string;
  src: string;
  className?: string;
}

export function LazyMapEmbed({ title, src, className }: LazyMapEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      {shouldLoad ? (
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 h-full w-full bg-muted motion-safe:animate-pulse"
        />
      )}
    </div>
  );
}
