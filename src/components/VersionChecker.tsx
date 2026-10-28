import { useMemo, useState } from "react";
import { Search, ShieldCheck, ShieldAlert, CircleHelp, Server } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface Branch {
  branch: string;
  fixed: [number, number, number];
  fixedStr: string;
  support: string;
  tone: "ok" | "warn" | "bad";
}

const BRANCHES: Branch[] = [
  { branch: "8.5", fixed: [8, 5, 12], fixedStr: "8.5.12", support: "Soporte activo", tone: "ok" },
  { branch: "8.4", fixed: [8, 4, 27], fixedStr: "8.4.27", support: "Soporte activo", tone: "ok" },
  { branch: "8.3", fixed: [8, 3, 36], fixedStr: "8.3.36", support: "Solo seguridad", tone: "ok" },
  { branch: "8.2", fixed: [8, 2, 35], fixedStr: "8.2.35", support: "Fin de vida: 31 dic 2026", tone: "warn" },
];

type Verdict = { kind: "vulnerable" | "fixed" | "eol" | "unknown"; title: string; detail: string };

function check(version: string): Verdict | null {
  const m = version.trim().match(/^(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!m) return null;
  const major = +m[1];
  const minor = +m[2];
  const patch = m[3] !== undefined ? +m[3] : 0;

  if (major !== 8 && major !== 7 && major !== 5) {
    return { kind: "unknown", title: "Versión no reconocida", detail: "Introduce una versión con formato X.Y.Z, por ejemplo 8.3.30." };
  }
  const branch = BRANCHES.find((b) => b.branch === `${major}.${minor}`);
  if (branch) {
    const v = [major, minor, patch];
    const vulnerable = v[0] < branch.fixed[0] || v[1] < branch.fixed[1] || v[2] < branch.fixed[2];
    return vulnerable
      ? {
          kind: "vulnerable",
          title: `PHP ${major}.${minor}.${patch} es VULNERABLE`,
          detail: `Actualiza de inmediato a PHP ${branch.fixedStr} o superior (o al paquete parcheado de tu distribución).`,
        }
      : {
          kind: "fixed",
          title: `PHP ${major}.${minor}.${patch} está protegido`,
          detail: `Incluye la corrección de ambos CVE. Recuerda haber reiniciado los workers (PHP-FPM / Apache) tras actualizar.${branch.tone === "warn" ? " Ojo: la rama 8.2 llega a su fin de vida el 31/12/2026." : ""}`,
        };
  }
  if (major === 8 && (minor === 0 || minor === 1)) {
    return {
      kind: "eol",
      title: `PHP ${major}.${minor}.${patch}: vulnerable y fuera de soporte`,
      detail: "No hay release oficial corregida. PHP publicó backports mínimos del código fuente para 7.4, 8.0 y 8.1; consulta a tu distribución o, mejor, migra a una rama soportada (≥ 8.2.35).",
    };
  }
  return {
    kind: "eol",
    title: `PHP ${major}.${minor}.${patch}: vulnerable y sin parche`,
    detail: "Todas las versiones desde PHP 5.4 están afectadas. Las ramas ≤ 7.3 no reciben ninguna corrección: la única salida razonable es migrar a una versión soportada y parcheada.",
  };
}

export default function VersionChecker() {
  const [input, setInput] = useState("");
  const verdict = useMemo(() => (input.trim() ? check(input) : null), [input]);

  const tone =
    verdict?.kind === "vulnerable" || verdict?.kind === "eol"
      ? "border-alert-500/60 bg-alert-500/10"
      : verdict?.kind === "fixed"
        ? "border-fixed-400/60 bg-fixed-400/10"
        : "border-ink-600 bg-ink-850";

  return (
    <div className="space-y-6">
      <div className="reveal overflow-hidden rounded-lg border border-ink-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-850 font-display text-xs uppercase tracking-wider text-ink-300">
              <th className="px-4 py-3">Rama de PHP</th>
              <th className="px-4 py-3">Versiones vulnerables</th>
              <th className="px-4 py-3">Primera versión corregida</th>
              <th className="hidden px-4 py-3 sm:table-cell">Estado de soporte</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            {BRANCHES.map((b) => (
              <tr key={b.branch} className="border-b border-ink-800 transition hover:bg-ink-850/70">
                <td className="px-4 py-3 font-bold text-white">{b.branch}.x</td>
                <td className="px-4 py-3 text-alert-400">&lt; {b.fixedStr}</td>
                <td className="px-4 py-3 text-fixed-400">✓ {b.fixedStr}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`font-body text-xs ${b.tone === "warn" ? "text-amberish-400" : "text-ink-300"}`}>
                    {b.support}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="border-b border-ink-800 transition hover:bg-ink-850/70">
              <td className="px-4 py-3 font-bold text-white">7.4 · 8.0 · 8.1</td>
              <td className="px-4 py-3 text-alert-400">Todas (EOL)</td>
              <td className="px-4 py-3 text-amberish-400">Solo backports de fuente</td>
              <td className="hidden px-4 py-3 font-body text-xs text-amberish-400 sm:table-cell">Sin soporte oficial</td>
            </tr>
            <tr className="transition hover:bg-ink-850/70">
              <td className="px-4 py-3 font-bold text-white">5.4 → 7.3</td>
              <td className="px-4 py-3 text-alert-400">Todas</td>
              <td className="px-4 py-3 text-alert-400">Ninguna</td>
              <td className="hidden px-4 py-3 font-body text-xs text-alert-400 sm:table-cell">Migración obligatoria</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="reveal rounded-lg border border-ink-700 bg-ink-900/70 p-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <Search className="h-5 w-5 text-cyanish-400" aria-hidden />
          Comprueba tu versión de PHP
        </h3>
        <p className="mt-1 text-sm text-ink-300">
          Escribe la versión que devuelve <code className="font-mono text-cyanish-400">php -v</code> en tu servidor y
          obtén el veredicto al instante.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 font-mono text-sm focus-within:border-cyanish-400">
            <span className="text-ink-600">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="8.3.30"
              className="w-32 bg-transparent text-white placeholder-ink-600 outline-none"
              aria-label="Versión de PHP a comprobar"
            />
          </div>
          {["8.1.27", "8.2.35", "8.3.30", "8.4.27", "8.5.11"].map((v) => (
            <button
              key={v}
              onClick={() => setInput(v)}
              className="rounded border border-ink-700 px-2.5 py-1.5 font-mono text-xs text-ink-300 transition hover:border-cyanish-400/60 hover:text-cyanish-400"
            >
              {v}
            </button>
          ))}
        </div>

        {verdict && (
          <div className={`mt-4 flex items-start gap-3 rounded-lg border p-4 ${tone}`} role="status">
            {verdict.kind === "fixed" ? (
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-fixed-400" aria-hidden />
            ) : verdict.kind === "unknown" ? (
              <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-ink-300" aria-hidden />
            ) : (
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-alert-400" aria-hidden />
            )}
            <div>
              <p className="font-display font-semibold text-white">{verdict.title}</p>
              <p className="mt-1 text-sm text-ink-200">{verdict.detail}</p>
            </div>
          </div>
        )}
      </div>

      <div className="reveal grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-lg border border-ink-700 bg-ink-900/50 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <Server className="h-4 w-4 text-cyanish-400" aria-hidden />
            Todos los modos de servir PHP están afectados
          </p>
          <div className="flex flex-wrap gap-2">
            {["Apache mod_php", "PHP-FPM", "php-cgi", "FrankenPHP", "LiteSpeed"].map((s) => (
              <span key={s} className="rounded border border-alert-500/40 bg-alert-500/10 px-2.5 py-1 font-mono text-xs text-alert-400">
                {s}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-ink-300">
            PHP considera el riesgo <strong className="text-white">máximo con mod_php</strong>: una petición sin
            autenticar puede disparar el exploit antes de que corra cualquier código de la aplicación. PHP-CLI puro
            (scripts de consola que no sirven HTTP) no expone esta vía, pero conviene actualizarlo igualmente.
          </p>
        </div>
        <div>
          <CodeBlock
            label="comprobar el runtime real (no solo el CLI)"
            code={`# CLI (puede NO coincidir con el que sirve la web)
php -v

# PHP-FPM: versión del binario que sirve peticiones
php-fpm8.3 -v

# Desde la propia aplicación (temporal, ¡bórralo!)
# routes/web.php en Laravel:
Route::get('/_version', fn () => PHP_VERSION)
    ->middleware('auth');`}
          />
        </div>
      </div>
    </div>
  );
}