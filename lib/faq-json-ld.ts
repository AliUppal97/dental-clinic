import type { FAQ } from "@/lib/site-data-types";

export function buildFaqPageJsonLd(faqs: FAQ[]) {
  const validFaqs = faqs.filter(
    (faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
