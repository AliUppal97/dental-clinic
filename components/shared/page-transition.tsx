"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { pageFadeInProps } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div {...pageFadeInProps(prefersReducedMotion)}>{children}</motion.div>
  );
}
