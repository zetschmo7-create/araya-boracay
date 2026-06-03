import type { Transition, Variants } from "framer-motion";

/** Editorial luxury easing — slow out, no bounce */
export const cinematicEase = [0.22, 0.03, 0.26, 1] as const;

export const cinematicTransition: Transition = {
  duration: 1.65,
  ease: cinematicEase,
};

export const hoverTransition: Transition = {
  duration: 0.85,
  ease: cinematicEase,
};

export const sectionViewport = {
  once: true,
  margin: "-10%",
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.65,
      delay,
      ease: cinematicEase,
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 1.85,
      delay,
      ease: cinematicEase,
    },
  }),
};

export const revealSection: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.75,
      ease: cinematicEase,
      when: "beforeChildren",
      staggerChildren: 0.14,
    },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.55, ease: cinematicEase },
  },
};
