import { siteData } from "@/lib/get-site-data";
import { buildFaqPageJsonLd } from "@/lib/faq-json-ld";
import { FaqContent } from "@/components/sections/faq-content";

export function FAQ() {
  const jsonLd = buildFaqPageJsonLd(siteData.faqs);

  return (
    <>
      {jsonLd.mainEntity.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <FaqContent />
    </>
  );
}
