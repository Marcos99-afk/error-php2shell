import { useEffect, useState } from "react";
import { CheckSquare, Square, RotateCcw, Layers, TriangleAlert } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface Step {
  id: string;
  title: string;
  text: string;
  code?: string;
  codeLabel?: string;
}

const STEPS: Step[] = [
  {
    id: "t1",
    title: "Entender qué parte de Twinteach está en riesgo",
    text: "El frontend Angular se compila a HTML/CSS/JS estático y se ejecuta en el navegador: NO es vulnerable. El backend Laravel sí: corre sobre PHP y cada petición HTTP a la API pasa por el parser vulnerable antes de llegar a Laravel. El riesgo está en el servidor de la API (y en colas/Horizon si corren en la misma máquina con workers HTTP expuestos).",
  },
  {
    id: "t2",
    title: "Inventariar el runtime PHP que sirve la API",
    text: "Comprueba la versión del CLI y, sobre todo, la del SAPI que sirve peticiones (PHP-FPM, Octane, mod_php…). En hosting gestionado (Forge, Ploi, Vapor, hosting compartido) consulta el panel o al proveedor.",
    code: `php -v                    # versión del CLI
php-fpm8.3 -v             # versión del FPM (ajusta la rama)
php artisan about         # resumen del entorno Laravel
composer show --platform | grep php   # PHP con el que se resolvió composer`,
    codeLabel: "inventario en el servidor de la API",
  },
  {
    id: "t3",
    title: "Si usáis Docker / Sail: revisar la imagen base",
    text: "El PHP de dentro del contenedor es independiente del host. Reconstruid las imágenes con la base parcheada y redesplegad. Revisad también imágenes de CI y de staging.",
    code: `# Ver la versión DENTRO del contenedor en ejecución
docker compose exec laravel.test php -v

# Reconstruir con imágenes base actualizadas
docker compose build --pull --no-cache
docker compose up -d`,
    codeLabel: "docker / laravel sail",
  },
  {
    id: "t4",
    title: "Actualizar PHP a la versión corregida",
    text: "Actualizad a 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35 según vuestra rama (o el paquete parcheado de la distro). Laravel 11/12 requiere PHP ≥ 8.2, así que cualquier instalación razonablemente reciente de Twinteach tiene parche disponible. Actualizar Composer NO sirve de nada: el bug está en el intérprete, no en las dependencias.",
    code: `sudo apt update
sudo apt install --only-upgrade 'php8.3*'
php -v    # confirmar >= 8.3.36`,
    codeLabel: "actualización del intérprete",
  },
  {
    id: "t5",
    title: "Reiniciar workers y verificar el binario en ejecución",
    text: "PHP-FPM, Apache y Octane mantienen el binario viejo en memoria hasta reiniciarlos. Reiniciad también Horizon y el scheduler si comparten máquina, y verificad la versión que sirve la web con una ruta temporal protegida.",
    code: `sudo systemctl restart php8.3-fpm nginx
php artisan octane:reload      # si usáis Octane
php artisan horizon:terminate  # Horizon se relanza solo
php artisan queue:restart      # workers de colas

# Ruta temporal de verificación (¡eliminar después!)
# routes/web.php
Route::get('/_php-version', fn () => PHP_VERSION)
    ->middleware(['auth']);    // solo admins`,
    codeLabel: "reinicio y verificación",
  },
  {
    id: "t6",
    title: "Aplicar defensa en profundidad en el perímetro",
    text: "Delante de la API de Laravel: activad las reglas gestionadas anti-PHP2Shell del CDN/WAF, limitad el tamaño de cuerpo (client_max_body_size en Nginx es un buen techo), y revisad que post_max_size y upload_max_filesize no sean mayores de lo que Twinteach necesita para sus subidas.",
    code: `# nginx.conf / sitio de la API
client_max_body_size 12m;   # ajusta al máximo real de Twinteach

# php.ini
post_max_size = 12M
upload_max_filesize = 10M`,
    codeLabel: "límites razonables de petición",
  },
  {
    id: "t7",
    title: "Revisar si hubo explotación ANTES del parche",
    text: "La explotación empezó el 17 de octubre, antes del parche. Aunque ya estéis actualizados, revisad logs y procesos desde esa fecha (ver sección 06). Si encontráis indicios de compromiso: rotad APP_KEY con cuidado, credenciales de base de datos, tokens de API y sesiones, y redesplegad desde una imagen limpia.",
  },
  {
    id: "t8",
    title: "Cerrar el ciclo: monitorización y prevención",
    text: "Dejad alertas permanentes para «shell lanzada por proceso web», errores de memoria en Unknown on line 0 y segfaults de workers. incluid el intérprete PHP en el inventario de parcheo (no solo composer/npm) y planificad la salida de PHP 8.2 antes del 31/12/2026.",
  },
];

