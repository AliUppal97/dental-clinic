import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteData } from "@/lib/get-site-data";

const colorTokens = [
  { name: "Background", className: "bg-background text-foreground", border: true },
  { name: "Foreground", className: "bg-foreground text-background" },
  { name: "Primary", className: "bg-primary text-primary-foreground" },
  { name: "Primary Foreground", className: "bg-primary-foreground text-primary", border: true },
  { name: "Secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "Muted", className: "bg-muted text-muted-foreground" },
  { name: "Accent", className: "bg-accent text-accent-foreground" },
  { name: "Destructive", className: "bg-destructive text-destructive-foreground" },
  { name: "Border", className: "bg-border text-foreground" },
  { name: "Card", className: "bg-card text-card-foreground", border: true },
] as const;

const typeScale = [
  { label: "Heading 1", className: "text-h1 font-heading", sample: siteData.clinic.tagline },
  { label: "Heading 2", className: "text-h2 font-heading", sample: siteData.clinic.name },
  { label: "Heading 3", className: "text-h3 font-heading", sample: siteData.servicesClinic[0].name },
  { label: "Heading 4", className: "text-h4 font-heading", sample: siteData.doctors[0].name },
  { label: "Heading 5", className: "text-h5 font-heading", sample: siteData.doctors[0].specialty },
  { label: "Heading 6", className: "text-h6 font-heading", sample: siteData.clinic.hours[0].day },
  { label: "Body", className: "text-body", sample: siteData.clinic.description },
  { label: "Small", className: "text-small text-muted-foreground", sample: `${siteData.clinic.hours[0].day} · ${siteData.clinic.hours[0].time}` },
] as const;

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-h3 font-heading text-foreground">{title}</h2>
      <p className="text-body text-muted-foreground">{description}</p>
    </div>
  );
}

function ColorSwatch({
  name,
  className,
  border,
}: {
  name: string;
  className: string;
  border?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`flex h-20 items-end rounded-xl p-3 shadow-sm ${className} ${border ? "border border-border" : ""}`}
      >
        <span className="text-small font-medium">{name}</span>
      </div>
      <p className="text-small text-muted-foreground">{name}</p>
    </div>
  );
}

export function ThemePreview() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 md:px-8 md:py-16">
      <header className="space-y-4 border-b border-border pb-10">
        <p className="text-small font-medium uppercase tracking-wide text-primary">
          Phase 2 — Design System Preview
        </p>
        <h1 className="text-h1 font-heading text-foreground">Theme Preview</h1>
        <p className="max-w-2xl text-body text-muted-foreground">
          Review colors, typography, and UI primitives for{" "}
          <span className="font-medium text-foreground">{siteData.clinic.name}</span>.
          All values are driven by tokens from{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 text-small">site-data.json</code>.
        </p>
      </header>

      <section className="space-y-8" aria-labelledby="colors-heading">
        <SectionHeading
          title="Color Palette"
          description="Semantic tokens synced from site-data.json theme colors."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colorTokens.map((token) => (
            <ColorSwatch
              key={token.name}
              name={token.name}
              className={token.className}
              border={"border" in token ? token.border : undefined}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="typography-heading">
        <SectionHeading
          title="Typography"
          description="Manrope for body text, Sora for headings — responsive type scale."
        />
        <div className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          {typeScale.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 border-b border-border pb-8 last:border-0 last:pb-0 md:grid-cols-[140px_1fr] md:gap-6"
            >
              <p className="text-small font-medium text-muted-foreground">{item.label}</p>
              <p className={item.className}>{item.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="buttons-heading">
        <SectionHeading
          title="Buttons"
          description="shadcn/ui button variants using theme tokens."
        />
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="cards-heading">
        <SectionHeading
          title="Cards"
          description="Standard card pattern for services, doctors, and testimonials."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{siteData.servicesClinic[0].name}</CardTitle>
              <CardDescription>
                {siteData.servicesClinic[0].description.split(".")[0]}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
                {siteData.servicesClinic[0].description}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Learn more
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>{siteData.servicesClinic[4].name}</CardTitle>
              <CardDescription>{siteData.servicesClinic[4].description.split(".")[0]}.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-muted-foreground">
                {siteData.servicesClinic[4].description}
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Book appointment</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Testimonial</CardTitle>
              <CardDescription>
                {siteData.testimonials[0].name} · {"★".repeat(siteData.testimonials[0].rating)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body italic text-muted-foreground">
                &ldquo;{siteData.testimonials[0].quote}&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center">
        <p className="text-small text-muted-foreground">
          Temporary preview page — delete the{" "}
          <code className="rounded-md bg-background px-1.5 py-0.5">/theme-preview</code> route once approved.
        </p>
      </footer>
    </div>
  );
}
