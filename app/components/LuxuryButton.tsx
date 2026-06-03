"use client";

import { cinematicEase, hoverTransition } from "@/app/lib/araya-motion";
import { motion } from "framer-motion";

type LuxuryButtonProps = {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  /** Light text on dark hero / CTA */
  light?: boolean;
  className?: string;
};

export function LuxuryButton({
  href,
  children,
  primary = false,
  light = true,
}: LuxuryButtonProps) {
  const baseMotion = {
    whileHover: { y: -2, transition: hoverTransition },
    whileTap: { scale: 0.995, transition: hoverTransition },
    transition: { duration: 0.85, ease: cinematicEase },
  };

  if (primary) {
    return (
      <motion.a
        href={href}
        {...baseMotion}
        className="inline-block rounded-sm border border-coconut/50 bg-coconut/20 px-10 py-4 text-center text-[10px] font-light tracking-[0.36em] text-coconut uppercase shadow-[var(--shadow-lift)] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-700 hover:border-coconut hover:bg-coconut/30 hover:shadow-[var(--shadow-editorial)] md:px-12"
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      {...baseMotion}
      className={`inline-block border-b pb-1.5 text-center text-[10px] font-light tracking-[0.36em] uppercase transition-[border-color,color] duration-700 ${
        light
          ? "border-coconut/60 text-coconut/90 hover:border-coconut hover:text-coconut"
          : "border-teak/50 text-espresso-soft hover:border-teak-deep hover:text-teak-deep"
      }`}
    >
      {children}
    </motion.a>
  );
}
