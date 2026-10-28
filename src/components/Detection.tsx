import { Globe, FileSearch, Cpu, AlertTriangle } from "lucide-react";
import CodeBlock from "./CodeBlock";

const LAYERS = [
  {
    icon: Globe,
    title: "Capa 1 · Peticiones HTTP",
    color: "text-cyanish-400",
    border: "hover:border-cyanish-400/50",
    items: [
      "POST multipart con los campos PHPSESSID y PHP_SESSION_UPLOAD_PROGRESS en aplicaciones que no los usan.",
      "Cientos de partes por petición, nombres de campo anidados tipo files[R00001][a][a][a]… o un único nombre de campo de 3–60 MB con bytes binarios.",
      "Filenames de subida con <?php o fragmentos de objetos serializados (|O:).",
      "Respuestas Set-Cookie: PHPSESSID= con valores anómalamente largos, percent-encoded o binarios → posible fuga de memoria (técnica PHPSESSID de Wiz).",
      "Conexiones que se quedan lentas o «mudas» en ráfagas: el atacante intenta acaparar workers para que dos peticiones caigan en el mismo proceso.",
    ],
  },
  {
    icon: FileSearch,
    title: "Capa 2 · Logs de PHP y del servidor",
    color: "text-amberish-400",
    border: "hover:border-amberish-400/50",
    items: [
      "«Allowed memory size … exhausted … in Unknown on line 0»: fallo de memoria durante la inicialización, antes de cualquier script.",
      "Ráfagas cortas de estos errores (bastan 2–4) seguidas de silencio: los exploits modernos apenas necesitan más.",
      "Segfaults de workers (AH00052 … Segmentation fault (11)) cuando el exploit adivina mal una dirección de memoria.",
      "Warnings de configuración tempranos, diagnósticos de shutdown y timeouts en rutas públicas (vías del CVE-2026-109619).",
    ],
  },
  {
    icon: Cpu,
    title: "Capa 3 · Procesos del sistema",
    color: "text-alert-400",
    border: "hover:border-alert-500/50",
    items: [
      "La prueba más directa: un worker web (apache2, php-fpm) que lanza sh, bash, curl, wget o herramientas de reconocimiento.",
      "Conexiones salientes inesperadas desde el usuario www-data (reverse shells hacia C2).",
      "Archivos nuevos o modificados en public/, storage/ o rutas de sesión (webshells persistentes).",
      "Crontabs, servicios o claves SSH añadidos tras el 17 de octubre de 2026.",
    ],
  },
];

export default function Detection() {
  return (
    <div className="space-y-6">
      <div className="reveal rounded-lg border border-amberish-400/40 bg-amberish-400/10 p-5">
        <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amberish-400" aria-hidden />
          <span>
            <strong className="text-white">Sí, se puede saber… pero ninguna señal aislada es concluyente.</strong> Hay que
            correlacionar las tres capas. Un exploit exitoso puede devolver HTTP 200 y no tumbar el worker, y la
            explotación en producción empezó el <strong className="text-amberish-400">17 de octubre de 2026</strong>,
            cuatro días antes del parche: revisa logs desde esa fecha como mínimo.
          </span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {LAYERS.map((l, i) => {
          const Icon = l.icon;
          return (
            <div
              key={i}
              className={`reveal rounded-lg border border-ink-700 bg-ink-900/60 p-5 transition ${l.border}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <p className={`flex items-center gap-2 font-display font-semibold ${l.color}`}>
                <Icon className="h-4 w-4" aria-hidden /> {l.title}
              </p>
              <ul className="mt-3 space-y-2.5">
                {l.items.map((it, j) => (
                  <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-ink-200">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${l.color}`} aria-hidden />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="reveal grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Búsquedas rápidas en el servidor de Twinteach</p>
          <CodeBlock
            label="caza de indicios en logs"
            code={`# 1. Errores de memoria en inicialización (desde el 17-oct)
grep -r "exhausted" /var/log/php* | grep "Unknown on line 0"

# 2. Segfaults de workers Apache
grep "Segmentation fault" /var/log/apache2/error.log

# 3. Peticiones con campos típicos de los PoC
grep -a "PHP_SESSION_UPLOAD_PROGRESS" /var/log/nginx/access.log

# 4. Shells vivas lanzadas por el usuario web AHORA
ps -u www-data -f | grep -E "sh|bash|curl|wget"

# 5. Árbol de procesos: ¿quién es el padre de esa shell?
pstree -ap $(pgrep -o php-fpm)`}
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-white">Así se ve una explotación confirmada</p>
          <CodeBlock
            kind="log"
            label="árbol de procesos capturado (Datadog)"
            code={`apache2 (www-data)
└── sh -c <comando de reverse shell>
    └── bash  →  conexión saliente a c2.example:443`}
          />
          <div className="rounded-lg border border-ink-700 bg-ink-900/50 p-4 text-sm leading-relaxed text-ink-200">
            <p className="font-semibold text-white">Si encuentras indicios de compromiso:</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li>Aísla el servidor de la red (no lo apagues: se pierde la evidencia en memoria).</li>
              <li>Preserva logs, imágenes de disco y capturas de procesos.</li>
              <li>Redespliega desde una imagen limpia y parcheada; no confíes en «limpiar» el host.</li>
              <li>Rota credenciales: base de datos, <code className="font-mono text-cyanish-400">.env</code> de Laravel, tokens de API, sesiones y claves de terceros.</li>
              <li>Notifica según tu normativa (RGPD: 72 h si hubo datos personales).</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}