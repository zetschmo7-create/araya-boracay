"use client";

import { HERO_IMAGE, HERO_MEDIA_MODE } from "@/app/lib/araya-media";
import { useEffect, useRef } from "react";

export type { HeroMediaMode } from "@/app/lib/araya-media";
export {
  HERO_AUTO_VIDEO_WHEN_AVAILABLE,
  HERO_MEDIA_MODE,
  HERO_VIDEO_SRC,
} from "@/app/lib/araya-media";

/**
 * ─── HERO MEDIA (primary: video) ────────────────────────────────────────────
 *
 * Video:  /public/videos/araya-hero.mp4
 * Poster: /public/images/hero/araya-hero.jpg
 * ─────────────────────────────────────────────────────────────────────────────
 */

type HeroBackgroundProps = {
  className?: string;
};

export function HeroBackground({ className = "" }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* autoplay blocked — poster remains visible */
    });
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-espresso ${className}`}>
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ background: HERO_IMAGE.gradient }}
        aria-hidden
      />

      {/* Poster / still fallback — static, same on server and client */}
      <div
        className="absolute inset-0 z-[1] bg-cover bg-no-repeat araya-grade-hero"
        style={{
          backgroundImage: `url("${HERO_IMAGE.path}")`,
          backgroundPosition: "center 32%",
        }}
        role="img"
        aria-label={HERO_IMAGE.alt}
        aria-hidden
      />

      {HERO_MEDIA_MODE === "video" && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_IMAGE.path}
          src="/videos/araya-hero.mp4"
          className="absolute inset-0 z-[2] h-full w-full object-cover object-[center_32%] araya-grade-hero"
          aria-hidden
        />
      )}

      <span className="sr-only">{HERO_IMAGE.alt}</span>

      {/* Editorial atmosphere — grain, haze, soft bloom (hero only) */}
      <div
        className="hero-atmosphere pointer-events-none absolute inset-0 z-[3]"
        aria-hidden
      >
        <div className="hero-atmosphere__haze" />
        <div className="hero-atmosphere__bloom hero-atmosphere__bloom--warm" />
        <div className="hero-atmosphere__bloom hero-atmosphere__bloom--cool" />
        <div className="hero-atmosphere__grain" />
      </div>

      {/* Cinematic overlays — above video, preserves type readability */}
      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_90%_70%_at_78%_8%,rgba(242,220,192,0.5),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_60%_50%_at_15%_55%,rgba(94,138,136,0.35),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(20,17,14,0.35)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[48%] bg-gradient-to-t from-espresso/88 via-espresso/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-28 bg-gradient-to-b from-espresso/40 to-transparent"
        aria-hidden
      />
    </div>
  );
}
