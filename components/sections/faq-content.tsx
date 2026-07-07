"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteData } from "@/lib/get-site-data";
import { scrollRevealProps } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import type { FAQ } from "@/lib/site-data-types";

const { faqs, clinic, sections } = siteData;

const whatsappHref = `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(
  "Hi, I have a question about your services."
)}`;

const validFaqs = faqs.filter(
  (faq) => faq.question.trim().length > 0 && faq.answer.trim().length > 0
);

function groupFaqsByCategory(items: FAQ[]): { category: string; items: FAQ[] }[] {
  const categoryOrder: string[] = [];

  for (const faq of items) {
    if (!categoryOrder.includes(faq.category)) {
      categoryOrder.push(faq.category);
    }
  }

  return categoryOrder.map((category) => ({
    category,
    items: items.filter((faq) => faq.category === category),
  }));
}

function FaqPlaceholder() {
  return (
    <section
      id="faqs"
      aria-label="FAQs"
      className="border-b border-border/60 px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.faqs.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {sections.faqs.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
            {sections.faqs.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center md:mt-16">
          <p className="text-sm text-muted-foreground">
            Frequently asked questions will appear here once content is added to
            site data.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FaqContent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (validFaqs.length === 0) {
    return <FaqPlaceholder />;
  }

  const groupedFaqs = groupFaqsByCategory(validFaqs);

  return (
    <section
      id="faqs"
      aria-label="FAQs"
      className="border-b border-border/60 px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          {...scrollRevealProps(prefersReducedMotion)}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {sections.faqs.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {sections.faqs.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
            {sections.faqs.intro}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 space-y-6 md:mt-16 md:space-y-8"
          {...scrollRevealProps(prefersReducedMotion, 0.1)}
        >
          {groupedFaqs.map((group) => (
            <article
              key={group.category}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm"
            >
              <header className="border-b border-border/50 bg-primary/5 px-5 py-4 md:px-6 md:py-5">
                <h3 className="flex items-center gap-3 font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  {group.category}
                </h3>
              </header>

              <Accordion type="single" collapsible className="w-full">
                {group.items.map((faq, index) => {
                  const itemId = `${group.category}-${index}`;

                  return (
                    <AccordionItem
                      key={itemId}
                      value={itemId}
                      className="border-b border-border/50 last:border-b-0"
                    >
                      <AccordionTrigger className="px-5 py-4 text-base font-medium text-foreground md:px-6 md:py-5 md:text-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 md:px-6 md:pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </article>
          ))}

          <div className="rounded-2xl border border-border/60 bg-card/80 px-6 py-8 text-center shadow-sm sm:px-8 md:px-10 md:py-10">
            <p className="text-lg font-medium text-foreground md:text-xl">
              Still have questions?
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Our team is happy to help — message us on WhatsApp and we&apos;ll
              get back to you promptly.
            </p>
            <Button asChild size="lg" className="mt-6 min-h-11 w-full sm:w-auto">
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="text-primary-foreground" />
                WhatsApp us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
