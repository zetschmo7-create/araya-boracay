"use client";

import { HeroBackground } from "@/app/components/HeroBackground";
import { SiteNavbar } from "@/app/components/SiteNavbar";
import { LuxuryButton } from "@/app/components/LuxuryButton";
import { ParallaxFrame } from "@/app/components/ParallaxFrame";
import { SanctuaryImage } from "@/app/components/SanctuaryImage";
import { SectionReveal } from "@/app/components/SectionReveal";
import { SiteFooter } from "@/app/components/SiteFooter";
import type { ArayaMediaKey } from "@/app/lib/araya-media";
import {
  cinematicEase,
  fadeIn,
  fadeUp,
  revealItem,
  revealSection,
  sectionViewport,
} from "@/app/lib/araya-motion";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const positioning = [
  "Villa Stewardship",
  "Owner Management",
  "Guest Experience",
  "Revenue Strategy",
  "Property Care",
  "Luxury Operations",
];

const services: {
  title: string;
  description: string;
  image: ArayaMediaKey;
}[] = [
  {
    title: "Private Residence Care",
    description:
      "Architectural villas and condominiums tended with hotel-calibre standards—linen, stone, teak, and sea air held in perfect equilibrium.",
    image: "serviceResidence",
  },
  {
    title: "Guest Experience Design",
    description:
      "Curated arrivals and island itineraries for discerning travellers. Sanctuary hospitality—not short-term rental volume.",
    image: "serviceGuest",
  },
  {
    title: "Luxury Hospitality Operations",
    description:
      "Discreet on-island teams, white-glove service protocols, and brand-consistent presentation across every touchpoint.",
    image: "serviceOperations",
  },
  {
    title: "Owner Intelligence & Yield",
    description:
      "Selective channel strategy, premium positioning, and transparent stewardship—so your asset performs without losing its soul.",
    image: "serviceYield",
  },
];

