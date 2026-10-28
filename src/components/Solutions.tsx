import { useState } from "react";
import { Download, RotateCcw, Boxes, LifeBuoy, AlertOctagon, CheckCircle2 } from "lucide-react";
import CodeBlock from "./CodeBlock";

const STEPS = [
  {
    icon: Download,
    title: "1 · Actualizar el intérprete",
    text: "Instala la versión corregida de tu rama (8.5.12 / 8.4.27 / 8.3.36 / 8.2.35) o el paquete de tu distribución. Ojo: Debian, Ubuntu, Red Hat, etc. hacen backport del parche SIN cambiar el número de versión upstream; consulta el aviso de seguridad del vendor.",
  },
  {
    icon: Boxes,
    title: "2 · Reconstruir imágenes y contenedores",
    text: "Si usas Docker (php:8.3-fpm, imágenes de Laravel Sail, etc.), reconstruye y redespliega todas las imágenes que incluyan su propio intérprete PHP. Actualizar el host no actualiza los contenedores.",
  },
  {
    icon: RotateCcw,
    title: "3 · Reiniciar TODOS los workers",
    text: "Los procesos PHP-FPM y Apache ya arrancados siguen ejecutando el binario viejo en memoria hasta que se reinician. Sin este paso, el parche está instalado pero NO activo.",
  },
  {
    icon: CheckCircle2,
    title: "4 · Verificar el runtime en ejecución",
    text: "Comprueba la versión que realmente sirve las peticiones (no solo php -v del CLI) y repite el inventario en todos los entornos: producción, staging, servidores olvidados y hosting compartido.",
  },
];

const MITIGATIONS = [
  {
    id: "oom",
    tab: "CVE-2026-109618",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-200">
          El exploit conocido necesita que una asignación de memoria <strong className="text-white">falle</strong>. La
          mitigación oficial evita ese fallo, pero no elimina el bug de fondo:
        </p>
        <CodeBlock
          label="php.ini (nivel administrador)"
          kind="code"
          code={`; Desactiva el límite blando de PHP...
memory_limit = -1

; ...y compensa con límites FUERA de PHP:
;  · límite de memoria del contenedor (cgroup)
;  · tamaño máximo de cuerpo en el proxy/WAF
;  · límites de petición en el frontend`}
        />
        <ul className="space-y-2 text-sm text-ink-200">
          <li className="flex gap-2"><span className="text-fixed-400">✓</span> Limita el tamaño de los cuerpos decodificados, incluso sin <code className="font-mono text-cyanish-400">Content-Length</code> utilizable (chunked).</li>
          <li className="flex gap-2"><span className="text-alert-400">✗</span> No uses <code className="font-mono text-cyanish-400">RLIMIT_AS</code> / <code className="font-mono text-cyanish-400">RLIMIT_DATA</code>: provocan justo los fallos de asignación que el exploit necesita.</li>
          <li className="flex gap-2"><span className="text-amberish-400">!</span> Aun así, si el sistema se queda sin memoria, el fallo puede reproducirse y el atacante puede desestabilizar el host.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "uaf",
    tab: "CVE-2026-109619",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-200">
          Se cortan las dos vías confirmadas de reutilización de estado obsoleto. Deben aplicarse en configuración que
          se cargue <strong className="text-white">antes de parsear la petición</strong> y reiniciar todos los workers:
        </p>
        <CodeBlock
          label="php.ini"
          kind="code"
          code={`; Desactiva el progreso de subida en sesión
session.upload_progress.enabled = 0

; Solo PHP 8.5: sin backtraces en errores fatales
fatal_error_backtraces = 0`}
        />
        <p className="text-sm leading-relaxed text-ink-200">
          Elimina también cualquier ajuste por petición que genere diagnósticos tempranos. Ocultar los errores no
          impide el acceso al estado obsoleto: solo reduce las vías conocidas.
        </p>
      </div>
    ),
  },
  {
    id: "perimeter",
    tab: "Perímetro / WAF",
    content: (
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-200">
          Como el ataque viaja en el cuerpo de la petición, un control <strong className="text-white">delante de PHP</strong>{" "}
          puede bloquearlo antes de que llegue al parser vulnerable:
        </p>
        <ul className="space-y-2 text-sm text-ink-200">
          <li className="flex gap-2"><span className="text-fixed-400">✓</span> CERT-EU recomienda aislar o restringir el acceso público a las aplicaciones expuestas que no puedas parchear ya.</li>
          <li className="flex gap-2"><span className="text-fixed-400">✓</span> Reglas de WAF: tamaño de cuerpo, nº de partes multipart, profundidad de anidamiento de nombres (<code className="font-mono text-cyanish-400">files[R00001][a][a]…</code>), nombres de campo gigantes.</li>
          <li className="flex gap-2"><span className="text-fixed-400">✓</span> Cloudflare, Akamai y otros CDN publicaron reglas gestionadas el mismo 21 de octubre: actívalas si las tienes contratadas.</li>
          <li className="flex gap-2"><span className="text-amberish-400">!</span> Verifica qué ve realmente el motor de inspección: no puede analizar bytes truncados, partes que descarta o cuerpos chunked que trata distinto.</li>
        </ul>
      </div>
    ),
  },
];

