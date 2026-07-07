"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { siteData } from "@/lib/get-site-data";
import { NAV_LINKS } from "@/lib/nav-links";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ClinicLogo } from "@/components/shared/clinic-logo";

const phoneHref = `tel:${siteData.clinic.phone.replace(/\s/g, "")}`;
const SCROLL_THRESHOLD = 12;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const sectionElements = NAV_LINKS.map((link) =>
      document.querySelector<HTMLElement>(link.href)
    ).filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );

    sectionElements.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !drawerRef.current) return;

    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      closeMobileMenu();
      scrollToSection(href, {
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [closeMobileMenu, prefersReducedMotion]
  );

  const drawerTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };

  const mobileMenu =
    isMounted &&
    createPortal(
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-[60] bg-foreground/30 xl:hidden"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
              transition={drawerTransition}
              onClick={closeMobileMenu}
            />

            <motion.div
              id="mobile-nav-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-border bg-background px-4 pb-8 pt-[calc(var(--site-header-height)+1rem)] shadow-lg xl:hidden"
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }
              }
              transition={drawerTransition}
            >
              <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {NAV_LINKS.map((link, index) => {
                  const sectionId = link.href.replace("#", "");
                  const isActive = activeSection === sectionId;

                  return (
                    <motion.li
                      key={link.href}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { delay: index * 0.05, duration: 0.3 }
                      }
                    >
                      <a
                        href={link.href}
                        className={cn(
                          "flex min-h-11 items-center rounded-xl px-4 py-3 text-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          handleNavClick(link.href);
                        }}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-col gap-3 border-t border-border pt-6">
                <Button variant="outline" size="lg" asChild className="w-full">
                  <a href={phoneHref}>
                    <Phone aria-hidden="true" />
                    Call Now
                  </a>
                </Button>
                <Button size="lg" asChild className="w-full">
                  <a
                    href="#contact"
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick("#contact");
                    }}
                  >
                    Book Appointment
                  </a>
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300",
        isScrolled || mobileOpen
          ? "border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto grid min-h-[var(--site-header-height)] max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 md:px-8 xl:grid-cols-[minmax(0,auto)_minmax(0,1fr)_auto] xl:gap-4 xl:py-3"
      >
        <a
          href="#home"
          className="min-w-0 justify-self-start rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={(event) => {
            event.preventDefault();
            handleNavClick("#home");
          }}
        >
          <ClinicLogo
            showName
            className="min-w-0 max-w-full"
            nameClassName="truncate max-w-[9.5rem] sm:max-w-[12rem] md:max-w-none lg:max-w-[14rem] xl:max-w-[11rem] 2xl:max-w-none"
          />
        </a>

        <ul className="hidden min-w-0 items-center justify-center gap-0.5 xl:flex 2xl:gap-1">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  className={cn(
                    "relative block whitespace-nowrap rounded-lg px-2 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 2xl:px-3",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary 2xl:inset-x-3"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center justify-end gap-2 justify-self-end">
          <div className="hidden items-center gap-2 xl:flex">
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <a href={phoneHref} aria-label={`Call ${siteData.clinic.phone}`}>
                <Phone aria-hidden="true" />
                <span className="hidden 2xl:inline">Call Now</span>
              </a>
            </Button>
            <Button size="sm" asChild className="shrink-0">
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  handleNavClick("#contact");
                }}
              >
                <span className="2xl:hidden">Book</span>
                <span className="hidden 2xl:inline">Book Appointment</span>
              </a>
            </Button>
          </div>

          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="shrink-0 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </nav>
    </header>
    {mobileMenu}
    </>
  );
}