const ownerBenefits = [
  {
    title: "Effortless Ownership",
    body: "Your Boracay residence always prepared—whether you arrive tomorrow or next year.",
  },
  {
    title: "Protected Reputation",
    body: "We decline commoditization. Your villa remains a private sanctuary, never a listing.",
  },
  {
    title: "Institutional Calibre",
    body: "Hospitality SOPs drawn from luxury resorts—not generic rental playbooks.",
  },
  {
    title: "One Steward",
    body: "A single relationship accountable to your investment, your guests, and your peace.",
  },
];

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100dvh] min-h-[100svh] overflow-hidden"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <HeroBackground />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex min-h-[100dvh] min-h-[100svh] flex-col justify-end px-5 pb-12 pt-24 md:px-10 md:pb-14 lg:px-14 lg:pb-16"
      >
        <div className="mx-auto w-full max-w-[90rem]">
          <motion.p
            initial={false}
            animate="visible"
            variants={fadeIn}
            custom={0.2}
            className="text-[10px] font-light tracking-[0.44em] text-sunrise-glow uppercase"
          >
            Boracay · Luxury Villa & Condo Management
          </motion.p>

          <motion.h1
            initial={false}
            animate="visible"
            variants={fadeUp}
            custom={0.35}
            className="font-display mt-6 max-w-[14ch] text-[2.65rem] leading-[1.05] font-light tracking-wide text-coconut md:mt-8 md:max-w-[16ch] md:text-[4.25rem] lg:text-[5rem] lg:leading-[1.02]"
          >
            Your villa, held in sanctuary stillness
          </motion.h1>

          <motion.p
            initial={false}
            animate="visible"
            variants={fadeUp}
            custom={0.55}
            className="mt-8 max-w-xl text-base leading-[1.85] font-light text-coconut/85 md:mt-10 md:text-lg md:leading-[1.9]"
          >
            ARAYA manages luxury villas and condominiums in Boracay for
            discerning property owners—uniting private residence care, guest
            experience, and elevated hospitality operations.
          </motion.p>

          <motion.div
            initial={false}
            animate="visible"
            variants={fadeUp}
            custom={0.75}
            className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center md:mt-12"
          >
            <LuxuryButton href="#contact" primary>
              Request Property Review
            </LuxuryButton>
            <LuxuryButton href="#services">Explore Stewardship</LuxuryButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function PositioningBar() {
  return (
    <section className="relative z-20 -mt-1 border-y border-espresso-soft/20 bg-espresso">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
        variants={revealSection}
        className="mx-auto max-w-[90rem] px-5 py-8 md:px-10 md:py-10"
      >
        <motion.p
          variants={revealItem}
          className="mb-6 text-center text-[10px] tracking-[0.38em] text-coconut/45 uppercase md:mb-8"
        >
          Luxury stewardship for Boracay property owners
        </motion.p>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-14">
          {positioning.map((item) => (
            <motion.li
              key={item}
              variants={revealItem}
              className="text-[10px] tracking-[0.28em] text-coconut/75 uppercase md:text-[11px]"
            >
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

function ClarityIntro() {
  return (
    <section className="relative border-y border-sand/30 bg-ivory-warm py-14 md:py-20">
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 md:grid-cols-12 md:gap-16 md:px-10 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeUp}
          className="md:col-span-5"
        >
          <p className="text-[10px] tracking-[0.42em] text-teak-deep uppercase">
            The ARAYA Standard
          </p>
          <h2 className="font-display mt-6 text-3xl leading-[1.15] font-light text-espresso md:text-4xl lg:text-[2.75rem]">
            Not a rental agency.
            <span className="block text-espresso-muted italic">
              A hospitality house.
            </span>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          custom={0.15}
          variants={fadeUp}
          className="md:col-span-7"
        >
          <p className="text-base leading-[2] text-espresso-muted md:text-lg">
            We partner with a select portfolio of villa and condominium owners
            who refuse to compromise their asset&apos;s reputation. ARAYA
            delivers the operational depth of a world-class resort—applied
            privately, quietly, and with absolute discretion to your Boracay
            residence.
          </p>
          <p className="mt-6 text-base leading-[2] text-espresso-whisper md:text-lg">
            Your property is safe here. Your villa becomes a sanctuary. This is
            luxury stewardship.
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scaleX: 0.92 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={sectionViewport}
        transition={{ duration: 2, ease: cinematicEase }}
        className="section-divider mx-auto mt-16 max-w-3xl md:mt-20"
      />
    </section>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeUp}
          className="mb-14 md:mb-20"
        >
          <p className="text-[10px] tracking-[0.42em] text-teak-deep uppercase">
            Stewardship
          </p>
          <h2 className="font-display mt-5 text-3xl font-light text-espresso md:text-5xl">
            Everything your residence requires
          </h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={sectionViewport}
              custom={i * 0.12}
              variants={fadeUp}
              className={`group grid overflow-hidden rounded-sm bg-coconut shadow-[var(--shadow-card)] transition-shadow duration-[900ms] ease-[cubic-bezier(0.22,0.03,0.26,1)] hover:shadow-[var(--shadow-editorial)] md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <ParallaxFrame
                strength={4}
                className="relative min-h-[280px] aspect-[5/4] sm:min-h-[300px] md:aspect-auto md:min-h-[360px]"
              >
                <SanctuaryImage
                  imageKey={service.image}
                  overlay="editorial"
                  objectPosition="center center"
                  priority={i === 0}
                  hoverDepth
                  className="h-full w-full"
                />
              </ParallaxFrame>
              <div className="flex flex-col justify-center px-8 py-10 md:px-14 md:py-14">
                <span className="font-display text-4xl font-light text-sand-warm/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-4 text-2xl font-light text-espresso md:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-5 text-sm leading-[2] text-espresso-muted md:text-base">
                  {service.description}
                </p>
                <div className="mt-8 h-px w-12 bg-teak/40 transition-all duration-700 group-hover:w-20" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignatureMoment() {
  return (
    <section
      id="signature"
      className="relative min-h-[78vh] overflow-hidden sm:min-h-[85vh] md:min-h-[92vh]"
    >
      <ParallaxFrame strength={6} className="absolute inset-0">
        <SanctuaryImage
          imageKey="signature"
          priority
          overlay="signature"
          grade="araya-grade"
          objectPosition="center 40%"
          className="h-full w-full"
        />
      </ParallaxFrame>

      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,transparent,rgba(20,17,14,0.4))]" />

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-5 text-center md:min-h-[92vh] md:px-10">
        <SectionReveal delay={0.1}>
          <p className="text-[10px] tracking-[0.5em] text-sunrise-glow uppercase">
            The ARAYA Moment
          </p>
        </SectionReveal>
        <SectionReveal delay={0.28} className="mt-10">
          <blockquote className="font-display max-w-4xl text-[1.75rem] leading-[1.35] font-light text-coconut md:text-5xl md:leading-[1.2] lg:text-6xl">
            <span className="italic">
              &ldquo;Arriving at golden hour—where the ocean exhales, and your
              villa waits in perfect stillness.&rdquo;
            </span>
          </blockquote>
        </SectionReveal>
        <SectionReveal delay={0.45} className="mt-10">
          <p className="max-w-lg text-sm leading-[2] tracking-wide text-coconut/70 md:text-base">
            This is the feeling we protect for every owner, every guest, every
            residence we steward in Boracay.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

function LifestyleSection() {
  return (
    <section className="bg-espresso">
      <div className="border-b border-espresso-soft/25 px-5 py-14 md:px-14 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeUp}
          className="mx-auto max-w-2xl"
        >
          <p className="text-[10px] tracking-[0.42em] text-sunrise-glow uppercase">
            Island Living
          </p>
          <h2 className="font-display mt-5 text-3xl font-light text-coconut md:text-5xl">
            Boracay, distilled to its quietest truth
          </h2>
          <p className="mt-6 text-base leading-[2] text-coconut/75 md:text-lg">
            White sand. Turquoise water. Palm shadows on limestone. We curate
            guest experiences that honour the island&apos;s beauty without
            spectacle—refined, private, unhurried.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2">
        <ParallaxFrame
          strength={5}
          className="relative min-h-[50vh] aspect-square md:aspect-auto md:min-h-[52vh]"
        >
          <SanctuaryImage
            imageKey="lifestyleSanctuary"
            overlay="warm"
            objectPosition="center 25%"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full"
          />
        </ParallaxFrame>
        <SectionReveal className="flex flex-col justify-center bg-ivory-warm px-5 py-14 md:px-14 md:py-20">
          <p className="text-[10px] tracking-[0.42em] text-teak-deep uppercase">
            Guest Experience
          </p>
          <h3 className="font-display mt-5 text-2xl font-light text-espresso md:text-4xl">
            Sanctuary, not occupancy
          </h3>
          <p className="mt-6 text-sm leading-[2] text-espresso-muted md:text-base">
            Every stay is shaped around silence, linen, warm stone, and the
            rhythm of ocean air through open architecture. Your guests feel the
            difference immediately.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

function OwnershipSection() {
  return (
    <section id="ownership" className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-5 md:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <p className="text-[10px] tracking-[0.42em] text-teak-deep uppercase">
              For Owners
            </p>
            <h2 className="font-display mt-5 text-3xl font-light text-espresso md:text-5xl">
              Effortless ownership, absolute peace
            </h2>
            <p className="mt-8 text-base leading-[2] text-espresso-muted">
              International investors and villa owners trust ARAYA to hold their
              Boracay properties with the same care they would their own
              sanctuary—wherever they are in the world.
            </p>
            <div className="mt-10">
              <LuxuryButton href="#contact" light={false}>
                Begin a Conversation
              </LuxuryButton>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {ownerBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={sectionViewport}
                custom={i * 0.08}
                variants={fadeUp}
                className="rounded-sm border border-sand/40 bg-coconut p-8 shadow-[var(--shadow-lift)] transition-shadow duration-[900ms] ease-[cubic-bezier(0.22,0.03,0.26,1)] hover:shadow-[var(--shadow-card)] md:p-10"
              >
                <div className="mb-4 h-px w-8 bg-bronze/50" />
                <h3 className="font-display text-xl text-espresso">{b.title}</h3>
                <p className="mt-3 text-sm leading-[1.95] text-espresso-muted">
                  {b.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-espresso">
      <div className="grid lg:grid-cols-2">
        <ParallaxFrame
          strength={4}
          className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[520px]"
        >
          <SanctuaryImage
            imageKey="ctaSanctuary"
            overlay="warm"
            objectPosition="center 30%"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="absolute inset-0 h-full w-full"
          />
        </ParallaxFrame>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={sectionViewport}
          variants={fadeUp}
          className="flex flex-col justify-center px-5 py-16 md:px-14 md:py-24"
        >
          <p className="text-[10px] tracking-[0.42em] text-sunrise-glow uppercase">
            Connect
          </p>
          <h2 className="font-display mt-6 text-3xl font-light text-coconut md:text-4xl lg:text-5xl">
            Entrust your property to ARAYA
          </h2>
          <p className="mt-8 max-w-md text-base leading-[2] text-coconut/70">
            We accept a limited number of residences each season. Request a
            confidential property review and discover what luxury stewardship
            feels like in Boracay.
          </p>
          <div className="mt-12 flex flex-col gap-5 sm:flex-row">
            <LuxuryButton href="mailto:inquiry@araya.com" primary>
              Request Property Review
            </LuxuryButton>
            <LuxuryButton href="tel:+639000000000">
              Speak With Us
            </LuxuryButton>
          </div>
          <p className="mt-14 text-[10px] tracking-[0.26em] text-coconut/40 uppercase">
            Boracay Island · Philippines
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 48);
      setOnHero(y < window.innerHeight * 0.9);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="font-sans bg-ivory text-espresso">
      <SiteNavbar scrolled={scrolled} onHero={onHero} />
      <HeroSection />
      <PositioningBar />
      <ClarityIntro />
      <ServicesSection />
      <SignatureMoment />
      <LifestyleSection />
      <OwnershipSection />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
