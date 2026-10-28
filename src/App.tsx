import { History, Bug, ListChecks, Wrench, Blocks, Radar, Lightbulb, BookMarked, ShieldCheck } from "lucide-react";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section";
import Timeline from "./components/Timeline";
import Vulnerability from "./components/Vulnerability";
import VersionChecker from "./components/VersionChecker";
import Solutions from "./components/Solutions";
import TwinteachChecklist from "./components/TwinteachChecklist";
import Detection from "./components/Detection";
import Extras from "./components/Extras";

export default function App() {
  return (
    <div className="bg-scene min-h-screen">
      <Hero />

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 py-10 lg:grid-cols-[250px_1fr] lg:gap-12">
          <Sidebar />

          <main>
            <Section
              id="cronologia"
              number="01"
              icon={History}
              title="¿Por qué se descubrió y cuándo ocurrió?"
              kicker="Un hallazgo impulsado por IA, una filtración que adelantó el calendario y una explotación que empezó antes del parche."
            >
              <Timeline />
            </Section>

            <Section
              id="vulnerabilidad"
              number="02"
              icon={Bug}
              title="¿En qué consiste el incidente?"
              kicker="Dos bugs de gestión de memoria en el núcleo de PHP que, encadenados con datos controlados por el atacante, terminan en una shell."
            >
              <Vulnerability />
            </Section>

            <Section
              id="versiones"
              number="03"
              icon={ListChecks}
              title="¿A qué versiones afecta?"
              kicker="Todas las ramas desde PHP 5.4 están afectadas. Solo hay cuatro versiones corregidas con soporte oficial: comprueba la tuya."
            >
              <VersionChecker />
            </Section>

            <Section
              id="soluciones"
              number="04"
              icon={Wrench}
              title="¿Qué soluciones existen?"
              kicker="Parchear es la única solución completa. Las mitigaciones solo compran tiempo mientras actualizas."
            >
              <Solutions />
            </Section>

            <Section
              id="twinteach"
              number="05"
              icon={Blocks}
              title="Twinteach: Angular + Laravel, ¿está protegido?"
              kicker="Plan de verificación paso a paso para un frontend Angular y un backend Laravel, con comandos listos para copiar."
            >
              <TwinteachChecklist />
            </Section>

            <Section
              id="deteccion"
              number="06"
              icon={Radar}
              title="¿Cómo saber si alguien la aprovechó?"
              kicker="Tres capas de señales —peticiones, logs y procesos— que, correlacionadas, revelan un intento o una explotación exitosa."
            >
              <Detection />
            </Section>

            <Section
              id="contexto"
              number="07"
              icon={Lightbulb}
              title="Otros aspectos importantes y conclusiones"
              kicker="El papel de la IA, la escala del incidente, el tercer CVE y las lecciones que deja PHP2Shell."
            >
              <Extras />
            </Section>
          </main>
        </div>
      </div>

      <footer className="border-t border-ink-800 bg-ink-950/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-fixed-400" aria-hidden />
            <p className="font-display text-sm font-semibold text-white">
              Informe PHP2Shell <span className="font-normal text-ink-300">· «php2bash» · CVE-2026-109618 / CVE-2026-109619</span>
            </p>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-ink-300">
            <a
              href="https://github.com/NCSC-NL/php2shell"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition hover:text-cyanish-400"
            >
              <BookMarked className="h-3.5 w-3.5" aria-hidden /> Recursos NCSC-NL
            </a>
            <span>Actualizado: 25 oct 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}