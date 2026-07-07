import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { buildHomeMetadata } from "@/lib/metadata";

const About = dynamic(
  () => import("@/components/sections/about").then((m) => ({ default: m.About })),
  { loading: () => <SectionSkeleton className="min-h-[28rem]" /> }
);

const Services = dynamic(
  () =>
    import("@/components/sections/services").then((m) => ({
      default: m.Services,
    })),
  { loading: () => <SectionSkeleton className="min-h-[28rem]" /> }
);

const Laboratory = dynamic(
  () =>
    import("@/components/sections/laboratory").then((m) => ({
      default: m.Laboratory,
    })),
  { loading: () => <SectionSkeleton className="min-h-[32rem]" /> }
);

const Gallery = dynamic(
  () =>
    import("@/components/sections/gallery").then((m) => ({ default: m.Gallery })),
  { loading: () => <SectionSkeleton className="min-h-[28rem]" /> }
);

const Testimonials = dynamic(
  () =>
    import("@/components/sections/testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  { loading: () => <SectionSkeleton className="min-h-[24rem]" /> }
);

const FAQ = dynamic(
  () => import("@/components/sections/faq").then((m) => ({ default: m.FAQ })),
  { loading: () => <SectionSkeleton className="min-h-[20rem]" /> }
);

const Contact = dynamic(
  () =>
    import("@/components/sections/contact").then((m) => ({ default: m.Contact })),
  { loading: () => <SectionSkeleton className="min-h-[36rem]" /> }
);

export const metadata = buildHomeMetadata();

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Laboratory />
      <Gallery />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
