import { useEffect, useState } from "react";
import {
  History,
  Bug,
  ListChecks,
  Wrench,
  Blocks,
  Radar,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  num: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { id: "cronologia", num: "01", label: "Descubrimiento y cronología", icon: History },
  { id: "vulnerabilidad", num: "02", label: "¿En qué consiste?", icon: Bug },
  { id: "versiones", num: "03", label: "Versiones afectadas", icon: ListChecks },
  { id: "soluciones", num: "04", label: "Soluciones", icon: Wrench },
  { id: "twinteach", num: "05", label: "Twinteach: Angular + Laravel", icon: Blocks },
  { id: "deteccion", num: "06", label: "Detectar la explotación", icon: Radar },
  { id: "contexto", num: "07", label: "Contexto y conclusiones", icon: Lightbulb },
];

export default function Sidebar() {
  const [active, setActive] = useState("cronologia");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-8 hidden self-start lg:block">
        <p className="mb-3 font-mono text-[11px] tracking-[0.25em] text-ink-300">ÍNDICE DEL INFORME</p>
        <nav aria-label="Secciones del informe">
          <ul className="space-y-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              const isActive = active === n.id;
              return (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "border-alert-500/50 bg-alert-500/10 text-white"
                        : "border-transparent text-ink-300 hover:border-ink-700 hover:bg-ink-900 hover:text-white"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={`font-mono text-[11px] ${isActive ? "text-alert-400" : "text-ink-600 group-hover:text-ink-300"}`}>
                      {n.num}
                    </span>
                    <Icon className={`h-4 w-4 ${isActive ? "text-alert-400" : "text-ink-300"}`} aria-hidden />
                    <span className="leading-tight">{n.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6 rounded-lg border border-ink-700 bg-ink-900/60 p-4">
          <p className="font-mono text-[11px] tracking-widest text-ink-300">ACCIÓN INMEDIATA</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            Si sirves PHP en Internet: <strong className="text-white">parchea hoy</strong> y reinicia los workers.
            Después, revisa logs desde el <span className="text-alert-400">17-oct-2026</span>.
          </p>
        </div>
      </aside>

      {/* Mobile top nav */}
      <nav
        aria-label="Secciones del informe (móvil)"
        className="sticky top-0 z-40 -mx-5 border-b border-ink-800 bg-ink-950/90 px-5 py-2 backdrop-blur lg:hidden"
      >
        <ul className="flex gap-1.5 overflow-x-auto pb-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = active === n.id;
            return (
              <li key={n.id} className="shrink-0">
                <a
                  href={`#${n.id}`}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${
                    isActive
                      ? "border-alert-500/50 bg-alert-500/10 text-alert-400"
                      : "border-ink-700 text-ink-300"
                  }`}
                >
                  <Icon className="h-3 w-3" aria-hidden />
                  {n.num} · {n.label.split(":")[0]}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}