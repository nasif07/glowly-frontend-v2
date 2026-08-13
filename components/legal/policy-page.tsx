import type { ReactNode } from "react";

interface PolicyPageProps {
  /** Small uppercase eyebrow above the title. */
  eyebrow: string;
  title: string;
  /** Optional lead paragraph rendered under the title in the hero. */
  intro?: string;
  children: ReactNode;
}

/**
 * Shared shell for the policy / trust pages (terms, privacy, shipping, returns,
 * transparency, authenticity). Keeps the gradient hero and body rhythm
 * identical across all of them so only the copy differs per page.
 */
export function PolicyPage({ eyebrow, title, intro, children }: PolicyPageProps) {
  return (
    <div className="bg-white text-[#300332]">
      <section className="bg-linear-to-br from-[#360718] via-[#8E1454] to-[#360718] px-4 py-20 text-[#D9C5B2] md:px-6 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.5em] text-white/60">
            {eyebrow}
          </span>
          <h1 className="text-4xl leading-none text-white md:text-6xl">{title}</h1>
          {intro && (
            <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed opacity-80">
              {intro}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <div className="space-y-12">{children}</div>
      </section>
    </div>
  );
}

/** One titled block of policy copy. */
export function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl">{title}</h2>
      <div className="space-y-4 text-lg leading-relaxed text-[#300332]/70">
        {children}
      </div>
    </section>
  );
}

/** Bulleted list styled to match the policy body copy. */
export function PolicyList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            aria-hidden
            className="mt-3 h-[5px] w-[5px] shrink-0 rounded-full bg-[#8E1454]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Highlighted contact / callout strip used at the end of most policy pages. */
export function PolicyCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#D9C5B2]/20 p-8 md:p-10">
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className="space-y-2 text-lg leading-relaxed text-[#300332]/70">
        {children}
      </div>
    </section>
  );
}
