# Despliegue en GitHub Pages — Informe PHP2Shell («php2bash»)

Este proyecto es una SPA construida con **Vite**, organizada en **componentes independientes**
(equivalentes funcionales a los componentes Angular: cada sección del informe es un componente
aislado en `src/components/`, con su propio estado, plantillas y datos).

## Opción A — Automática con GitHub Actions (recomendada)

El workflow ya está creado en `.github/workflows/deploy.yml`.

1. Crea un repositorio en GitHub (p. ej. `informe-php2shell`) y sube el proyecto:

   ```bash
   git init
   git add .
   git commit -m "Informe PHP2Shell"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/informe-php2shell.git
   git push -u origin main
   ```

2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` compila y publica automáticamente. El workflow ya pasa
   `--base=/<nombre-del-repo>/` a Vite, imprescindible para que las rutas de los
   assets funcionen en `https://TU_USUARIO.github.io/informe-php2shell/`.
4. La URL final aparece en **Settings → Pages** y en el log del job `deploy`.

## Opción B — Manual con la rama `gh-pages`

```bash
npm install
npx vite build --base=/informe-php2shell/   # usa el nombre real de tu repo
npx gh-pages -d dist                        # publica dist/ en la rama gh-pages
```

Después, en **Settings → Pages**, selecciona la rama `gh-pages` como fuente.

> Si publicas en un repositorio de tipo `TU_USUARIO.github.io` (sitio de usuario),
> usa `--base=/` en su lugar.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Estructura de componentes

| Componente (`src/components/`)  | Contenido                                                        |
| ------------------------------- | ---------------------------------------------------------------- |
| `Hero.tsx`                      | Cabecera del incidente, terminal animada y métricas clave        |
| `Sidebar.tsx`                   | Índice con scroll-spy (escritorio) y navegación móvil            |
| `Section.tsx`                   | Contenedor de sección con animación de aparición                 |
| `Timeline.tsx`                  | Cronología del descubrimiento y la explotación                   |
| `Vulnerability.tsx`             | Explicación técnica de los dos CVE y la cadena de ataque         |
| `VersionChecker.tsx`            | Tabla de versiones + comprobador interactivo de versión PHP      |
| `Solutions.tsx`                 | Parcheo paso a paso y mitigaciones temporales por pestañas       |
| `TwinteachChecklist.tsx`        | Checklist interactivo Angular + Laravel (persiste en localStorage)|
| `Detection.tsx`                 | Detección de explotación en 3 capas con comandos de ejemplo      |
| `Extras.tsx`                    | Contexto (IA, escala), conclusiones y fuentes                    |
| `CodeBlock.tsx`                 | Bloque de código reutilizable con botón «Copiar»                 |