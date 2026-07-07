"use client";

import { useState } from "react";
import Image from "next/image";
import { siteData } from "@/lib/get-site-data";
import { cn } from "@/lib/utils";

interface ClinicLogoProps {
  className?: string;
  showName?: boolean;
  nameClassName?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 0 && word[0] === word[0].toUpperCase())
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

export function ClinicLogo({
  className,
  showName = true,
  nameClassName,
}: ClinicLogoProps) {
  const { name, logoPath } = siteData.clinic;
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md ring-1 ring-black/5">
        {!imageError ? (
          <Image
            src={logoPath}
            alt={`${name} logo`}
            width={44}
            height={44}
            priority
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          // TODO: replace with real clinic logo when /public/images/logo.svg is available
          <span className="text-sm font-semibold text-primary">{initials}</span>
        )}
      </span>
      {showName ? (
        <span
          className={cn(
            "min-w-0 font-heading text-base font-semibold text-foreground sm:text-lg",
            nameClassName
          )}
        >
          {name}
        </span>
      ) : null}
    </span>
  );
}
