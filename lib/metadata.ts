import type { Metadata } from "next";

import { siteData } from "@/lib/get-site-data";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

function buildHomeTitle(): string {
  const { name, address } = siteData.clinic;
  return `${name} | Dental Clinic in ${address.city}`;
}

function buildDefaultDescription(): string {
  const { description, tagline } = siteData.clinic;
  return `${description} ${tagline}`.trim();
}

export function buildRootMetadata(overrides?: Partial<Metadata>): Metadata {
  const { clinic } = siteData;
  const title = buildHomeTitle();
  const description = buildDefaultDescription();
  const siteUrl = getSiteUrl();
  const ogImage = absoluteUrl(clinic.heroImage.src);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${clinic.name}`,
    },
    description,
    keywords: [
      clinic.name,
      `dentist ${clinic.address.city}`,
      `dental clinic ${clinic.address.city}`,
      ...siteData.servicesClinic.map((service) => service.name.toLowerCase()),
    ],
    authors: [{ name: clinic.name }],
    creator: clinic.name,
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: siteUrl,
      siteName: clinic.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: clinic.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: clinic.logoPath,
      apple: clinic.logoPath,
    },
    alternates: {
      canonical: siteUrl,
    },
    ...overrides,
  };
}

export function buildHomeMetadata(): Metadata {
  return buildRootMetadata();
}
