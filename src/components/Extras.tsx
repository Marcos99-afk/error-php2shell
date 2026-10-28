import { Bot, Globe2, GraduationCap, ExternalLink, Scale } from "lucide-react";

const SOURCES = [
  { name: "PHP · Anuncio oficial del parche de emergencia", url: "https://www.php.net/archive/2026.php#2026-10-21-1" },
  { name: "Advisory GHSA-w8hw-w9fx-j79w (CVE-2026-109618)", url: "https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w" },
  { name: "Advisory GHSA-6wmf-4rv5-p3rp (CVE-2026-109619)", url: "https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp" },
  { name: "Datadog Security Labs · Análisis técnico y detección", url: "https://securitylabs.datadoghq.com/articles/php2shell-critical-vulnerabilities-in-php/" },
  { name: "Wiz · PHP2Shell: PHP RCE y fuga vía PHPSESSID", url: "https://www.wiz.io/blog/php2shell-php-rce" },
  { name: "NCSC-NL · Repositorio operativo php2shell", url: "https://github.com/NCSC-NL/php2shell" },
  { name: "BleepingComputer · Parches de emergencia", url: "https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/" },
  { name: "The Hacker News · Explotación masiva y Mirai «Potassium»", url: "https://thehackernews.com/2026/10/php2shell-exploit-attempts-hit-millions.html" },
  { name: "CERT-EU · Aviso 2026-018 (aislamiento de apps expuestas)", url: "https://cert.europa.eu/publications/security-advisories/2026-018" },
];

const LESSONS = [
  {
    icon: Bot,
    title: "La IA ya encuentra bugs de 14 años… en ambos bandos",
    text: "Calif, OpenAI y Wiz hallaron los fallos con agentes de IA sobre el código fuente de PHP. Es un punto de inflexión: defectos que sobrevivieron a una década de auditorías humanas cayeron en semanas. Los atacantes usan las mismas herramientas para weaponizar los parches.",
  },
  {
    icon: Globe2,
    title: "Escala: ~70 % de la web usa PHP",
    text: "WordPress, WooCommerce, Magento, Moodle, MediaWiki… y cualquier backend Laravel como Twinteach. El fallo está en el intérprete, no en las aplicaciones: la superficie es prácticamente todo el PHP que sirve HTTP en Internet.",
  },
  {
    icon: Scale,
    title: "El patrón de fondo sigue vivo",
    text: "El parche cambia la gestión del error de memoria (límite blando diferido + _exit(137) ante el límite duro), pero el patrón «actualizar metadatos antes de asignar memoria» permanece en el código. Datadog espera más CVEs de esta familia: el tercer fallo (CVE-2026-115560) llegó a los dos días.",
  },
  {
    icon: GraduationCap,
    title: "Lecciones operativas",
    text: "1) El intérprete también se parchea: composer update y npm audit no bastan. 2) Un parche instalado sin reiniciar workers no protege. 3) Las filtraciones adelantan los relojes: hubo explotación 4 días antes del parche. 4) La defensa en profundidad (WAF + límites + monitorización) compra tiempo, pero no sustituye al parche.",
  },
];

export default function Extras() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {LESSONS.map((l, i) => {
          const Icon = l.icon;
          return (
            <div
              key={i}
              className="reveal rounded-lg border border-ink-700 bg-ink-900/60 p-5 transition hover:border-cyanish-400/50"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Icon className="mb-3 h-5 w-5 text-cyanish-400" aria-hidden />
              <h3 className="font-display font-semibold text-white">{l.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{l.text}</p>
            </div>
          );
        })}
      </div>

      <div className="reveal rounded-lg border border-ink-600 bg-ink-850 p-6">
        <h3 className="font-display text-xl font-bold text-white">Conclusión</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-200">
          PHP2Shell («php2bash») es un fallo del <strong className="text-white">motor de PHP</strong>, no de las
          aplicaciones: permite ejecutar código sin autenticación, antes de que Laravel —o cualquier framework— llegue a
          ejecutarse. Afecta a PHP 5.4 → 8.5 y la respuesta correcta es sencilla de enunciar y exige disciplina para
          ejecutar: <strong className="text-fixed-400">actualizar a 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35, reconstruir
          contenedores, reiniciar todos los workers y verificar el runtime real</strong>. Para Twinteach, el frontend
          Angular queda fuera de riesgo y todo el esfuerzo se concentra en el servidor de la API Laravel. Y como la
          explotación empezó antes de que existiera el parche, actualizar debe ir siempre acompañado de una{" "}
          <strong className="text-white">revisión retrospectiva de logs desde el 17 de octubre de 2026</strong>.
        </p>
      </div>

      <div className="reveal">
        <h3 className="mb-3 font-display text-lg font-semibold text-white">Fuentes y referencias</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/40 px-4 py-3 text-sm text-ink-200 transition hover:border-cyanish-400/50 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-300 transition group-hover:text-cyanish-400" aria-hidden />
                <span className="leading-snug">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-xs text-ink-300">
          Informe elaborado con fines educativos · Datos verificados a 25 de octubre de 2026 · Se ha utilizado IA como
          apoyo en la investigación y redacción, contrastando las fuentes citadas.
        </p>
      </div>
    </div>
  );
}