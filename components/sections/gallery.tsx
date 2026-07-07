"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, GripVertical, ImageIcon } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { scrollRevealProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BeforeAfterCase, GalleryImage } from "@/lib/site-data-types";

const { gallery, beforeAfter, beforeAfterConsent, sections } = siteData;
const STAGGER_S = SCROLL_REVEAL_STAGGER_S;

function GalleryPhotoPlaceholder({ label }: { label: string }) {
  return (
    // TODO: replace with real clinic photo
    <div
      aria-hidden="true"
      className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-background to-primary/5"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <ImageIcon className="h-7 w-7 text-primary/70" />
      </span>
      <span className="px-4 text-center text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function GalleryGridItem({
  photo,
  index,
  prefersReducedMotion,
  onOpen,
  onLoadStatus,
}: {
  photo: GalleryImage;
  index: number;
  prefersReducedMotion: boolean;
  onOpen: (index: number) => void;
  onLoadStatus: (src: string, loaded: boolean) => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasPhoto = Boolean(photo.src?.trim()) && !imageError;
  const canOpen = hasPhoto && imageLoaded;

  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className="mb-4 break-inside-avoid sm:mb-6"
    >
      <button
        type="button"
        onClick={() => canOpen && onOpen(index)}
        disabled={!canOpen}
        className={cn(
          "group relative block w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          canOpen && "cursor-zoom-in active:scale-[0.99] can-hover:hover:shadow-md",
          !canOpen && "cursor-default"
        )}
        aria-label={canOpen ? `View larger: ${photo.alt}` : photo.alt}
      >
        <div className="relative aspect-[4/3] w-full">
          {hasPhoto ? (
            <>
              {!imageLoaded && !imageError ? (
                <GalleryPhotoPlaceholder label={photo.alt || "Clinic photo"} />
              ) : null}
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  "object-cover transition-transform duration-300 ease-out",
                  canOpen && "can-hover:group-hover:scale-[1.02]",
                  !imageLoaded && "opacity-0"
                )}
                onLoad={() => {
                  setImageLoaded(true);
                  onLoadStatus(photo.src, true);
                }}
                onError={() => {
                  setImageError(true);
                  onLoadStatus(photo.src, false);
                }}
              />
            </>
          ) : (
            <GalleryPhotoPlaceholder label={photo.alt || "Clinic photo"} />
          )}
        </div>
      </button>
    </motion.li>
  );
}

function GalleryLightbox({
  images,
  activeIndex,
  open,
  onOpenChange,
  onNavigate,
}: {
  images: GalleryImage[];
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (index: number) => void;
}) {
  const current = images[activeIndex];
  const hasMultiple = images.length > 1;

  const goPrevious = useCallback(() => {
    onNavigate((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goPrevious, goNext]);

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[min(96vw,56rem)] border-none bg-transparent p-0 shadow-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{current.alt}</DialogTitle>

        <div className="relative overflow-hidden rounded-xl bg-background shadow-md">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(max-width: 768px) 96vw, 896px"
              className="object-contain"
            />
          </div>

          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full shadow-sm"
                onClick={goPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full shadow-sm sm:right-16"
                onClick={goNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          ) : null}

          <p className="border-t border-border/60 px-4 py-3 text-center text-sm text-muted-foreground">
            {current.alt}
            {hasMultiple ? (
              <span className="ml-2 text-xs">
                ({activeIndex + 1} of {images.length})
              </span>
            ) : null}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BeforeAfterSlider({
  caseItem,
  index,
  prefersReducedMotion,
}: {
  caseItem: BeforeAfterCase;
  index: number;
  prefersReducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    isDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDragging.current) return;
    updatePosition(event.clientX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    isDragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((prev) => Math.min(100, prev + 5));
    }
  };

  if (beforeError || afterError) {
    return null;
  }

  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className="space-y-3"
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-sm select-none touch-none"
      >
        <Image
          src={caseItem.afterSrc}
          alt={`After treatment: ${caseItem.caption}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
          className="object-cover"
          onError={() => setAfterError(true)}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={caseItem.beforeSrc}
            alt={`Before treatment: ${caseItem.caption}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 480px"
            className="object-cover"
            onError={() => setBeforeError(true)}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-background shadow-sm"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />

        <button
          type="button"
          className={cn(
            "absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            "rounded-full border border-border/60 bg-background shadow-md",
            "cursor-ew-resize touch-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          style={{ left: `${position}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          aria-label={`Drag to compare before and after: ${caseItem.caption}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          role="slider"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </button>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
          After
        </span>
      </div>

      <p className="text-center text-sm text-muted-foreground">{caseItem.caption}</p>
    </motion.li>
  );
}

function BeforeAfterSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (!beforeAfterConsent || beforeAfter.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 md:mt-20">
      <h3 className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {sections.gallery.beforeAfterHeading}
      </h3>
      <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        {beforeAfter.map((caseItem, index) => (
          <BeforeAfterSlider
            key={`${caseItem.beforeSrc}-${caseItem.afterSrc}`}
            caseItem={caseItem}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </ul>
    </div>
  );
}

export function Gallery() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSrcs, setLoadedSrcs] = useState<Set<string>>(() => new Set());

  const loadableGallery = gallery.filter((photo) => Boolean(photo.src?.trim()));
  const lightboxImages = loadableGallery.filter((photo) => loadedSrcs.has(photo.src));

  const handleLoadStatus = useCallback((src: string, loaded: boolean) => {
    setLoadedSrcs((prev) => {
      const next = new Set(prev);
      if (loaded) {
        next.add(src);
      } else {
        next.delete(src);
      }
      return next;
    });
  }, []);

  if (loadableGallery.length === 0 && !beforeAfterConsent) {
    return null;
  }

  const openLightbox = (gridIndex: number) => {
    const photo = loadableGallery[gridIndex];
    const lightboxIndex = lightboxImages.findIndex((item) => item.src === photo?.src);
    if (lightboxIndex === -1) return;
    setActiveIndex(lightboxIndex);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      aria-label="Gallery"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.gallery.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {sections.gallery.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {sections.gallery.intro}
          </p>
        </motion.div>

        {loadableGallery.length > 0 ? (
          <ul className="mt-12 columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-3">
            {loadableGallery.map((photo, index) => (
              <GalleryGridItem
                key={photo.src}
                photo={photo}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
                onOpen={openLightbox}
                onLoadStatus={handleLoadStatus}
              />
            ))}
          </ul>
        ) : null}

        <BeforeAfterSection prefersReducedMotion={prefersReducedMotion} />

        <GalleryLightbox
          images={lightboxImages}
          activeIndex={activeIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          onNavigate={setActiveIndex}
        />
      </div>
    </section>
  );
}
