"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { siteData } from "@/lib/get-site-data";
import { pageEnterProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { Button } from "@/components/ui/button";
import { HeroImage } from "@/components/sections/hero-image";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

const { clinic } = siteData;

const whatsappHref = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
  "Hi, I'd like to book an appointment."
)}`;

const STAGGER_S = SCROLL_REVEAL_STAGGER_S;

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToContact = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scrollToSection("#contact", {
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion]
  );

  const imageMotion = prefersReducedMotion
    ? { initial: false, animate: { scale: 1 }, transition: { duration: 0 } }
    : {
        initial: { scale: 0.97 },
        animate: { scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" as const, delay: STAGGER_S * 3 },
      };

  return (
    <section
      id="home"
      aria-label="Home"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.12) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-[calc(var(--site-header-height)+1.5rem)] md:px-8 md:pb-16 md:pt-[calc(var(--site-header-height)+2rem)] lg:min-h-[90vh] lg:pb-20 lg:pt-[calc(var(--site-header-height)+2.5rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="space-y-6 lg:space-y-8">
            <motion.p
              className="text-sm font-semibold uppercase tracking-wide text-primary"
              {...pageEnterProps(prefersReducedMotion, 0)}
            >
              {clinic.name}
            </motion.p>

            <motion.h1
              className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-tight"
              {...pageEnterProps(prefersReducedMotion, STAGGER_S)}
            >
              {clinic.tagline}
            </motion.h1>

            <motion.p
              className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              {...pageEnterProps(prefersReducedMotion, STAGGER_S * 2)}
            >
              {clinic.description}
            </motion.p>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              {...pageEnterProps(prefersReducedMotion, STAGGER_S * 3)}
            >
              <Button size="lg" asChild className="min-h-11 w-full sm:w-auto">
                <a href="#contact" onClick={scrollToContact}>
                  Book Appointment
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="min-h-11 w-full sm:w-auto"
              >
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="text-whatsapp-icon" />
                  WhatsApp Us
                </a>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="relative w-full max-w-xl lg:justify-self-end"
            {...imageMotion}
          >
            <HeroImage />
          </motion.div>
        </div>

        {clinic.stats.length > 0 ? (
          <motion.div
            className="mt-12 border-t border-border/60 pt-8 md:mt-14 lg:mt-16"
            {...pageEnterProps(prefersReducedMotion, STAGGER_S * 4)}
          >
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {clinic.stats.map((stat) => (
                <li
                  key={stat.label}
                  className={cn(
                    "rounded-xl border border-border/60 bg-background/80 px-4 py-4 text-center shadow-sm backdrop-blur-sm",
                    "sm:px-5 sm:py-5"
                  )}
                >
                  <p className="font-heading text-2xl font-semibold text-primary md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
