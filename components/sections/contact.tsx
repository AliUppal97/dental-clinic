"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { scrollRevealProps, SCROLL_REVEAL_STAGGER_S } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { LazyMapEmbed } from "@/components/shared/lazy-map-embed";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/sections/contact-form";
import { cn } from "@/lib/utils";

const { clinic, sections } = siteData;

const phoneHref = `tel:${clinic.phone.replace(/\s/g, "")}`;
const emailHref = `mailto:${clinic.email}`;
const whatsappHref = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
  "Hi, I'd like to book an appointment."
)}`;
const fullAddress = `${clinic.address.line1}, ${clinic.address.city} ${clinic.address.postalCode}`;

const STAGGER_S = SCROLL_REVEAL_STAGGER_S;

function QuickAction({
  href,
  label,
  description,
  icon: Icon,
  external,
  className,
}: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon | typeof WhatsAppIcon;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "group flex min-h-[4.75rem] flex-col justify-center rounded-2xl border border-border/60 bg-card/80 px-5 py-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:scale-[0.98] can-hover:hover:-translate-y-0.5 can-hover:hover:border-primary/25 can-hover:hover:shadow-md",
        className
      )}
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-200",
            "can-hover:group-hover:bg-primary/15"
          )}
        >
          <Icon aria-hidden className="h-5 w-5 text-primary" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">
            {label}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        </span>
      </span>
    </a>
  );
}

function ContactDetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon aria-hidden className="h-5 w-5 text-primary" />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="border-b border-border/60 bg-muted/20 px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.contact.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {sections.contact.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {sections.contact.intro}
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          {...scrollRevealProps(prefersReducedMotion, STAGGER_S)}
        >
          <QuickAction
            href={phoneHref}
            label="Call Us"
            description={clinic.phone}
            icon={Phone}
          />
          <QuickAction
            href={whatsappHref}
            label="WhatsApp"
            description="Fastest response"
            icon={WhatsAppIcon}
            external
            className="can-hover:hover:border-whatsapp/30"
          />
          <QuickAction
            href={emailHref}
            label="Email"
            description={clinic.email}
            icon={Mail}
          />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.article
            {...scrollRevealProps(prefersReducedMotion, STAGGER_S * 2)}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm"
          >
            <header className="border-b border-border/50 bg-primary/5 px-6 py-5">
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Clinic Information
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Visit us, call, or message — we are here to help.
              </p>
            </header>

            <div className="space-y-6 px-6 py-6">
              <ContactDetailRow icon={MapPin} label="Address">
                <address className="not-italic">
                  {clinic.address.line1}
                  <br />
                  {clinic.address.city} {clinic.address.postalCode}
                </address>
              </ContactDetailRow>

              <ContactDetailRow icon={Phone} label="Phone">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {clinic.phone}
                </a>
              </ContactDetailRow>

              <ContactDetailRow icon={Mail} label="Email">
                <a
                  href={emailHref}
                  className="inline-flex min-h-11 items-center break-all transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {clinic.email}
                </a>
              </ContactDetailRow>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Clock aria-hidden className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Opening Hours
                  </p>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <caption className="sr-only">Clinic opening hours</caption>
                    <tbody>
                      {clinic.hours.map((entry, index) => (
                        <tr
                          key={entry.day}
                          className={cn(
                            "border-b border-border/50 last:border-b-0",
                            index % 2 === 0 ? "bg-muted/30" : "bg-background"
                          )}
                        >
                          <th
                            scope="row"
                            className="px-4 py-3 text-left font-medium text-foreground"
                          >
                            {entry.day}
                          </th>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {entry.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            {...scrollRevealProps(prefersReducedMotion, STAGGER_S * 3)}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm"
          >
            <div className="relative min-h-64 flex-1">
              <LazyMapEmbed
                title={`Map showing location of ${clinic.name}`}
                src={clinic.address.googleMapsEmbedUrl}
                className="absolute inset-0"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-5 pb-5 pt-16"
              >
                <p className="flex items-start gap-2 text-sm font-medium text-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{fullAddress}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-border/50 bg-card/95 p-5">
              <Button variant="outline" size="lg" asChild className="min-h-11 w-full">
                <a
                  href={clinic.address.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation aria-hidden="true" />
                  Get Directions
                </a>
              </Button>
            </div>
          </motion.article>
        </div>

        <motion.article
          className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm lg:mt-12"
          {...scrollRevealProps(prefersReducedMotion, STAGGER_S * 4)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <aside className="border-b border-border/50 bg-primary/5 px-6 py-8 lg:col-span-2 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {sections.contact.formHeading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {sections.contact.formIntro}
              </p>

              {sections.contact.trustPoints.length > 0 ? (
                <ul className="mt-8 space-y-4">
                  {sections.contact.trustPoints.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      />
                      <span className="text-foreground/90">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <Button
                asChild
                size="lg"
                className="mt-8 hidden min-h-11 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 focus-visible:ring-whatsapp lg:inline-flex"
              >
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Message on WhatsApp
                </a>
              </Button>
            </aside>

            <div className="px-6 py-8 lg:col-span-3 lg:px-8 lg:py-10">
              <ContactForm />
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
