# Dental Clinic & Laboratory Website — End-to-End Cursor Build Guide

Built by a virtual team: UX Strategist, Dental Industry Consultant, Frontend Architect, Motion Designer, Copywriter, and SEO/Accessibility Auditor.

Follow the phases **in order**. Each phase has: a **Cursor prompt** (copy-paste into Cursor's chat/Composer/Agent), a **rule** to lock in behavior, and a **test** to verify before moving on. Skip nothing — later phases assume earlier ones are done.

---

## PHASE 0 — Before You Open Cursor

### 0.1 Tech stack (recommended by the team)
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animation:** Framer Motion (page/scroll animations) + Lenis (smooth scroll, optional)
- **Forms:** React Hook Form + Zod validation
- **Icons:** lucide-react
- **Maps:** Google Maps embed (no API key needed for basic embed) or Leaflet
- **Deployment:** Vercel (free tier is enough)

Why: Next.js gives you SEO-friendly server rendering (critical for a local clinic that needs to rank on Google), Tailwind + shadcn keep the design system consistent, Framer Motion is the industry standard for the kind of clean scroll/hover animations a medical site needs without feeling gimmicky.

### 0.2 Information checklist — gather this BEFORE Phase 1
You (or the clinic) need to supply real values for all of these. They all map directly to fields in the `site-data.json` schema below (0.3) — fill this checklist out first, then transcribe it into the JSON.

- [ ] Clinic + Lab name(s) and tagline
- [ ] Full address (street, city, postal code) + Google Maps link
- [ ] Phone number(s) — landline and mobile
- [ ] WhatsApp Business number (with country code, e.g. `92300XXXXXXX`)
- [ ] Email address
- [ ] Working hours (per day, including holidays/Sunday policy)
- [ ] List of services (clinic side: e.g. General Dentistry, Orthodontics, Implants, Root Canal, Cosmetic Dentistry, Pediatric Dentistry) and (lab side: e.g. Crown & Bridge, Dentures, Veneers, Digital Scanning/CAD-CAM, Orthodontic Appliances)
- [ ] Doctor/team bios + headshots (name, qualification, specialty, years of experience)
- [ ] Clinic photos (interior, equipment, team) — at least 8–10 high-res images
- [ ] Before/after case photos (with patient consent) — optional but powerful
- [ ] Logo (SVG or high-res PNG)
- [ ] Brand color(s) if already established, otherwise team recommends a clinical-but-warm palette (see Phase 2)
- [ ] Social links (Instagram, Facebook, LinkedIn, Google Business Profile)
- [ ] Real FAQs — at least 8–10 (pull from what patients actually ask at reception)
- [ ] Testimonials/reviews (real, with patient first name + initial, or pull from Google Reviews)
- [ ] Any certifications/accreditations to display (ISO, dental council registration, etc.)

### 0.3 Single source of truth: `content/site-data.json`
This is the most important architectural decision in this guide. **Every single piece of clinic-specific content on the site — text, numbers, image paths, colors — lives in one JSON file.** No component is allowed to hardcode a phone number, a doctor's name, or a service description. When you onboard a new client (or this same client updates their hours, adds a doctor, changes their number), you edit **this one file** and nothing else.

Create `/content/site-data.json` in your project root before Phase 1, using this exact shape:

```json
{
  "clinic": {
    "name": "",
    "labName": "",
    "tagline": "",
    "description": "",
    "logoPath": "/images/logo.svg",
    "phone": "",
    "whatsapp": "923001234567",
    "email": "",
    "address": {
      "line1": "",
      "city": "",
      "postalCode": "",
      "googleMapsEmbedUrl": "",
      "googleMapsDirectionsUrl": ""
    },
    "hours": [
      { "day": "Monday - Saturday", "time": "10:00 AM - 8:00 PM" },
      { "day": "Sunday", "time": "Closed" }
    ],
    "socials": {
      "instagram": "",
      "facebook": "",
      "linkedin": "",
      "googleBusinessProfile": ""
    },
    "stats": [
      { "label": "Years of Experience", "value": "10+" },
      { "label": "Happy Patients", "value": "5000+" }
    ]
  },
  "theme": {
    "primaryColor": "#0F766E",
    "accentColor": "#F97316",
    "backgroundColor": "#FAF9F6"
  },
  "servicesClinic": [
    { "id": "general-dentistry", "name": "", "description": "", "icon": "Stethoscope" }
  ],
  "servicesLab": [
    { "id": "crown-bridge", "name": "", "description": "", "icon": "Cog" }
  ],
  "doctors": [
    { "id": "dr-1", "name": "", "title": "", "specialty": "", "bio": "", "photoPath": "/images/doctors/dr-1.jpg" }
  ],
  "gallery": [
    { "src": "/images/gallery/1.jpg", "alt": "" }
  ],
  "beforeAfter": [
    { "beforeSrc": "", "afterSrc": "", "caption": "" }
  ],
  "testimonials": [
    { "name": "", "rating": 5, "quote": "" }
  ],
  "faqs": [
    { "category": "Appointments", "question": "", "answer": "" }
  ],
  "certifications": [
    { "name": "", "iconPath": "" }
  ]
}
```

Fill in every field with real data before Phase 1 (leave arrays with one placeholder object if content isn't ready yet — Cursor will be instructed to render a graceful empty state rather than invent entries). **To onboard a future client, duplicate this file, replace the values, swap the images in `/public/images`, and the entire site updates — zero component code touched.**

> **Don't have real client data yet?** Use the ready-made `site-data.json` (fictional "Smile Care Dental Clinic," Lahore) provided alongside this guide as a drop-in demo. It's fully filled with realistic dummy content — services, doctors, FAQs, testimonials, hours — so you can build the entire site end-to-end and show the client a working, polished demo before they've given you a single real detail. Once they've seen it and are on board, replace this file with their actual information and swap the placeholder images — the whole site updates instantly with zero code changes. Just make sure the client understands the names/photos/reviews in the demo are placeholders, not real patients, before you show it to them.

> **What about images for the demo?** The dummy JSON references image paths like `/images/doctors/dr-1.jpg` that don't exist yet. For the pitch-only demo, tell Cursor to build graceful fallbacks (initials avatar for doctors, a soft icon/gradient placeholder for gallery and lab photos) instead of broken image icons — this is the one moment the "never use stock photos as if real" rule is intentionally relaxed to "use clearly generic/neutral placeholders," never photos of real people or another real clinic passed off as this one's.

---

## PHASE 1 — Project Scaffold

### Prompt
```
Create a new Next.js 14 project using the App Router, TypeScript, and Tailwind CSS.
Install and configure: framer-motion, lucide-react, react-hook-form, zod, @hookform/resolvers, shadcn/ui (init with the "neutral" base color).
Set up the folder structure:
/app
/components/ui        (shadcn components)
/components/sections   (page sections like Hero, Services, FAQ)
/components/shared      (Navbar, Footer, WhatsAppButton)
/lib
/content/site-data.json   (already exists — I've filled it in, do not overwrite it)
/public/images

Create a TypeScript type definition file /lib/site-data-types.ts that mirrors the exact shape of /content/site-data.json (interfaces for Clinic, Theme, Service, Doctor, GalleryImage, Testimonial, FAQ, etc.).

Create a single loader /lib/get-site-data.ts that imports the JSON, types it with those interfaces, and exports it as a typed `siteData` constant. Every component in every later phase must import `siteData` from this one file — never import the JSON directly and never inline content.

Also apply the theme.primaryColor / accentColor / backgroundColor from /content/site-data.json into the Tailwind CSS variables at build time (via a small script or by reading it into globals.css/tailwind.config.ts), so changing those three values in the JSON is enough to reskin the whole site.

Add a README explaining how to run the dev server and how to onboard a new client (edit /content/site-data.json and swap /public/images — nothing else). Do not add any placeholder Lorem Ipsum content — the real structure comes from /content/site-data.json.
```

### Cursor Rule (create `.cursor/rules/general.mdc`)
```
---
description: Global project rules for the dental clinic & lab website
alwaysApply: true
---
- This is a medical/dental website. Tone must be professional, clean, calm, and trustworthy — never salesy or gimmicky.
- Always use TypeScript, never plain JS.
- Use Tailwind CSS utility classes; do not write custom CSS files unless Tailwind cannot achieve the effect.
- Use shadcn/ui components as the base for buttons, cards, accordions, dialogs, and forms — do not hand-roll these from scratch.
- All animations must use Framer Motion and must be subtle: fade/slide-up on scroll, gentle hover states. No bouncy, cartoonish, or distracting motion on a healthcare site.
- SINGLE SOURCE OF TRUTH: all content (names, numbers, addresses, services, doctors, FAQs, testimonials, colors, image paths) must be imported from `siteData` (via /lib/get-site-data.ts), which reads /content/site-data.json. Never hardcode a phone number, name, address, color hex, or any client-specific string directly inside a component. If a needed field doesn't exist in site-data.json yet, add it to the JSON and the type file first, then consume it — do not inline it as a one-off.
- Never invent clinic details, doctor names, or fake statistics that aren't present in site-data.json — if an array in site-data.json is empty, render a graceful empty/hidden state, don't fabricate entries.
- All images must use next/image with proper alt text describing the medical context, and image paths must come from /content/site-data.json, not be hardcoded in JSX.
- FULLY RESPONSIVE, MOBILE-FIRST, NON-NEGOTIABLE: every component must be built and visually verified at 375px width first, then scaled up to 768px, 1024px, 1440px. No fixed pixel widths on containers — use responsive Tailwind classes (w-full, max-w-*, flex-col/flex-row switches, grid-cols-1 → md:grid-cols-3, etc.). No horizontal scroll is acceptable at any breakpoint. Touch targets must be at least 44x44px on mobile.
- Every interactive element must be keyboard-accessible and have visible focus states (WCAG AA minimum — this is a medical site, accessibility is non-negotiable).
- Never commit real patient data or PII into the repo.
```

### Test
```
Run `npm run dev`. Confirm the app boots with no console errors, Tailwind classes apply correctly, and the folder structure matches what was requested.
```

---

## PHASE 2 — Design System / Theme

### Prompt
```
Read /content/site-data.json for brand colors if provided. If none are provided, propose a clinical-but-warm color palette suitable for a dental clinic: a primary color in the blue or teal family (trust, cleanliness), a soft accent (e.g. mint or coral) for CTAs, and a warm neutral background (off-white, not stark white) to avoid a cold/sterile feel.

Configure this palette as CSS variables in globals.css and wire them into tailwind.config.ts as semantic tokens (primary, primary-foreground, accent, background, muted, border, etc.), following shadcn/ui conventions.

Set up typography: a clean sans-serif for body text (e.g. Inter or Manrope via next/font) and a slightly more distinctive sans or serif for headings to add warmth (e.g. Fraunces or Sora). Define a type scale (h1–h6, body, small) as Tailwind theme extensions.

Create a `/components/ui/theme-preview.tsx` temporary page at /theme-preview showing all colors, type scale, buttons, and cards so I can review before we build real pages.
```

### Rule addition (`.cursor/rules/design.mdc`)
```
---
description: Design system rules
alwaysApply: true
---
- Never use arbitrary hex values in components — always reference the Tailwind theme tokens defined in tailwind.config.ts.
- Maintain consistent spacing using Tailwind's spacing scale only (no arbitrary px values except for fine icon alignment).
- Border radius should be consistent site-wide (default to `rounded-xl` or `rounded-2xl` for cards, `rounded-full` for pills/buttons) — pick one system and stick to it.
- Shadows should be soft and minimal (shadow-sm/shadow-md), never heavy drop shadows.
```

### Test
```
Visit /theme-preview. Confirm colors feel clean/clinical/professional, text is legible at all scale steps, and everything is token-driven (search the codebase for raw hex codes — there should be none in components).
```
Delete `/theme-preview` route once approved.

---

## PHASE 3 — Navbar & Footer

### Prompt
```
Read /content/site-data.json for clinic name, logo, phone, and address.

Build a responsive Navbar component in /components/shared/navbar.tsx:
- Logo/clinic name on the left
- Nav links: Home, About, Services, Laboratory, Gallery, FAQs, Contact
- A "Call Now" and "Book Appointment" CTA button on the right (desktop)
- On mobile: hamburger menu that opens a full-screen animated drawer (Framer Motion slide/fade)
- Sticky on scroll with a subtle background blur/shadow that appears after scrolling past the hero
- Active link indicator for the current section

Build a Footer component in /components/shared/footer.tsx with:
- Clinic name, tagline, short description
- Quick links (same as nav)
- Contact block: address, phone, email, working hours
- Social icons (lucide-react) linking to social profiles from /content/site-data.json
- Embedded small Google Maps preview or "Get Directions" link
- Copyright line with current year computed dynamically
- Accreditation/certification badges if provided in content brief

Both must be fully responsive and accessible (proper landmark roles: <nav>, <footer>, aria-labels on icon-only links).
```

### Test
```
Test navbar at 375px, 768px, 1280px widths. Confirm mobile drawer opens/closes smoothly, all links scroll to correct sections, sticky behavior works, and footer contact info matches /content/site-data.json exactly.
```

---

## PHASE 4 — Hero Section

### Prompt
```
Read /content/site-data.json for clinic name, tagline, and services.

Build a Hero section in /components/sections/hero.tsx:
- Full-width, roughly 90vh on desktop
- Left: headline (clinic tagline, warm/reassuring, not clinical-cold), short supporting paragraph, two CTAs ("Book Appointment" primary, "WhatsApp Us" secondary with WhatsApp icon)
- Right: a professional clinic/team photo or a subtle illustration if no photo is provided yet (use a placeholder image component that's easy to swap)
- Add a trust strip below the fold-line: small stats or badges (e.g. "10+ Years Experience", "5000+ Happy Patients", "Certified Specialists") — pull real numbers from /content/site-data.json, or leave a clearly marked TODO if not provided, never invent numbers
- Animate on load with Framer Motion: staggered fade-up for headline, paragraph, CTAs (150ms stagger), and a subtle fade-in-scale for the image
- Add a soft decorative background element (blurred blob or subtle dot-grid pattern) using the primary/accent theme colors — keep it subtle, this is a medical site
```

### Test
```
Confirm hero loads with animation only once per page load (not on every re-render), text is readable over any background element, CTAs are functional (Book Appointment scrolls to/opens contact, WhatsApp opens wa.me link), and layout doesn't break at narrow widths.
```

---

## PHASE 5 — Services Section (Clinic)

### Prompt
```
Read the clinic services list from /site-data.json.

Build a Services section in /components/sections/services.tsx:
- Section heading + short intro
- Grid of service cards (3 columns desktop, 2 tablet, 1 mobile) using shadcn Card
- Each card: icon (lucide-react, choose contextually appropriate icons per service), service name, 1-2 line description, "Learn More" link
- Cards animate in with scroll-triggered fade-up (Framer Motion whileInView), staggered by index
- Hover state: gentle lift (translateY -4px) + shadow increase + icon color shift to accent — transition duration 200-250ms
- If more than 6 services exist, show 6 in a grid with a "View All Services" button that expands the rest or links to a /services page (ask me which behavior I prefer before deciding)
```

### Test
```
Scroll to services section slowly and confirm stagger animation triggers only once (not on every scroll direction change), grid reflows correctly at all breakpoints, hover states work on desktop and are gracefully disabled/replaced with tap feedback on touch devices.
```

---

## PHASE 6 — About / Doctors Section

### Prompt
```
Read doctor/team bios from /site-data.json.

Build an About section in /components/sections/about.tsx with:
- Clinic story/mission paragraph (professional, warm, patient-focused tone)
- A "Meet the Team" sub-section: doctor cards in a horizontal scroll on mobile, grid on desktop — each card shows headshot, name, qualification/credentials, specialty, and a short bio
- Use next/image with proper aspect-ratio and object-cover for headshots, with a graceful placeholder (initials avatar) if a photo isn't yet supplied
- Add subtle scroll-reveal animation matching the Services section for consistency
- Include an optional "Why Choose Us" mini-grid (3-4 differentiators: e.g. modern equipment, painless procedures, transparent pricing, flexible hours) pulled from /content/site-data.json
```

### Test
```
Confirm doctor cards degrade gracefully when a headshot is missing (no broken image icons), horizontal scroll works smoothly on mobile with visible scroll affordance, and text doesn't overflow cards with longer bios.
```

---

## PHASE 7 — Laboratory Section (Lab-Specific)

This is the section that differentiates a clinic+lab site from a plain clinic site — the team's dental-lab consultant flagged this as critical for credibility with referring dentists, not just patients.

### Prompt
```
Read lab services and any equipment/technology details from /site-data.json.

Build a Laboratory section in /components/sections/laboratory.tsx aimed at both patients and referring dentists:
- Heading positioning the lab (e.g. "In-House Dental Laboratory" / "Precision Prosthetics & Digital Dentistry")
- Grid or tabbed layout of lab services (Crown & Bridge, Dentures, Veneers, Implant Restorations, Orthodontic Appliances, Digital Scanning/CAD-CAM — use whatever is in site-data.json)
- A "Process" mini-timeline showing how a case moves from impression/scan → design → fabrication → quality check → delivery, animated with a horizontal (desktop) / vertical (mobile) connecting line that draws in on scroll (Framer Motion SVG path animation)
- If lab photos (equipment, workbench, technicians at work) are available in site-data.json, show them in a clean grid; otherwise leave clearly marked image placeholders
- A short "For Referring Dentists" callout box with a dedicated contact method (phone/email) if the clinic wants to accept outside lab work — ask me if this applies before building it
```

### Test
```
Confirm the process timeline animation plays smoothly once on scroll-into-view, is legible and doesn't look identical to the Services section (should feel distinct — more technical/precision-oriented), and works correctly in both tab/grid layout on all breakpoints.
```

---

## PHASE 8 — Gallery / Before-After

### Prompt
```
Read available clinic photos and before/after case photos from /site-data.json (or /public/images if I've already added them).

Build a Gallery section in /components/sections/gallery.tsx:
- Masonry or clean grid layout of clinic/equipment photos
- If before/after photos exist and patient consent is confirmed, build a Before/After slider component (drag/touch to reveal) using a simple custom component (no heavy external dependency needed) — otherwise skip this sub-feature entirely and do not use stock/fake before-after images
- Lightbox on click (use a lightweight approach, e.g. a shadcn Dialog with the full-size image) with keyboard navigation (arrow keys, Escape to close)
- Lazy-load images below the fold using next/image's built-in lazy loading
```

### Rule addition (`.cursor/rules/responsive.mdc`)
```
---
description: Responsiveness rules — applies to every component
alwaysApply: true
---
- Build and test every new component at 375px width FIRST, then verify at 640px, 768px, 1024px, 1280px, 1536px.
- Use Tailwind responsive prefixes (sm:, md:, lg:, xl:) for layout changes — never write separate mobile/desktop component variants.
- Grids: default to grid-cols-1, expand with md:grid-cols-2 / lg:grid-cols-3 rather than fixed column counts.
- Text: use responsive type scale (e.g. text-3xl md:text-5xl for headings) so nothing overflows or looks oversized on small screens.
- Never use fixed px widths on wrapping containers — use max-w-* with w-full and padding (px-4 md:px-8) instead.
- Any horizontal scroll on a section that isn't intentionally a carousel/scroll-snap is a bug and must be fixed before the phase is considered done.
- Test touch targets (buttons, nav links, accordion triggers) are at least 44x44px on mobile.
```

### Rule addition (`.cursor/rules/images.mdc`)
```
---
description: Image and media rules
alwaysApply: true
---
- Never use stock photos of "generic" dental scenes as if they are this clinic's real photos — if a real image isn't available, use a clearly neutral placeholder (soft gradient or icon) and leave a code comment `// TODO: replace with real clinic photo`.
- Never fabricate or display before/after images without explicit confirmation that real, consented patient images are being used.
- All images must have descriptive, specific alt text (e.g. "Dental implant procedure room with overhead light" not "dentist image").
```

### Test
```
Click through gallery on desktop and mobile, confirm lightbox keyboard nav works, before/after slider (if built) responds correctly to drag and touch, and no fake before/after content was generated.
```

---

## PHASE 9 — Testimonials

### Prompt
```
Read real testimonials from /site-data.json. If none are provided, build the component with a TODO placeholder state and do not invent reviews.

Build a Testimonials section in /components/sections/testimonials.tsx:
- Auto-advancing carousel (Framer Motion or a small custom hook — pause on hover/touch) showing patient name (first name + last initial), star rating, and quote
- 3 visible on desktop, 1 on mobile, smooth slide transition
- Optional: "Read more reviews on Google" link/button if a Google Business Profile link exists in site-data.json
```

### Test
```
Confirm carousel auto-advances at a reasonable interval (5-6s), pauses correctly on hover/focus, is swipeable on touch devices, and doesn't autoplay in a way that causes layout shift.
```

---

## PHASE 10 — FAQs

### Prompt
```
Read FAQs from /site-data.json (minimum 8, grouped logically if there are both clinic and lab questions).

Build a FAQ section in /components/sections/faq.tsx using shadcn Accordion:
- Group into categories if applicable (e.g. "Appointments", "Treatments", "Payments & Insurance", "Lab & Prosthetics")
- Single-open or multi-open accordion — default to single-open for a cleaner feel
- Smooth height animation on expand/collapse (Framer Motion AnimatePresence + height auto, or shadcn's built-in Radix animation)
- Add a "Still have questions? WhatsApp us" callout at the bottom linking to the WhatsApp number
- Add FAQPage structured data (JSON-LD schema.org) generated from the same FAQ content for SEO
```

### Test
```
Confirm accordion items expand/collapse smoothly with no layout jump, keyboard navigation works (Tab + Enter/Space), and view page source to confirm the FAQPage JSON-LD schema is present and valid (test in Google's Rich Results Test after deployment).
```

---

## PHASE 11 — Contact Section

### Prompt
```
Read address, phone, email, hours, and Google Maps link from /site-data.json.

Build a Contact section in /components/sections/contact.tsx:
- Two-column layout: left = contact info card (address, phone with tel: link, email with mailto: link, hours table, WhatsApp button), right = embedded Google Map (iframe embed using the address, no API key required) or a styled "Get Directions" card if embed isn't desired
- Below/beside: an appointment request form using react-hook-form + zod: Name, Phone, Preferred Date, Service Interested In (select, populated from services list), Message
- On submit: for now, wire it to a simple API route (/app/api/contact/route.ts) that logs the submission and returns success — flag clearly that this needs to be connected to a real email service (e.g. Resend, SendGrid) or a booking system before going live
- Show a success/error toast (shadcn toast/sonner) on submit
- Validate all fields client-side with clear, friendly error messages
```

### Test
```
Submit the form with valid and invalid data, confirm validation messages are clear, success toast appears on valid submit, tel: and mailto: links open correctly, and the map embed shows the correct location — verify the address pin matches /content/site-data.json exactly.
```

---

## PHASE 12 — WhatsApp Floating Chat Button

### Prompt
```
Read the WhatsApp number from /site-data.json.

Build a floating WhatsApp button component in /components/shared/whatsapp-button.tsx:
- Fixed position, bottom-right, visible on all pages/scroll positions, above other content (correct z-index) but never covering the mobile nav or form submit buttons
- WhatsApp brand green circular button with the WhatsApp icon (lucide-react "MessageCircle" or an inline WhatsApp SVG icon — prefer the recognizable WhatsApp glyph)
- On click: opens `https://wa.me/{{WHATSAPP_NUMBER}}?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment` in a new tab
- Subtle pulse/glow animation (very slow, low-opacity) to draw the eye without being annoying — must respect prefers-reduced-motion
- On mobile, add a small dismissible tooltip bubble ("Chat with us!") that appears once after a few seconds on first visit, then doesn't repeat (use sessionStorage, not something more persistent)
```

### Rule addition (`.cursor/rules/whatsapp.mdc`)
```
---
description: WhatsApp integration rules
alwaysApply: true
---
- Always wrap animation in a check for `prefers-reduced-motion` — pulse/glow effects must be disabled for users who have this OS setting on.
- Never trigger the WhatsApp link automatically without a user click.
- The floating button must never overlap the mobile CTA in the navbar/footer or the form submit button — check z-index and bottom spacing at 375px width specifically.
```

### Test
```
Click the WhatsApp button on mobile and desktop, confirm it opens WhatsApp Web (desktop) or the WhatsApp app (mobile) with the correct pre-filled message, confirm the pulse animation stops when prefers-reduced-motion is enabled (test via browser dev tools emulation), and confirm the tooltip only appears once per session.
```

---

## PHASE 13 — Full Animation Pass

Do this only after all sections above exist — it's a polish pass, not a build-from-scratch step.

### Prompt
```
Do a full animation consistency pass across the entire site:
- Ensure every section uses the same scroll-reveal pattern (fade-up, ~24px translate, 400-500ms duration, ease-out) unless a section has a deliberately distinct animation (Hero, Lab process timeline) that was intentionally designed to stand out
- Add a subtle page-load transition (fade-in) wrapping the whole app in /app/layout.tsx
- Add smooth-scroll behavior for anchor navigation (from Navbar links to sections)
- Audit and remove any animation that re-triggers unnecessarily on scroll-up/scroll-down flicker — every scroll-triggered animation should use `viewport={{ once: true }}` in Framer Motion unless there's a specific reason not to
- Wrap all animated components so they respect `prefers-reduced-motion: reduce` by falling back to instant appearance, no motion
- Test perceived performance: no animation should ever block interactivity or delay text becoming readable (avoid animating opacity from 0 in a way that hides content for slow-loading users — cap any content-hiding animation at 200ms max)
```

### Test
```
Slowly scroll the entire page top to bottom and back up. Confirm nothing flickers, re-triggers, or feels janky. Test with prefers-reduced-motion enabled in OS settings and confirm the site is still fully usable, just without motion. Run Lighthouse and confirm Cumulative Layout Shift (CLS) stays under 0.1.
```

---

## PHASE 14 — SEO & Metadata

### Prompt
```
Read clinic name, address, phone, and services from /site-data.json.

Implement SEO for the site:
- Set proper metadata (title, description, Open Graph tags, Twitter card) in /app/layout.tsx and per-page metadata using Next.js Metadata API
- Add LocalBusiness / Dentist structured data (JSON-LD) in the layout with name, address, phone, hours, geo coordinates if available, and priceRange if provided
- Generate a sitemap.xml and robots.txt using Next.js conventions (app/sitemap.ts, app/robots.ts)
- Add descriptive, keyword-natural page titles per section anchor if using a single-page site, or per route if multi-page
- Ensure all images have meaningful alt text (should already be true from earlier phases — verify)
- Add a favicon and apple-touch-icon using the clinic logo
```

### Test
```
View page source and confirm meta tags render correctly (not just client-side). Validate the LocalBusiness JSON-LD using Google's Rich Results Test after deployment. Confirm /sitemap.xml and /robots.txt are accessible.
```

---

## PHASE 15 — Responsive, Accessibility & Cross-Browser Audit

### Prompt
```
Do a full accessibility and responsiveness audit of the entire site:
- Check color contrast for all text/background combinations against WCAG AA (4.5:1 normal text, 3:1 large text) — flag and fix any failures using the theme tokens, not one-off overrides
- Verify every interactive element (buttons, links, form fields, accordion triggers) has a visible focus ring and is reachable via Tab key in a logical order
- Verify all images have alt text, all form fields have associated labels, and all icon-only buttons have aria-label
- Test and fix layout at 375px, 390px, 768px, 1024px, 1280px, 1536px widths — no horizontal scroll, no overlapping elements, no text truncation issues
- Confirm the site works with JavaScript-heavy animations disabled (progressive enhancement check)
```

### Test
```
Run the Lighthouse Accessibility audit — target score 95+. Manually tab through the entire page using only the keyboard and confirm you can reach and activate every interactive element, including the WhatsApp button and mobile nav drawer.
```

---

## PHASE 16 — Performance Optimization

### Prompt
```
Optimize site performance:
- Audit all images — confirm they're served via next/image with appropriate sizes prop, and compress/convert source images to WebP where possible
- Lazy-load below-the-fold sections and heavy components (e.g. Gallery lightbox) using next/dynamic where it makes sense
- Check bundle size — remove any unused dependencies
- Confirm fonts are loaded via next/font (no render-blocking external font requests)
- Add loading="lazy" appropriately and ensure the map iframe doesn't block initial page load (lazy-load the iframe on scroll-into-view)
```

### Test
```
Run Lighthouse Performance audit — target score 90+. Confirm Largest Contentful Paint (LCP) under 2.5s and Total Blocking Time is low. Test on a throttled "Slow 4G" network profile in dev tools.
```

---

## PHASE 17 — Final Content QA

### Prompt
```
Do a final content accuracy pass: cross-check every piece of displayed content (clinic name, address, phone, WhatsApp number, hours, doctor names, services, FAQs) against /content/site-data.json line by line and flag any mismatch, typo, or placeholder text still remaining in the codebase (search for "TODO", "Lorem", "{{", "placeholder").
```

### Test — Final Pre-Launch Checklist
```
[ ] All placeholder/TODO text removed
[ ] Phone numbers and WhatsApp link tested and dial/open correctly
[ ] Address matches Google Maps exactly, map pin is accurate
[ ] Contact form successfully sends/logs a test submission
[ ] Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100
[ ] Site tested on real iPhone and Android device, not just dev tools emulation
[ ] Favicon and social share preview image (Open Graph) display correctly when link is shared
[ ] 404 page exists and is on-brand
[ ] SSL/HTTPS confirmed after deployment
[ ] Google Business Profile linked and matches site NAP (Name, Address, Phone) exactly for local SEO
```

---

## PHASE 18 — Deployment

### Prompt
```
Prepare the project for deployment to Vercel:
- Confirm all environment variables (if any, e.g. email service API key for the contact form) are documented in a .env.example file, and real secrets are in .env.local (gitignored)
- Add a production build check: run `npm run build` and fix any type errors or build warnings
- Confirm the site has no console.log statements left in production code
```

### Test
```
Deploy to Vercel (connect GitHub repo, or use `vercel` CLI), visit the live URL on desktop and mobile, and re-run the full Phase 17 checklist against the live production URL — dev-mode passing is not sufficient, production must be verified separately.
```

---

## Quick Reference: All Cursor Rule Files to Create

Place these in `.cursor/rules/` (Cursor auto-applies rules marked `alwaysApply: true`):

1. `general.mdc` — Phase 1 (includes the single-source-of-truth rule)
2. `design.mdc` — Phase 2
3. `responsive.mdc` — Phase 3
4. `images.mdc` — Phase 8
5. `whatsapp.mdc` — Phase 12

You can also add a fifth, optional rule for how Cursor should behave when you ask for changes later:

```
---
description: Change-request behavior
alwaysApply: true
---
- When asked to modify an existing section, only touch the files relevant to that section — do not refactor unrelated components as a side effect.
- Always re-run the relevant Test checklist (from the build guide) mentally before declaring a change complete, and note in your response what you'd manually verify.
- If a requested change conflicts with an accessibility or content-accuracy rule above, flag the conflict instead of silently overriding the rule.
```

---

## How to Use This Guide in Cursor

1. Open Cursor, create/open your project folder.
2. Fill in **Phase 0.3's JSON schema** and save it as `/content/site-data.json` with real clinic data.
3. Open Cursor's Composer/Agent (Cmd/Ctrl+I), paste each **Phase prompt** one at a time, in order.
4. After each phase, run the matching **Test** yourself before moving to the next prompt — don't batch multiple phases into one prompt, the animations and content depend on earlier structure being correct.
5. Create the `.cursor/rules/*.mdc` files early (end of Phase 1–3) so every subsequent prompt is automatically constrained by them.
6. Use Phase 17's checklist before every deploy, not just the first one.

## Reusing This Build for Your Next Client
Because everything content-specific lives in `/content/site-data.json` (and images in `/public/images`), this becomes a reusable template for future dental clinic clients:
1. Duplicate the whole repo (or keep it as a private GitHub template).
2. Replace `/content/site-data.json` with the new client's data and swap `/public/images`.
3. Adjust `theme.primaryColor` / `accentColor` if the new client wants different brand colors — the whole site reskins automatically since Phase 1 wired the theme tokens to read from the JSON.
4. Deploy as a new Vercel project.
No component code should need to change at all for a same-structure clinic. If the new client needs an extra section (e.g. an insurance-partners logo strip), that's the only time you'd write new component code — everything else is a data swap.
