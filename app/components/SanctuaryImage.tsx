"use client";

import { SECTION_MEDIA, type ArayaMediaKey } from "@/app/lib/araya-media";
import { cinematicEase } from "@/app/lib/araya-motion";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export type SanctuaryOverlay =
  | "hero"
  | "signature"
  | "editorial"
  | "text-light"
  | "text-dark"
  | "warm"
  | "none";

const OVERLAY_CLASS: Record<SanctuaryOverlay, string> = {
  hero: "bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent",
  signature:
    "bg-gradient-to-b from-espresso/45 via-espresso/15 to-espresso/65",
  editorial:
    "bg-gradient-to-r from-espresso/55 via-espresso/12 to-transparent lg:bg-gradient-to-l lg:from-espresso/45 lg:via-transparent",
  "text-light":
    "bg-gradient-to-t from-espresso/70 via-espresso/25 to-espresso/5",
  "text-dark":
    "bg-gradient-to-t from-ivory-warm/88 via-ivory/35 to-transparent",
  warm: "bg-gradient-to-t from-espresso/65 via-transparent to-sunrise-glow/12",
  none: "",
};

/** Responsive sizes for next/image — tuned per layout role */
const DEFAULT_SIZES: Partial<Record<ArayaMediaKey, string>> = {
  signature: "100vw",
  serviceResidence: "(max-width: 768px) 100vw, 50vw",
  serviceGuest: "(max-width: 768px) 100vw, 50vw",
  serviceOperations: "(max-width: 768px) 100vw, 50vw",
  serviceYield: "(max-width: 768px) 100vw, 50vw",
  lifestyleSanctuary: "(max-width: 768px) 100vw, 50vw",
  ctaSanctuary: "(max-width: 1024px) 100vw, 50vw",
};

type SanctuaryImageProps = {
  imageKey: ArayaMediaKey;
  className?: string;
  priority?: boolean;
  overlay?: SanctuaryOverlay;
  grade?: "araya-grade" | "araya-grade-hero";
  objectPosition?: string;
  sizes?: string;
  /** Subtle hover depth for editorial cards */
  hoverDepth?: boolean;
};

export function SanctuaryImage({
  imageKey,
  className = "",
  priority = false,
  overlay = "warm",
  grade = "araya-grade",
  objectPosition = "center center",
  sizes,
  hoverDepth = false,
}: SanctuaryImageProps) {
  const { path, alt, gradient } = SECTION_MEDIA[imageKey];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();
  const imageSizes = sizes ?? DEFAULT_SIZES[imageKey] ?? "100vw";
  const showImage = !failed;

  const inner = (
    <>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ background: gradient }}
        aria-hidden
      />

      {showImage && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.75, ease: cinematicEase }}
        >
          <Image
            src={path}
            alt={alt}
            fill
            priority={priority}
            sizes={imageSizes}
            className={`object-cover ${grade}`}
            style={{ objectPosition }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </motion.div>
      )}

      {failed && <span className="sr-only">{alt}</span>}

      {overlay !== "none" && (
        <div
          className={`pointer-events-none absolute inset-0 z-[2] ${OVERLAY_CLASS[overlay]}`}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(20,17,14,0.2)_100%)]"
        aria-hidden
      />
    </>
  );

  if (hoverDepth && !reduceMotion) {
    return (
      <motion.div
        className={`relative h-full w-full overflow-hidden bg-espresso ${className}`}
        whileHover={{ scale: 1.012 }}
        transition={{ duration: 1.35, ease: cinematicEase }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-espresso ${className}`}
    >
      {inner}
    </div>
  );
}
