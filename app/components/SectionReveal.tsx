"use client";

import { fadeUp, sectionViewport } from "@/app/lib/araya-motion";
import { motion, type HTMLMotionProps } from "framer-motion";

type SectionRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

/** Slow fade-up when section enters the viewport */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
      custom={delay}
      variants={fadeUp}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
