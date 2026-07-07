"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Quote, Star } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { scrollRevealProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/site-data-types";

const { testimonials, clinic, sections } = siteData;
const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD_PX = 48;
const SLIDE_TRANSITION = { duration: 0.5, ease: "easeInOut" as const };

const validTestimonials = testimonials.filter(
  (item) => item.name.trim().length > 0 && item.quote.trim().length > 0
);

const googleBusinessProfile = clinic.socials.googleBusinessProfile?.trim() ?? "";

function useCarouselVisibleCount(): number {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setVisibleCount(mediaQuery.matches ? 3 : 1);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return visibleCount;
}

function StarRating({ rating }: { rating: number }) {
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${clampedRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < clampedRating
              ? "fill-primary text-primary"
              : "fill-transparent text-muted-foreground/35"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full min-h-[14rem] flex-col border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="space-y-4 pb-2">
        <Quote
          className="h-8 w-8 text-primary/20"
          aria-hidden="true"
        />
        <StarRating rating={testimonial.rating} />
      </CardHeader>

      <CardContent className="flex-1">
        <blockquote className="text-body leading-relaxed text-foreground">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </CardContent>

      <CardFooter className="pt-2">
        <p className="text-sm font-medium text-muted-foreground">
          {testimonial.name}
        </p>
      </CardFooter>
    </Card>
  );
}

function TestimonialsPlaceholder() {
  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.testimonials.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {sections.testimonials.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {sections.testimonials.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center">
          {/* TODO: add real patient testimonials to site-data.json before launch */}
          <p className="text-sm text-muted-foreground">
            Patient reviews will appear here once testimonials are added to site
            content.
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCarousel({
  items,
  prefersReducedMotion,
}: {
  items: Testimonial[];
  prefersReducedMotion: boolean;
}) {
  const visibleCount = useCarouselVisibleCount();
  const maxIndex = Math.max(0, items.length - visibleCount);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const pauseCountRef = useRef(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      isPaused ||
      isDragging ||
      items.length <= visibleCount
    ) {
      return;
    }

    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [
    prefersReducedMotion,
    isPaused,
    isDragging,
    items.length,
    visibleCount,
    goNext,
  ]);

  const pause = useCallback(() => {
    pauseCountRef.current += 1;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    pauseCountRef.current = Math.max(0, pauseCountRef.current - 1);
    if (pauseCountRef.current === 0) {
      setIsPaused(false);
    }
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    setIsDragging(true);
    pause();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const delta = event.clientX - dragStartX.current;

    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    setIsDragging(false);
    resume();
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    resume();
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const slideOffsetPercent = (100 / items.length) * currentIndex;

  return (
    <div
      className="relative mt-12"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          resume();
        }
      }}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex touch-pan-y"
          animate={
            prefersReducedMotion
              ? undefined
              : { x: `-${slideOffsetPercent}%` }
          }
          transition={
            prefersReducedMotion ? { duration: 0 } : SLIDE_TRANSITION
          }
          style={{ width: `${(items.length / visibleCount) * 100}%` }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {items.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="box-border shrink-0 px-3"
              style={{ width: `${100 / items.length}%` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </motion.div>
      </div>

      {items.length > visibleCount ? (
        <>
          <div className="mt-8 flex items-center justify-center gap-1">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show review group ${index + 1} of ${maxIndex + 1}`}
                aria-current={index === currentIndex ? "true" : undefined}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors duration-200",
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="pointer-events-auto h-11 w-11 -translate-x-1/2 rounded-full bg-background/95 shadow-sm"
              onClick={goPrev}
              aria-label="Previous reviews"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="pointer-events-auto h-11 w-11 translate-x-1/2 rounded-full bg-background/95 shadow-sm"
              onClick={goNext}
              aria-label="Next reviews"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function Testimonials() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (validTestimonials.length === 0) {
    return <TestimonialsPlaceholder />;
  }

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.testimonials.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {sections.testimonials.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {sections.testimonials.intro}
          </p>
        </motion.div>

        {prefersReducedMotion ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {validTestimonials.map((testimonial, index) => (
              <li key={`${testimonial.name}-${index}`} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        ) : (
          <TestimonialsCarousel
            items={validTestimonials}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}

        {googleBusinessProfile ? (
          <motion.div
            className="mt-10 flex justify-center"
            {...scrollRevealProps(prefersReducedMotion)}
          >
            <Button asChild variant="outline" size="lg" className="min-h-11">
              <Link
                href={googleBusinessProfile}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more reviews on Google
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