export default function Solutions() {
  const [tab, setTab] = useState("oom");
  const active = MITIGATIONS.find((m) => m.id === tab)!;

  return (
    <div className="space-y-6">
      <div className="reveal rounded-lg border border-fixed-400/40 bg-fixed-400/10 p-5">
        <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-100">
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-fixed-400" aria-hidden />
          <span>
            <strong className="text-white">La única solución completa es actualizar PHP.</strong> Todas las mitigaciones
            de configuración (incluida la popular <code className="font-mono text-cyanish-400">session.upload_progress.enabled=0</code>)
            solo reducen la exposición: están verificados otros caminos de explotación que no cubren.
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="reveal rounded-lg border border-ink-700 bg-ink-900/60 p-5 transition hover:border-fixed-400/50 hover:bg-ink-850"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Icon className="mb-3 h-5 w-5 text-fixed-400" aria-hidden />
              <h3 className="font-display font-semibold text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{s.text}</p>
            </div>
          );
        })}
      </div>

      <div className="reveal">
        <CodeBlock
          label="parcheo típico en Debian/Ubuntu con PHP-FPM + Nginx"
          code={`# 1. Actualizar paquetes (usa el repo de tu distro o deb.sury.org)
sudo apt update
sudo apt install --only-upgrade 'php8.3*'

# 2. Verificar la versión instalada
php -v            # esperado: 8.3.36 o superior

# 3. Reiniciar los workers: IMPRESCINDIBLE
sudo systemctl restart php8.3-fpm
sudo systemctl restart nginx      # o apache2 si usas mod_php

# 4. Confirmar que FPM cargó el binario nuevo
sudo systemctl status php8.3-fpm`}
        />
      </div>

      <div className="reveal rounded-lg border border-ink-700 bg-ink-900/60">
        <div className="flex items-center gap-2 border-b border-ink-700 px-5 pt-4">
          <AlertOctagon className="h-4 w-4 text-amberish-400" aria-hidden />
          <h3 className="pb-3 font-display font-semibold text-white">
            Mitigaciones temporales <span className="text-sm font-normal text-ink-300">— solo si NO puedes parchear todavía</span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-1 px-5 pt-3" role="tablist" aria-label="Mitigaciones por vulnerabilidad">
          {MITIGATIONS.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={tab === m.id}
              onClick={() => setTab(m.id)}
              className={`rounded-t border-b-2 px-3 py-2 font-mono text-xs transition ${
                tab === m.id
                  ? "border-amberish-400 bg-ink-850 text-amberish-400"
                  : "border-transparent text-ink-300 hover:text-white"
              }`}
            >
              {m.tab}
            </button>
          ))}
        </div>
        <div className="p-5">{active.content}</div>
      </div>
    </div>
  );
}