"use client";

import { useLocale } from "@/app/context/LocaleProvider";
import type { LegalPageContent } from "@/app/content/legal/types";
import { SectionReveal } from "@/app/components/SectionReveal";

type LegalDocumentProps = {
  content: LegalPageContent;
};

export function LegalDocument({ content }: LegalDocumentProps) {
  const { t } = useLocale();

  return (
    <article className="legal-prose">
      <SectionReveal>
        <p className="text-[10px] tracking-[0.42em] text-teak-deep uppercase">
          ARAYA · Legal
        </p>
        <h1 className="font-display mt-6 text-4xl font-light leading-[1.1] text-espresso md:text-5xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-[1.9] font-light text-espresso-muted">
          {content.subtitle}
        </p>
        <p className="mt-8 text-[10px] tracking-[0.22em] text-espresso-whisper uppercase">
          {t.legal.lastUpdated} · {content.updated}
        </p>
      </SectionReveal>

      <div className="mt-16 space-y-14 md:mt-20 md:space-y-16">
        {content.sections.map((section, index) => (
          <SectionReveal key={section.title} delay={index * 0.04}>
            <section>
              <h2 className="font-display text-xl font-light text-espresso md:text-2xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm leading-[2] text-espresso-muted md:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-5 space-y-3 border-l border-sand/50 pl-6">
                  {section.list.map((item) => (
                    <li
                      key={item.slice(0, 48)}
                      className="text-sm leading-[1.95] text-espresso-muted md:text-[15px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </SectionReveal>
        ))}
      </div>

      <SectionReveal delay={0.1} className="mt-20 border-t border-sand/40 pt-12 md:mt-24">
        <h2 className="font-display text-lg font-light text-espresso">
          {t.legal.entityHeading}
        </h2>
        <p className="mt-4 text-sm leading-[2] text-espresso-muted md:text-[15px]">
          {t.legal.entityBody}
        </p>
        <p className="mt-6 text-sm leading-[2] text-espresso-whisper">
          {t.legal.questions}
        </p>
      </SectionReveal>
    </article>
  );
}
