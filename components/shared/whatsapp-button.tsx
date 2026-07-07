"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { cn } from "@/lib/utils";

const SESSION_KEY = "whatsapp-tooltip-seen";
const TOOLTIP_DELAY_MS = 3000;

const whatsappHref = `https://wa.me/${siteData.clinic.whatsapp}?text=${encodeURIComponent(
  "Hi, I'd like to book an appointment."
)}`;

export function WhatsAppButton() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    if (!mobileQuery.matches) {
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShowTooltip(true);
    }, TOOLTIP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const dismissTooltip = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowTooltip(false);
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    dismissTooltip();
  }, [dismissTooltip]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-4 z-30 flex items-center gap-3",
        "sm:bottom-8 sm:right-8"
      )}
    >
      {showTooltip ? (
        <div
          role="tooltip"
          className={cn(
            "relative max-w-[10.5rem] rounded-xl border border-border/60 bg-background px-3 py-2",
            "text-sm font-medium text-foreground shadow-md",
            "sm:hidden"
          )}
        >
          <p className="pr-6 leading-snug">Chat with us!</p>
          <button
            type="button"
            onClick={dismissTooltip}
            className={cn(
              "absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full",
              "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label="Dismiss chat tooltip"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
          <span
            aria-hidden="true"
            className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-r border-border/60 bg-background"
          />
        </div>
      ) : null}

      <div className="relative shrink-0">
        {!prefersReducedMotion ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-whatsapp/25"
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : null}

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          onClick={handleWhatsAppClick}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full",
            "bg-whatsapp text-whatsapp-foreground shadow-md transition-colors",
            "hover:bg-whatsapp/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
          )}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
