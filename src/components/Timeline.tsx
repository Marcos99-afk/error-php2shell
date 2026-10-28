import { Sparkles, Radio, Megaphone, ShieldCheck, Bot, FileWarning } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Event {
  date: string;
  title: string;
  text: string;
  icon: LucideIcon;
  tone: "info" | "danger" | "warn" | "ok";
}

const EVENTS: Event[] = [
  {
    date: "1 ago 2026",
    title: "Descubrimiento con ayuda de IA",
    text: "Investigadores de Calif, OpenAI y Wiz encuentran los dos fallos analizando el código fuente de PHP con agentes de IA (GPT-5.6 Sol, Wiz Atlas y Gemini 4 Argon). Los defectos llevaban años en el motor, presentes desde PHP 5.4.",
    icon: Sparkles,
    tone: "info",
  },
  {
    date: "17 oct 2026",
    title: "Explotación antes del parche",
    text: "Amazon Web Services detecta intentos de explotación en producción cuatro días antes de la divulgación pública: alguien conocía el fallo antes de que existiera una corrección.",
    icon: Radio,
    tone: "danger",
  },
  {
    date: "20 oct 2026",
    title: "Divulgación anticipada por una filtración",
    text: "Los detalles se filtran en foros y Calif publica accidentalmente un vídeo con una prueba de concepto. El equipo de PHP adelanta toda la comunicación oficial ante el riesgo.",
    icon: Megaphone,
    tone: "warn",
  },
  {
    date: "21 oct 2026 · 13:35 UTC",
    title: "Parche de emergencia",
    text: "PHP publica, 25 minutos antes de lo previsto, las versiones 8.5.12, 8.4.27, 8.3.36 y 8.2.35 que corrigen ambos CVE. Cloudflare y Datadog confirman explotación activa el mismo día.",
    icon: ShieldCheck,
    tone: "ok",
  },
  {
    date: "22–23 oct 2026",
    title: "Escaneo masivo y botnets",
    text: "Millones de intentos de explotación: los atacantes prueban a desplegar la variante «Potassium» del malware Mirai. Varios gobiernos retiran temporalmente sitios web mientras parchean.",
    icon: Bot,
    tone: "danger",
  },
  {
    date: "23 oct 2026",
    title: "Tercer fallo relacionado",
    text: "PHP divulga CVE-2026-115560, un tercer RCE derivado del mismo patrón. Requiere una configuración poco habitual, se considera improbable y se corregirá en el ciclo de releases normal.",
    icon: FileWarning,
    tone: "warn",
  },
];

const TONE: Record<Event["tone"], { ring: string; icon: string; chip: string }> = {
  info: { ring: "border-cyanish-400/50", icon: "text-cyanish-400", chip: "text-cyanish-400 border-cyanish-400/40" },
  danger: { ring: "border-alert-500/50", icon: "text-alert-400", chip: "text-alert-400 border-alert-500/40" },
  warn: { ring: "border-amberish-400/50", icon: "text-amberish-400", chip: "text-amberish-400 border-amberish-400/40" },
  ok: { ring: "border-fixed-400/50", icon: "text-fixed-400", chip: "text-fixed-400 border-fixed-400/40" },
};

export default function Timeline() {
  return (
    <ol className="relative space-y-6 border-l border-ink-700/70 pl-8 lg:pl-10">
      {EVENTS.map((ev, i) => {
        const t = TONE[ev.tone];
        const Icon = ev.icon;
        return (
          <li key={i} className="reveal relative" style={{ transitionDelay: `${i * 70}ms` }}>
            <span
              className={`absolute -left-[49px] flex h-9 w-9 items-center justify-center rounded-full border bg-ink-900 lg:-left-[57px] ${t.ring}`}
            >
              <Icon className={`h-4 w-4 ${t.icon}`} aria-hidden />
            </span>
            <div className="rounded-lg border border-ink-800 bg-ink-900/60 p-5 transition hover:border-ink-600 hover:bg-ink-850">
              <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[11px] tracking-wide ${t.chip}`}>
                {ev.date}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">{ev.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{ev.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}