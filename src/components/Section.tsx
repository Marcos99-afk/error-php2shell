import { useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  kicker?: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function Section({ id, number, title, kicker, icon: Icon, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    el.querySelectorAll(".reveal").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className="scroll-mt-24 border-t border-ink-800/80 py-14 first:border-t-0 lg:py-20">
      <div className="reveal mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-850 text-cyanish-400">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-alert-400">SECCIÓN {number}</p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          {kicker && <p className="mt-1 max-w-2xl text-sm text-ink-300">{kicker}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}