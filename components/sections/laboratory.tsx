"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FlaskConical, Mail, Phone } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { getServiceIcon } from "@/lib/service-icons";
import {
  SCROLL_REVEAL_VIEWPORT,
  scrollRevealProps,
  SCROLL_REVEAL_STAGGER_S,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GalleryImage, LabProcessStep, Service } from "@/lib/site-data-types";

const {
  clinic,
  servicesLab,
  labProcess,
  labPhotos,
  referringDentists,
  sections,
} = siteData;

const STAGGER_S = SCROLL_REVEAL_STAGGER_S;
const LAB_PHOTO_GRID_SLOTS = 3;

function LabServiceCard({
  service,
  index,
  prefersReducedMotion,
}: {
  service: Service;
  index: number;
  prefersReducedMotion: boolean;
}) {
  const Icon = getServiceIcon(service.icon);
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className="h-full"
    >
      <div
        className={cn(
          "group flex h-full gap-4 rounded-xl border border-border/80 bg-card/60 p-5 shadow-sm",
          "ring-1 ring-border/40 transition-[box-shadow,ring-color] duration-200",
          "can-hover:hover:shadow-md can-hover:hover:ring-primary/20"
        )}
      >
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="font-mono text-xs font-medium tabular-nums text-muted-foreground"
          >
            {stepNumber}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-h6 leading-snug text-foreground">{service.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

const NODE_SIZE = "h-12 w-12";
const CONNECTOR_STAGGER = 0.1;

function ProcessStepContent({
  step,
  index,
}: {
  step: LabProcessStep;
  index: number;
}) {
  return (
    <>
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
        Step {index + 1}
      </p>
      <h4 className="mt-1 text-sm font-semibold leading-snug text-foreground md:text-base">
        {step.title}
      </h4>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
        {step.description}
      </p>
    </>
  );
}

function DesktopProcessTimeline({
  steps,
  prefersReducedMotion,
}: {
  steps: LabProcessStep[];
  prefersReducedMotion: boolean;
}) {
  const lastIndex = steps.length - 1;
  const columnCount = steps.length * 2 - 1;
  const gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;

  return (
    <div className="hidden w-full lg:block" aria-label="Laboratory case workflow">
      {/* Node track — grid columns align nodes with labels below */}
      <div
        className="grid w-full items-center gap-y-4"
        style={{ gridTemplateColumns }}
      >
        {steps.map((step, index) => {
          const Icon = getServiceIcon(step.icon);

          return (
            <Fragment key={`node-${step.id}`}>
              <div className="flex justify-center px-1">
                <motion.div
                  initial={
                    prefersReducedMotion ? false : { scale: 0.9 }
                  }
                  whileInView={{ scale: 1 }}
                  viewport={SCROLL_REVEAL_VIEWPORT}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.35,
                          ease: "easeOut",
                          delay: 0.2 + index * CONNECTOR_STAGGER,
                        }
                  }
                  className={cn(
                    "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-sm",
                    NODE_SIZE
                  )}
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </motion.div>
              </div>
              {index < lastIndex ? (
                <motion.div
                  aria-hidden="true"
                  className="h-px w-full self-center bg-primary/40"
                  initial={prefersReducedMotion ? false : { scaleX: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
                  viewport={SCROLL_REVEAL_VIEWPORT}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.45,
                          ease: "easeInOut",
                          delay: 0.15 + index * CONNECTOR_STAGGER,
                        }
                  }
                  style={{ transformOrigin: "left center" }}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {/* Labels track — same column template as node track */}
      <ol
        className="mt-4 grid w-full"
        style={{ gridTemplateColumns }}
      >
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            <motion.li
              initial={prefersReducedMotion ? false : { y: 12 }}
              whileInView={{ y: 0 }}
              viewport={SCROLL_REVEAL_VIEWPORT}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.25 + index * CONNECTOR_STAGGER,
                    }
              }
              className="flex min-w-0 flex-col items-center px-2 text-center"
            >
              <ProcessStepContent step={step} index={index} />
            </motion.li>
            {index < lastIndex ? (
              <div aria-hidden="true" className="min-w-0" />
            ) : null}
          </Fragment>
        ))}
      </ol>
    </div>
  );
}

