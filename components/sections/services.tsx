"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { getServiceIcon } from "@/lib/service-icons";
import { scrollRevealProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const { servicesClinic, sections } = siteData;
const INITIAL_VISIBLE_COUNT = 6;
const STAGGER_S = SCROLL_REVEAL_STAGGER_S;

function ServiceCard({
  index,
  service,
  prefersReducedMotion,
}: {
  index: number;
  service: (typeof servicesClinic)[number];
  prefersReducedMotion: boolean;
}) {
  const Icon = getServiceIcon(service.icon);

  return (
    <motion.li
      {...scrollRevealProps(prefersReducedMotion, index * STAGGER_S)}
      className="h-full"
    >
      <Card
        className={cn(
          "group flex h-full flex-col border-border/60 bg-card/80 shadow-sm",
          "transition-[transform,box-shadow] duration-200 ease-out",
          "active:scale-[0.98] active:shadow-md",
          "can-hover:hover:-translate-y-1 can-hover:hover:shadow-md"
        )}
      >
        <CardHeader className="space-y-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10",
              "transition-colors duration-200 ease-out",
              "can-hover:group-hover:bg-accent/10"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 text-primary",
                "transition-colors duration-200 ease-out",
                "can-hover:group-hover:text-accent-text"
              )}
              aria-hidden="true"
            />
          </div>
          <CardTitle className="text-h5">{service.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <CardDescription className="text-body leading-relaxed">
            {service.description}
          </CardDescription>
        </CardContent>

        <CardFooter>
          <Link
            href="#contact"
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary",
              "transition-colors duration-200 ease-out",
              "hover:text-accent-text active:text-accent-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label={`Learn more about ${service.name}`}
          >
            Learn More
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CardFooter>
      </Card>
    </motion.li>
  );
}

export function Services() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const hasMoreThanInitial = servicesClinic.length > INITIAL_VISIBLE_COUNT;
  const visibleServices =
    expanded || !hasMoreThanInitial
      ? servicesClinic
      : servicesClinic.slice(0, INITIAL_VISIBLE_COUNT);

  if (servicesClinic.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      aria-label="Services"
      className="border-b border-border/60 px-4 py-16 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.services.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {sections.services.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {sections.services.intro}
          </p>
        </motion.div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              index={index}
              service={service}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </ul>

        {hasMoreThanInitial && !expanded ? (
          <motion.div
            className="mt-10 flex justify-center"
            {...scrollRevealProps(prefersReducedMotion, STAGGER_S * 6)}
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="min-h-11"
              onClick={() => setExpanded(true)}
            >
              View All Services
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
