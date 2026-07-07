import Link from "next/link";
import {
  Award,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";
import { LazyMapEmbed } from "@/components/shared/lazy-map-embed";
import { Button } from "@/components/ui/button";

const phoneHref = `tel:${siteData.clinic.phone.replace(/\s/g, "")}`;
const emailHref = `mailto:${siteData.clinic.email}`;

const socialLinks = [
  {
    key: "instagram",
    href: siteData.clinic.socials.instagram,
    label: "Follow us on Instagram",
    icon: Instagram,
  },
  {
    key: "facebook",
    href: siteData.clinic.socials.facebook,
    label: "Follow us on Facebook",
    icon: Facebook,
  },
  {
    key: "linkedin",
    href: siteData.clinic.socials.linkedin,
    label: "Connect on LinkedIn",
    icon: Linkedin,
  },
  {
    key: "googleBusinessProfile",
    href: siteData.clinic.socials.googleBusinessProfile,
    label: "View our Google Business profile",
    icon: MapPin,
  },
] as const;

export function Footer() {
  const { clinic, certifications } = siteData;
  const currentYear = new Date().getFullYear();
  const fullAddress = `${clinic.address.line1}, ${clinic.address.city} ${clinic.address.postalCode}`;

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <p className="font-heading text-xl font-semibold text-foreground">
              {clinic.name}
            </p>
            <p className="text-sm font-medium text-primary">{clinic.tagline}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {clinic.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ key, href, label, icon: Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "inline-flex h-11 w-11 items-center justify-center rounded-full",
                    "border border-border bg-background text-muted-foreground transition-colors",
                    "hover:border-primary/30 hover:text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">
              Quick Links
            </h2>
            <nav aria-label="Footer navigation" className="mt-4">
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">
              Contact Us
            </h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                />
                <address className="not-italic leading-relaxed">
                  {clinic.address.line1}
                  <br />
                  {clinic.address.city} {clinic.address.postalCode}
                </address>
              </li>
              <li>
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-3 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                  {clinic.phone}
                </a>
              </li>
              <li>
                <a
                  href={emailHref}
                  className="inline-flex min-h-11 items-center gap-3 break-all transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
                  {clinic.email}
                </a>
              </li>
              <li>
                <div className="flex gap-3">
                  <Clock
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  />
                  <ul className="space-y-1">
                    {clinic.hours.map((entry) => (
                      <li key={entry.day}>
                        <span className="font-medium text-foreground">{entry.day}</span>
                        {": "}
                        {entry.time}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">
              Find Us
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-background shadow-sm">
              <LazyMapEmbed
                title={`Map showing location of ${clinic.name}`}
                src={clinic.address.googleMapsEmbedUrl}
                className="h-40"
              />
            </div>
            <Button variant="outline" size="sm" asChild className="mt-4 w-full">
              <a
                href={clinic.address.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden="true" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>

        {certifications.length > 0 ? (
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="sr-only">Accreditations and certifications</h2>
            <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {certifications.map((cert) => (
                <li
                  key={cert.name}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="max-w-xs text-sm font-medium text-foreground">
                    {cert.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border bg-muted/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-foreground/75 md:flex-row md:px-8 md:text-left">
          <p>
            &copy; {currentYear} {clinic.name}. All rights reserved.
          </p>
          <p className="text-xs">{fullAddress}</p>
        </div>
      </div>
    </footer>
  );
}
