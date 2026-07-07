"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { getServiceIcon } from "@/lib/service-icons";
import { scrollRevealProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/lib/site-data-types";

const { clinic, doctors, whyChooseUs, sections } = siteData;
const STAGGER_S = SCROLL_REVEAL_STAGGER_S;

function getDoctorInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => word.length > 0 && !word.endsWith("."))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function DoctorHeadshot({ doctor }: { doctor: Doctor }) {
  const [imageError, setImageError] = useState(false);
  const hasPhoto = Boolean(doctor.photoPath?.trim()) && !imageError;
  const initials = getDoctorInitials(doctor.name);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-xl bg-muted">
      {hasPhoto ? (
        <Image
          src={doctor.photoPath!}
          alt={`Portrait of ${doctor.name}, ${doctor.specialty}`}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 320px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full min-h-[12rem] flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

function DoctorCard({
  doctor,
  index,
  prefersReducedMotion,
}: {
  doctor: Doctor;
  index: number;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className={cn(
        "h-full w-[min(85vw,20rem)] shrink-0 snap-start",
        "md:w-auto md:shrink"
      )}
    >
      <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card/80 shadow-sm">
        <DoctorHeadshot doctor={doctor} />
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-h5 leading-snug">{doctor.name}</CardTitle>
          <p className="text-sm font-medium text-primary">{doctor.title}</p>
          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        </CardHeader>
        <CardContent className="flex-1 pt-0">
          <CardDescription className="line-clamp-5 break-words text-body leading-relaxed">
            {doctor.bio}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.li>
  );
}

function DifferentiatorCard({
  item,
  index,
  prefersReducedMotion,
}: {
  item: (typeof whyChooseUs)[number];
  index: number;
  prefersReducedMotion: boolean;
}) {
  const Icon = getServiceIcon(item.icon);

  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className="h-full"
    >
      <Card className="h-full border-border/60 bg-card/80 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <CardTitle className="text-h6">{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="break-words text-body leading-relaxed">
            {item.description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.li>
  );
}

export function About() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { about } = sections;
  const hasDoctors = doctors.length > 0;
  const hasDifferentiators = whyChooseUs.length > 0;

  return (
    <section
      id="about"
      aria-label="About"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {about.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {about.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {clinic.description}
          </p>
        </motion.div>

        {hasDoctors ? (
          <div className="mt-16">
            <motion.h3
              className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              {...scrollRevealProps(prefersReducedMotion)}
            >
              {about.teamHeading}
            </motion.h3>

            <div className="relative mt-8 md:mt-10">
              <ul
                className={cn(
                  "flex gap-6 overflow-x-auto pb-4 pt-1",
                  "snap-x snap-mandatory scroll-smooth",
                  "[scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]",
                  "md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 lg:gap-8"
                )}
                aria-label="Dental team members"
              >
                {doctors.map((doctor, index) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    index={index}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </ul>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-center justify-end bg-gradient-to-l from-background via-background/80 to-transparent md:hidden"
              >
                <span className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-muted-foreground md:hidden">
              Swipe to meet the full team
            </p>
          </div>
        ) : null}

        {hasDifferentiators ? (
          <div className="mt-16 md:mt-20">
            <motion.h3
              className="text-center font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              {...scrollRevealProps(prefersReducedMotion)}
            >
              {about.whyChooseUsHeading}
            </motion.h3>

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {whyChooseUs.map((item, index) => (
                <DifferentiatorCard
                  key={item.id}
                  item={item}
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
