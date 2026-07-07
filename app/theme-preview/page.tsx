import type { Metadata } from "next";

import { ThemePreview } from "@/components/ui/theme-preview";
import { siteData } from "@/lib/get-site-data";

export const metadata: Metadata = {
  title: `Theme Preview | ${siteData.clinic.name}`,
  description: "Temporary design system preview for review.",
  robots: { index: false, follow: false },
};

export default function ThemePreviewPage() {
  return (
    <main>
      <ThemePreview />
    </main>
  );
}
