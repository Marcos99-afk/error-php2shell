import { useState } from "react";
import { Check, Copy, TerminalSquare, FileCode2 } from "lucide-react";

interface CodeBlockProps {
  code: string;
  label?: string;
  kind?: "terminal" | "code" | "log";
  className?: string;
}

export default function CodeBlock({ code, label, kind = "terminal", className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard no disponible */
    }
  };

  const Icon = kind === "terminal" ? TerminalSquare : FileCode2;

  return (
    <div
      className={`group overflow-hidden rounded-lg border border-ink-700/70 bg-ink-950/90 shadow-lg shadow-black/30 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink-700/60 bg-ink-900/80 px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-300">
          <Icon className="h-3.5 w-3.5 text-cyanish-400" aria-hidden />
          {label ?? (kind === "log" ? "registro" : kind === "code" ? "código" : "terminal")}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded border border-ink-700 px-2 py-1 font-mono text-[11px] text-ink-300 transition hover:border-cyanish-400/60 hover:text-cyanish-400"
          aria-label="Copiar al portapapeles"
        >
          {copied ? <Check className="h-3 w-3 text-fixed-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}