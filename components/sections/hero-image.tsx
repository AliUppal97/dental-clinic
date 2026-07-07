"use client";

import { useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { cn } from "@/lib/utils";

interface HeroImageProps {
  className?: string;
  priority?: boolean;
}

export function HeroImage({ className, priority = true }: HeroImageProps) {
  const { heroImage } = siteData.clinic;
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-md sm:aspect-[5/6] lg:aspect-[5/6]",
        className
      )}
    >
      {!imageError ? (
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        // TODO: replace with real clinic photo when /public/images/gallery/team-photo.jpg is available
        <div
          aria-hidden="true"
          className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Users className="h-10 w-10" />
          </span>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Clinic photo coming soon
          </p>
        </div>
      )}
    </div>
  );
}