const STORAGE_KEY = "twinteach-php2shell-checklist";

export default function TwinteachChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>("t1");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const reset = () => {
    setDone({});
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const completed = STEPS.filter((s) => done[s.id]).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  return (
    <div className="space-y-6">
      <div className="reveal grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-fixed-400/40 bg-fixed-400/5 p-5">
          <p className="flex items-center gap-2 font-display font-semibold text-fixed-400">
            <Layers className="h-4 w-4" aria-hidden /> Frontend · Angular
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            <strong className="text-white">No afectado.</strong> Angular se ejecuta en el navegador del usuario como
            JavaScript estático; no hay intérprete PHP en esa capa. Ningún cambio en el frontend mitiga ni agrava este fallo.
          </p>
        </div>
        <div className="rounded-lg border border-alert-500/40 bg-alert-500/5 p-5">
          <p className="flex items-center gap-2 font-display font-semibold text-alert-400">
            <TriangleAlert className="h-4 w-4" aria-hidden /> Backend · Laravel
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-200">
            <strong className="text-white">Afectado a través de PHP.</strong> El código de Laravel está bien; el problema
            es el motor que lo ejecuta. Ni Sanctum, ni los middlewares, ni la validación de formularios frenan el ataque:
            ocurre antes de que Laravel arranque.
          </p>
        </div>
      </div>

      <div className="reveal rounded-lg border border-ink-700 bg-ink-900/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Checklist de protección de Twinteach</h3>
            <p className="text-sm text-ink-300">
              Marca cada paso completado · el progreso se guarda en tu navegador
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-cyanish-400">{completed}/{STEPS.length}</span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded border border-ink-700 px-2.5 py-1.5 font-mono text-xs text-ink-300 transition hover:border-alert-500/60 hover:text-alert-400"
            >
              <RotateCcw className="h-3 w-3" aria-hidden /> Reiniciar
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-fixed-400" : "bg-cyanish-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="mt-3 rounded border border-fixed-400/40 bg-fixed-400/10 px-3 py-2 text-sm text-fixed-400">
            ✓ Checklist completo: Twinteach queda protegido frente a PHP2Shell. Mantén la monitorización activa.
          </p>
        )}
      </div>

      <ol className="space-y-3">
        {STEPS.map((s, i) => {
          const isOpen = open === s.id;
          const isDone = !!done[s.id];
          return (
            <li
              key={s.id}
              className={`reveal rounded-lg border transition ${isDone ? "border-fixed-400/40 bg-fixed-400/5" : "border-ink-700 bg-ink-900/50"}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => toggle(s.id)}
                  aria-label={isDone ? `Marcar paso ${i + 1} como pendiente` : `Marcar paso ${i + 1} como completado`}
                  className="mt-0.5 shrink-0 transition hover:scale-110"
                >
                  {isDone ? (
                    <CheckSquare className="h-5 w-5 text-fixed-400" />
                  ) : (
                    <Square className="h-5 w-5 text-ink-300" />
                  )}
                </button>
                <button onClick={() => setOpen(isOpen ? null : s.id)} className="flex-1 text-left">
                  <span className={`font-display font-semibold ${isDone ? "text-fixed-400" : "text-white"}`}>
                    <span className="mr-2 font-mono text-xs text-ink-300">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </span>
                  <span className="ml-2 font-mono text-xs text-ink-300">{isOpen ? "−" : "+"}</span>
                  {!isOpen && <p className="mt-1 line-clamp-1 text-sm text-ink-300">{s.text}</p>}
                </button>
              </div>
              {isOpen && (
                <div className="space-y-3 border-t border-ink-800 px-4 pb-4 pl-12 pt-3">
                  <p className="text-sm leading-relaxed text-ink-200">{s.text}</p>
                  {s.code && <CodeBlock code={s.code} label={s.codeLabel} />}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}