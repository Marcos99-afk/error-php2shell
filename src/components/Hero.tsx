import { useEffect, useState } from "react";
import { Activity, CalendarClock, ServerCrash, ShieldAlert } from "lucide-react";

const TERMINAL_LINES = [
  "$ POST /cualquier-ruta HTTP/1.1  ·  sin credenciales",
  "PHP Fatal error: Allowed memory size exhausted in Unknown on line 0",
  "apache2 (www-data) └─ sh -c whoami   # el atacante ya está dentro",
];

export default function Hero() {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const total = TERMINAL_LINES.join("\n").length;
    if (typed >= total) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 26);
    return () => clearTimeout(t);
  }, [typed]);

  let remaining = typed;
  const rendered = TERMINAL_LINES.map((line) => {
    const take = Math.max(0, Math.min(line.length, remaining));
    remaining -= line.length + 1;
    return line.slice(0, take);
  });

  return (
    <header className="relative overflow-hidden border-b border-ink-800">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden opacity-40" aria-hidden>
        <div className="scanline h-24 w-full bg-gradient-to-b from-transparent via-alert-500/10 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-12 lg:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-alert-500/50 bg-alert-500/10 px-3 py-1 font-mono text-xs text-alert-400">
            <span className="pulse-dot h-2 w-2 rounded-full bg-alert-500" aria-hidden />
            EXPLOTACIÓN ACTIVA CONFIRMADA
          </span>
          <span className="rounded-full border border-ink-600 px-3 py-1 font-mono text-xs text-ink-300">
            INFORME DE INCIDENTE · OCT 2026
          </span>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-sm tracking-[0.3em] text-cyanish-400">
              CVE-2026-109618 · CVE-2026-109619
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-tight text-white sm:text-7xl">
              PHP<span className="text-alert-500">2</span>Shell
            </h1>
            <p className="mt-2 font-mono text-sm text-ink-300">
              alias «php2bash» · ejecución remota de código en el motor de PHP
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200">
              Dos fallos críticos en el núcleo de PHP permiten a un atacante{" "}
              <strong className="text-white">ejecutar comandos en el servidor sin autenticarse</strong>, antes de que se
              ejecute el código de la aplicación. Afectan a todas las versiones desde PHP 5.4 —hasta un{" "}
              <strong className="text-white">~70 % de la web</strong>— y se explotaron en producción{" "}
              <strong className="text-alert-400">antes de que existiera el parche</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#versiones"
                className="rounded-lg bg-alert-500 px-5 py-2.5 font-display text-sm font-semibold text-white shadow-lg shadow-alert-500/25 transition hover:bg-alert-400 hover:shadow-alert-500/40"
              >
                ¿Estoy afectado?
              </a>
              <a
                href="#twinteach"
                className="rounded-lg border border-ink-600 px-5 py-2.5 font-display text-sm font-semibold text-ink-100 transition hover:border-cyanish-400 hover:text-cyanish-400"
              >
                Proteger Twinteach →
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-ink-700 bg-ink-950/90 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-1.5 border-b border-ink-800 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-alert-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amberish-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-fixed-400/80" />
                <span className="ml-2 font-mono text-[11px] text-ink-300">anatomía-del-ataque.log</span>
              </div>
              <div className="min-h-[120px] px-4 py-4 font-mono text-[12px] leading-6">
                {rendered.map((line, i) => (
                  <p
                    key={i}
                    className={
                      i === 0 ? "text-cyanish-400" : i === 1 ? "text-amberish-400" : "text-alert-400"
                    }
                  >
                    {line}
                    {i === rendered.findIndex((l, j) => l.length < TERMINAL_LINES[j].length) ||
                    (typed >= TERMINAL_LINES.join("\n").length && i === 2) ? (
                      <span className="caret ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-alert-400" />
                    ) : null}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-alert-500/40 bg-alert-500/10 p-3 text-center">
                <ShieldAlert className="mx-auto h-4 w-4 text-alert-400" aria-hidden />
                <p className="mt-1 font-display text-2xl font-bold text-white">9.2</p>
                <p className="font-mono text-[10px] tracking-wide text-ink-300">CVSS v4.0 · CRÍTICO</p>
              </div>
              <div className="rounded-lg border border-ink-700 bg-ink-900/70 p-3 text-center">
                <ServerCrash className="mx-auto h-4 w-4 text-amberish-400" aria-hidden />
                <p className="mt-1 font-display text-2xl font-bold text-white">5.4–8.5</p>
                <p className="font-mono text-[10px] tracking-wide text-ink-300">VERSIONES AFECTADAS</p>
              </div>
              <div className="rounded-lg border border-ink-700 bg-ink-900/70 p-3 text-center">
                <CalendarClock className="mx-auto h-4 w-4 text-cyanish-400" aria-hidden />
                <p className="mt-1 font-display text-2xl font-bold text-white">21 OCT</p>
                <p className="font-mono text-[10px] tracking-wide text-ink-300">PARCHE DE EMERGENCIA</p>
              </div>
            </div>

            <p className="flex items-center gap-2 font-mono text-[11px] text-ink-300">
              <Activity className="h-3.5 w-3.5 text-fixed-400" aria-hidden />
              Corregido en 8.5.12 · 8.4.27 · 8.3.36 · 8.2.35 — reiniciar workers es obligatorio
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}