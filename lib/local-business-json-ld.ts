import { siteData } from "@/lib/get-site-data";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import type { ClinicHours } from "@/lib/site-data-types";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function expandDayRange(dayLabel: string): string[] {
  const normalized = dayLabel.trim();

  if (normalized.includes(" - ")) {
    const [startDay, endDay] = normalized.split(" - ").map((part) => part.trim());
    const startIndex = DAY_NAMES.indexOf(startDay as (typeof DAY_NAMES)[number]);
    const endIndex = DAY_NAMES.indexOf(endDay as (typeof DAY_NAMES)[number]);

    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      return DAY_NAMES.slice(startIndex, endIndex + 1);
    }
  }

  if (DAY_NAMES.includes(normalized as (typeof DAY_NAMES)[number])) {
    return [normalized];
  }

  return [];
}

function parseTimeTo24Hour(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return time.trim();
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function parseTimeRange(timeLabel: string): { opens: string; closes: string } | null {
  const [opensRaw, closesRaw] = timeLabel.split(" - ").map((part) => part.trim());

  if (!opensRaw || !closesRaw) {
    return null;
  }

  return {
    opens: parseTimeTo24Hour(opensRaw),
    closes: parseTimeTo24Hour(closesRaw),
  };
}

function buildOpeningHoursSpecification(hours: ClinicHours[]) {
  return hours.flatMap((entry) => {
    if (entry.time.trim().toLowerCase() === "closed") {
      return [];
    }

    const dayOfWeek = expandDayRange(entry.day);
    const timeRange = parseTimeRange(entry.time);

    if (dayOfWeek.length === 0 || !timeRange) {
      return [];
    }

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens: timeRange.opens,
        closes: timeRange.closes,
      },
    ];
  });
}

export function buildLocalBusinessJsonLd() {
  const { clinic, servicesClinic } = siteData;
  const { address, geo, priceRange } = clinic;

  const sameAs = Object.values(clinic.socials).filter(
    (url) => typeof url === "string" && url.trim().length > 0
  );

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness"],
    "@id": absoluteUrl("/#organization"),
    name: clinic.name,
    description: clinic.description,
    url: getSiteUrl(),
    telephone: clinic.phone,
    email: clinic.email,
    image: [absoluteUrl(clinic.logoPath), absoluteUrl(clinic.heroImage.src)],
    logo: absoluteUrl(clinic.logoPath),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.line1,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    openingHoursSpecification: buildOpeningHoursSpecification(clinic.hours),
    areaServed: address.city,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Services",
      itemListElement: servicesClinic.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
      })),
    },
  };

  if (sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  if (geo) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  if (priceRange?.trim()) {
    jsonLd.priceRange = priceRange.trim();
  }

  return jsonLd;
}
