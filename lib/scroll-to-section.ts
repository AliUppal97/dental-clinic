const DEFAULT_HEADER_OFFSET = 72;

export function getStickyHeaderOffset(): number {
  const header = document.querySelector("header");
  if (!header) return DEFAULT_HEADER_OFFSET;
  return Math.ceil(header.getBoundingClientRect().height);
}

export function scrollToSection(
  href: string,
  options?: { behavior?: ScrollBehavior }
): void {
  const behavior = options?.behavior ?? "auto";

  if (href === "#home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  const offset = getStickyHeaderOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
}
