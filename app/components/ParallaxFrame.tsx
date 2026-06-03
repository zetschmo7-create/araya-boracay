"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type ParallaxFrameProps = {
  children: ReactNode;
  className?: string;
  /** Vertical drift range in % — keep low for editorial calm */
  strength?: number;
};

/** Gentle scroll parallax for photography — disabled when reduced motion is preferred */
export function ParallaxFrame({
  children,
  className = "",
  strength = 5,
}: ParallaxFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-0 min-h-[112%] w-full -top-[6%]"
      >
        {children}
      </motion.div>
    </div>
  );
}