function MobileProcessTimeline({
  steps,
  prefersReducedMotion,
}: {
  steps: LabProcessStep[];
  prefersReducedMotion: boolean;
}) {
  const lastIndex = steps.length - 1;

  return (
    <ol
      className="grid grid-cols-[3rem_1fr] gap-x-4 lg:hidden"
      aria-label="Laboratory case workflow"
    >
      {steps.map((step, index) => {
        const Icon = getServiceIcon(step.icon);

        return (
          <Fragment key={step.id}>
            {/* Node rail — segments stretch to row height for a continuous vertical line */}
            <li className="flex flex-col items-center self-stretch">
              {index > 0 ? (
                <motion.div
                  aria-hidden="true"
                  className="w-px flex-1 bg-primary/40"
                  initial={prefersReducedMotion ? false : { scaleY: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scaleY: 1 }}
                  viewport={SCROLL_REVEAL_VIEWPORT}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.4,
                          ease: "easeInOut",
                          delay: 0.1 + (index - 1) * CONNECTOR_STAGGER,
                        }
                  }
                  style={{ transformOrigin: "top center" }}
                />
              ) : null}
              <motion.div
                initial={
                  prefersReducedMotion ? false : { scale: 0.9 }
                }
                whileInView={{ scale: 1 }}
                viewport={SCROLL_REVEAL_VIEWPORT}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.35,
                        ease: "easeOut",
                        delay: 0.2 + index * CONNECTOR_STAGGER,
                      }
                }
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-sm",
                  NODE_SIZE
                )}
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </motion.div>
              {index < lastIndex ? (
                <motion.div
                  aria-hidden="true"
                  className="w-px flex-1 bg-primary/40"
                  initial={prefersReducedMotion ? false : { scaleY: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scaleY: 1 }}
                  viewport={SCROLL_REVEAL_VIEWPORT}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.4,
                          ease: "easeInOut",
                          delay: 0.15 + index * CONNECTOR_STAGGER,
                        }
                  }
                  style={{ transformOrigin: "top center" }}
                />
              ) : null}
            </li>

            <motion.li
              initial={prefersReducedMotion ? false : { y: 12 }}
              whileInView={{ y: 0 }}
              viewport={SCROLL_REVEAL_VIEWPORT}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.4,
                      ease: "easeOut",
                      delay: 0.2 + index * CONNECTOR_STAGGER,
                    }
              }
              className={cn("pb-8 pt-1", index === lastIndex && "pb-0")}
            >
              <ProcessStepContent step={step} index={index} />
            </motion.li>
          </Fragment>
        );
      })}
    </ol>
  );
}

function LabProcessTimeline({
  steps,
  prefersReducedMotion,
}: {
  steps: LabProcessStep[];
  prefersReducedMotion: boolean;
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <>
      <MobileProcessTimeline
        steps={steps}
        prefersReducedMotion={prefersReducedMotion}
      />
      <DesktopProcessTimeline
        steps={steps}
        prefersReducedMotion={prefersReducedMotion}
      />
    </>
  );
}

function LabPhotoSlot({ photo, slotIndex }: { photo?: GalleryImage; slotIndex: number }) {
  const [imageError, setImageError] = useState(false);
  const hasPhoto = Boolean(photo?.src?.trim()) && !imageError;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-sm">
      {hasPhoto ? (
        <Image
          src={photo!.src}
          alt={photo!.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        // TODO: replace with real clinic photo
        <div
          aria-hidden="true"
          className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-background to-primary/5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FlaskConical className="h-7 w-7 text-primary/70" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Lab photo {slotIndex + 1}
          </span>
        </div>
      )}
    </div>
  );
}

function LabPhotosGrid({ photos }: { photos: GalleryImage[] }) {
  const slots = Array.from({ length: LAB_PHOTO_GRID_SLOTS }, (_, index) => ({
    index,
    photo: photos[index],
  }));

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {slots.map(({ index, photo }) => (
        <li key={photo?.src ?? `placeholder-${index}`}>
          <LabPhotoSlot photo={photo} slotIndex={index} />
        </li>
      ))}
    </ul>
  );
}

function ReferringDentistsCallout() {
  if (!referringDentists.enabled) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-h5">{referringDentists.heading}</CardTitle>
        <CardDescription className="text-body leading-relaxed">
          {referringDentists.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={`tel:${clinic.phone.replace(/\s/g, "")}`}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm",
            "transition-colors duration-200 hover:border-primary/30 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {clinic.phone}
        </Link>
        <Link
          href={`mailto:${clinic.email}`}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm",
            "transition-colors duration-200 hover:border-primary/30 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {clinic.email}
        </Link>
      </CardContent>
    </Card>
  );
}

export function Laboratory() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { laboratory } = sections;
  const hasLabServices = servicesLab.length > 0;
  const hasProcess = labProcess.length > 0;

  if (!hasLabServices && !hasProcess) {
    return null;
  }

  return (
    <section
      id="laboratory"
      aria-label="Laboratory"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {laboratory.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {laboratory.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {laboratory.intro}
          </p>
        </motion.div>

        {hasLabServices ? (
          <div className="mt-14 md:mt-16">
            <motion.p
              className="mb-6 text-center font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground"
              {...scrollRevealProps(prefersReducedMotion)}
            >
              {clinic.labName}
            </motion.p>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
              {servicesLab.map((service, index) => (
                <LabServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {hasProcess ? (
          <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 px-5 py-10 md:mt-20 md:px-10 md:py-12">
            <motion.h3
              className="text-center font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl"
              {...scrollRevealProps(prefersReducedMotion)}
            >
              {laboratory.processHeading}
            </motion.h3>
            <div className="mt-10 md:mt-12">
              <LabProcessTimeline
                steps={labProcess}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-16 md:mt-20">
          <motion.h3
            className="text-center font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            {...scrollRevealProps(prefersReducedMotion)}
          >
            {laboratory.photosHeading}
          </motion.h3>
          <div className="mt-8 md:mt-10">
            <LabPhotosGrid photos={labPhotos} />
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <ReferringDentistsCallout />
        </div>
      </div>
    </section>
  );
}
