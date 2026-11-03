# TilcAI — web (Next.js)

TilcAI's website, bilingual developer documentation and backend monitor. The project builds infrastructure for commerce between AI agents, people and businesses, with payments on Stellar.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, following the `create-next-app --yes` defaults.
English is the default language; Spanish is available through the EN / ES selector.

> The landing's policy demo is a visual simulation. The infrastructure separately has documented USDC transfers from Avalanche to Stellar on mainnet, testnet support for Monad, and SDK/MCP packages. The complete commercial purchase flow remains in integration; proprietary contracts are not independently audited. See the documentation for evidence and environment-specific scope.

## Check-in · 1 de noviembre de 2026

Contexto para el equipo de lo que se hizo hoy (OmarQV con Claude Code). Detalle en `AGENT_HISTORY.md` y en cada PR.

**Entorno**
- [x] Node.js local actualizado a **24.22.1**, la misma versión mayor que la imagen de producción (`deploy/Dockerfile`, `NODE_VERSION=24`). Con eso, las suites de los cuatro PRs de infraestructura pasan completas; los 17 fallos de antes venían de Node 22.16.

**tilcai-web** (rama `feat/monitor-gap-til07`)
- [x] **Monitor (N-11):** el contrato reconoce `monitor.gap`, el campo `gap` de la entrega y los nuevos campos de retención de la foto. El store guarda por backend los eventos perdidos sin contarlos dos veces (`src/lib/monitor/gaps.ts`), y el tablero muestra cuántos se perdieron, en qué posiciones y la retención vigente.
- [x] **TIL-07 (#24):** Ethereum, Arbitrum y Base Sepolia vuelven a «laboratorio». No hay hashes de esas rutas y el contexto oficial dice Fuji «verificado», el resto «laboratorio». Un test impide marcar una red como verificada sin un pago en `evidencePayments`. Para promover una red: agregar su burn y su mint, y después cambiar su estado.
- [x] **Documentación:** artículo nuevo «Operación y despliegue»; `/ready` en la referencia de la API; retención en Monitorización; arranque cerrado y escritor único en Seguridad y límites; estado y fuentes al 1 de noviembre.
- [x] Verificación: `npm test` 114/114, `tsc --noEmit` sin errores, `npm run build` con 56 páginas estáticas.

**tilcai-infrastructure** (PRs en revisión)
- [x] [#43](https://github.com/TilcAI/tilcai-infrastructure/pull/43) · N-04 #30: el proceso no arranca si `TILCAI_API_KEYS` no se sincroniza, en lugar de seguir aceptando una clave retirada. 195/195 tests.
- [x] [#44](https://github.com/TilcAI/tilcai-infrastructure/pull/44) · N-12 #38: `/health` queda como liveness y `/ready` como readiness por modo, con `?mode=transactional` antes de activar mainnet. 208/208 tests. **Está apilado sobre #43:** primero se hace el merge de #43 y después se cambia la base de #44 a `main`.
- [x] [#45](https://github.com/TilcAI/tilcai-infrastructure/pull/45) · N-11 #37: retención del monitor sin pérdidas silenciosas; lo pendiente se conserva hasta 90 días y después se informa `monitor.gap`. 201/201 tests. Usa la migración 8: la 6 es de `feat/qr-providers-fallback` y la 7 de `feat/third-party-credentials`.
- [x] [#46](https://github.com/TilcAI/tilcai-infrastructure/pull/46) · N-07 #33: análisis de escritor único en Cloud Run, protocolo de staging y herramienta `deploy/staging/n07-writer.mjs`. **No cierra el issue.**

**Pendiente**
- [ ] Revisiones y merges de #43 → #44 → #45 y #46, y de esta rama.
- [ ] **Orden entre repos:** el merge de [#45](https://github.com/TilcAI/tilcai-infrastructure/pull/45) en infra va **antes** que esta rama. El test `contract: event types and alert codes match the backend's` compara con el `tilcai-infrastructure` de al lado y espera `monitor.gap`: con infra en `main` falla 1 test, y con #45 pasan los 114.
- [ ] N-07: un proyecto de staging autorizado por operación para correr los ensayos E1–E5. Hasta entonces, **no etiquetar revisiones de `tilcai` en Cloud Run** y publicar sin pagos en curso.
- [ ] Conflictos chicos al integrar `feat/qr-providers-fallback` (infra) y `feat/qr-gateway-events` (web) con estos cambios, en los mismos archivos del monitor y la API.
- [ ] Un almacén duradero para el monitor de la web, si va a correr con más de una instancia (sin cambios).

## Run it

Requirements: Node.js 20.9+ (22 LTS recommended) and pnpm.

```bash
cd tilcai-web
pnpm install --frozen-lockfile  # use the committed dependency versions
pnpm dev          # http://localhost:3000  (redirects to /en)
```

Production build:

```bash
pnpm build
pnpm start
```

Tests (no extra dependencies; they use Node's built-in runner, so Node.js 22.18+ is needed):

```bash
pnpm test         # node --experimental-strip-types --test test/*.test.ts
```

`package.json` uses `"latest"`, while the committed lockfile records resolved versions. Preserve this project and its lockfile when editing content; dependency upgrades are a separate task.

## Routes

| URL | Content |
| --- | --- |
| `/` | Redirects to `/en` (see `next.config.ts`) |
| `/en`, `/es` | Landing |
| `/en/docs`, `/es/docs` | Developer portal: entry guides, local search and integration paths |
| `/en/docs/[slug]`, `/es/docs/[slug]` | 19 guides: SDK, MCP, API, networks, Monad Testnet, mainnet evidence, accounts, x402, fiat/QR, architecture and security |
| `/en/monitor`, `/es/monitor` | Backend monitor: resources, alerts and events reported by TilcAI's backend (see [Backend monitor](#backend-monitor)). Not linked from the site and not indexed |
| `/api/monitor/*` | The monitor's API: `events` (ingest and feed), `summary`, `stream` (Server-Sent Events) and `session` |

Both languages are generated statically (`generateStaticParams`); any other language segment returns 404.
The landing's `#demo` section shows three fixed policy scenarios. It does not call `tilcai-core` or a payment network.

## Structure

```text
src/
├── app/
│   ├── globals.css               # Tailwind import + design tokens + all component styles
│   └── [lang]/
│       ├── layout.tsx            # root layout: <html lang>, fonts, metadata base
│       ├── page.tsx              # landing
│       ├── docs/page.tsx         # documentation portal; docs/[slug]/page.tsx renders each guide
│       ├── monitor/page.tsx      # backend monitor (static shell; data comes from /api/monitor)
│       └── not-found.tsx
├── components/
│   ├── PageShell.tsx             # skip link + header + main + footer
│   ├── SiteHeader.tsx            # client: mobile menu, language switch
│   ├── SiteFooter.tsx
│   ├── HomePage.tsx              # landing = composition of the sections below (server component)
│   ├── sections/                 # one file per landing section
│   │   ├── HeroSection.tsx       # renders the full-screen office hero (only <h1>)
│   │   ├── OfficeLegendSection.tsx # "How to read the office": one card per room
│   │   ├── ProductOverview.tsx   # "What TilcAI is" (copy key `problem`): your agent / TilcAI / the business
│   │   ├── BusinessesSection.tsx # client: capabilities tabs, the four ways to connect a business, what each side keeps
│   │   ├── FlowSection.tsx       # "Cómo funciona": mounts operation/ (copy in i18n/narrative.ts, `flow`)
│   │   ├── operation/            # one SVG scene + one scroll timeline: agent → business → TilcAI → approval → payment → two receipts
│   │   │   ├── OperationSection.tsx  # layout, modes (pinned / flow / static), nav timeline, Lenis, ScrollTrigger lifecycle
│   │   │   ├── timeline.ts           # the single GSAP timeline (phases in phases.ts); step cards on the right follow it
│   │   │   └── scene/                # one component per SVG group (Agent, Business, Core, Rules, Approval, Payment, Receipts…)
│   │   ├── RailsSection.tsx      # "Rutas de pago": composes ./rails (server)
│   │   ├── rails/                # RouteAtlas (one measured SVG map: x402 vs CCTP, Fuji verified, rest lab), EvidenceLedger, RailsHeader
│   │   │                         #   + rails.module.css; GSAP/ScrollTrigger on the shared Lenis, reduced-motion path = everything drawn
│   │   ├── RoadmapSection.tsx    # build status in three stages; environment chip and maintainer per item
│   │   ├── BuyerEntrances.tsx    # WhatsApp / MCP / API, each with its real state
│   │   ├── EntranceMap.tsx       # client: the three entrances as branches of one measured line that ends in what they share
│   │   ├── EntranceArt.tsx       # the three drawings (no text of their own)
│   │   ├── DemoSection, ControlSection, StackSection, CtaSection
│   │   │   CapabilitiesSection, InterfaceSection, CompareSection   # earlier content
│   │   └── shared.tsx            # SectionHead, StageTag
│   ├── FaqSection.tsx            # eight native disclosures from typed dictionaries
│   ├── AgentCatalog.tsx          # client: perspective carousel, six / twelve clients
│   ├── AgentCard.tsx             # keyboard-operable card with asset fallback
│   ├── AgentGuidePanel.tsx       # native modal drawer; preparation / validated guide
│   ├── CommerceScene.tsx         # four scroll-driven flow layers (FlowLayers)
│   ├── office/                   # full-screen office: layout, A*, simulation, canvas renderer, OfficeHero
│   ├── useDepthMotion.ts         # event-driven depth and reduced-motion preference
│   ├── PolicyDemo.tsx            # client: one panel — case, condition, request, walked path, result
│   ├── PolicyFlowVisualization.tsx # client: the request path (one GSAP timeline per run; end state drawn from props/CSS)
│   ├── CaseArt.tsx               # the three case drawings
│   ├── DocsPage.tsx              # architecture page (server component)
│   ├── CodeTabs.tsx              # client: accessible tabs for the proposed JSON
│   ├── DocsToc.tsx               # client: table of contents with scroll-spy
│   ├── RevealObserver.tsx        # client: reveal as content enters the viewport
│   └── Icon.tsx
└── lib/
    ├── content/agents.ts         # typed catalog, surfaces and official references
    ├── content/roadmap.ts        # stage, environment (simulation/testnet) and optional maintainer of every roadmap item (no dates)
    ├── content/rails.ts          # CCTP lab networks with their status, and the testnet evidence hashes
    ├── i18n/                     # all visible copy — en.ts, es.ts, docs.en.ts, docs.es.ts, types.ts
    ├── highlight.ts              # build-time syntax colouring for code blocks
    ├── snippets.ts               # conceptual JSON shown on the landing
    ├── metadata.ts               # per-page title, description, hreflang, Open Graph
    └── site.ts                   # routes and site URL
public/assets/                    # TilcAI branding and supplied Codex / Claude mascots
```

## Hero: the TilcAI office (full screen)

- The first screen is a live, local simulation of an isometric office (`src/components/office/`). It fills `100svh`; everything else is reached by scrolling.
- Rooms are the pieces of TilcAI: Intent hub → Businesses → Policy core → Human approval → Shared budget → Vault · Stellar rail → Receipts, plus a café. The floor plan is data in `office/layout.ts` (rooms, doors, furniture, interaction spots).
- `office/sim.ts` runs the operations (intent, signed quote, deterministic policy decision, approval, budget hold, x402 settlement, receipts) with integer cents, a seeded RNG and no network or wallet. `office/pathfinding.ts` is A* on a 4-neighbour grid where rooms are entered only through doors. `office/render.ts` draws the 2:1 projection on two canvases (a cached floor and a 60 fps dynamic layer).
- `office/OfficeHero.tsx` adds the HUD (root budget, settled volume, decisions, ALLOW %, DENY, approvals), the A2A stream, the agent card (tap an agent), the hero copy with the page's only `<h1>`, and commands: valid purchase, prompt injection, duplicate retry, over-threshold approval, pause mandate, kill switch, zoom and pause. The loop stops when the hero is off screen or the tab is hidden; `prefers-reduced-motion` starts it paused.
- All office copy lives in `src/lib/i18n/office.es.ts` / `office.en.ts` (`office` key). The section `#office` (`sections/OfficeLegendSection.tsx`) explains each room below the hero.
- Every figure, ID, ledger number and transaction hash in the office is illustrative; the HUD states "Simulation · no funds".

## Editing content

- Change text in `src/lib/i18n/en.ts` and `es.ts`. `types.ts` forces both languages to carry the same keys, so a page never mixes languages.
- Architecture sections live in `docs.en.ts` / `docs.es.ts` as small HTML strings written in this repo (trusted content, rendered with `dangerouslySetInnerHTML`). Never put user input there.
- The ES/EN message map, CTA destinations and team handoffs are in [docs/messaging-map.md](docs/messaging-map.md).
- Construction labels (`available`, `integration`, `next`) are defined once in `stageLabels`. Assistant integration labels and environment labels are separate dimensions in `integrationLabels` and `environmentLabels`.
- `FAQ_IDS` fixes the order of eight questions. Both dictionaries must provide every answer; keep each answer between 40 and 80 words.
- `businesses` supplies the business grid copy; `control` remains copy for a future component. `agents` supplies the catalog and guide panel. Dictionary content does not mean an operational integration is enabled.
- The business grid reads typed entries from `src/lib/content/businesses.ts`. It currently shows a pilot exploration invitation because no business has publication approval. See [docs/business-inventory.md](docs/business-inventory.md) before adding a profile; local-only generic cards are at `/en/business-preview` and `/es/business-preview` in development (404 in production). Categories and service summaries are closed keys (`BusinessCategoryKey`, `BusinessServiceKey`), so both dictionaries must translate every one. A card shows media only if `mediaApproved`, and its action is the strongest one that is operational (never "Buy" without a validated flow).
- Add assistant clients in `src/lib/content/agents.ts`; no component changes are needed. See [docs/agent-catalog.md](docs/agent-catalog.md) for state promotion requirements, surface distinctions and asset handling.
- Landing snippets receive translated comments from `code.comments`; they are illustrative excerpts, not complete payloads or a public SDK API.
- CTAs currently explore the flow, capabilities, simulation and docs. A public contact channel/backend is needed before enabling pilot requests.
- The architecture dictionaries (`docs.en.ts`, `docs.es.ts`) follow the new direction: architecture, business integration, MCP and assistants, permissions and payments. Their HTML is trusted repository content; never interpolate form data or any user-supplied value into it.
- The payment-routes map and the evidence rows come from `src/lib/content/rails.ts`. A network is `verified` only after a real end-to-end payment on that route; `test/landing-explain.test.ts` fails if a second one is marked verified. The evidence rows are real testnet transactions: replace them rather than invent new ones.
- The build-status roadmap has one entry per capability in `src/lib/content/roadmap.ts` (stage, environment and, when someone is assigned, maintainer) and its copy under `roadmap.items` in both dictionaries (`ROADMAP_IDS` keeps them aligned). Move an item to another stage only with evidence in its stated environment, and never add dates. The x402 / Relayer wording must stay consistent with [tilcai-core's payment rail documentation](https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md).
- Financial-state wording (allowed ≠ approved ≠ sent ≠ settled ≠ delivered) was reviewed in [docs/qa-financial-states.md](docs/qa-financial-states.md); repeat that review when copy about decisions, payments or delivery changes.
- Only change wording to "live" or "deployed" when there is something verifiable (contract ID, testnet transaction, public repository).
- Absolute Open Graph URLs use `NEXT_PUBLIC_SITE_URL` if it is set to a valid URL (e.g. `https://tilcai.xyz`). On Vercel it is optional: if it is missing or empty, the production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically. Locally, copy `.env.example` to `.env.local`.

## Styling

The visual system follows thegraph.com (palette, type scale, buttons, gradient); see [docs/redesign-the-graph.md](docs/redesign-the-graph.md) for the extracted tokens and the layout mock-up.
Tokens live at the top of `globals.css` (`--bg #0C0A1D`, `--pane #1A172F`, `--purple #6F4CFF`, secondary blue/turquoise/green/yellow/red/pink). Semantic CSS classes stay unlayered so they take precedence over Tailwind's base layer; Tailwind v4 remains available (`bg-surface`, `text-purple`, `font-mono`…).
Fonts: Plus Jakarta Sans (display/UI) and JetBrains Mono (figures) via `next/font/google`. The Graph uses the licensed Euclid Circular A; to switch, load it with `next/font/local` and point `--font-jakarta` at it.
Brand assets generated from `TilcAI_logo.png` are in `public/brand/` (white logo, cat mark, favicon, apple-touch icon, 512 icon, Open Graph image).

`office.css` styles the full-screen hero; `landing.css` the sections, office legend, flow layers and technical disclosures; `agents.css` the carousel and right-side modal.

## Accessibility

Skip link, visible focus, keyboard-operable menu (Esc closes) and code tabs (arrow keys, Home, End), `prefers-reduced-motion` support, readable without JavaScript, text contrast ≥ 4.5:1, `lang` and `hreflang` per language.

## WEB-01 validation

The production build and TypeScript check pass. Dictionary parity, eight FAQ answers per language (40–80 words), desktop/mobile copy, FAQ keyboard operation and the mobile menu after language switching were checked locally. See [the verification record](docs/messaging-map.md#verificación-local--2026-09-30) for scope and pending team review.

Lint remains blocked before source analysis: the installed `typescript-eslint` rejects TypeScript 7.0.2. Resolve the tooling compatibility in a dependency task; do not work around it by rebuilding this project from a scaffold. This content update preserves `package.json` and `pnpm-lock.yaml`.

## Backend monitor

`tilcai-infrastructure` pushes its events to this site, which keeps the latest ones and shows
them with their interpretation. The full explanation of both sides is in
[`documentation/2-ARQUITECTURA/TILCAI_MONITORIZACION_EVENTOS_BACKEND_FRONTEND_2026-10-09.md`](https://github.com/TilcAI/documentation/blob/main/2-ARQUITECTURA/TILCAI_MONITORIZACION_EVENTOS_BACKEND_FRONTEND_2026-10-09.md).

```text
backend ── POST /api/monitor/events (signed) ──▶ MonitorStore (memory) ──▶ GET /api/monitor/summary
                                                       │                    GET /api/monitor/events?after=<cursor>
                                                       └──────────────────▶ GET /api/monitor/stream (SSE) ──▶ /[lang]/monitor
```

| Piece | Where | What it does |
| --- | --- | --- |
| Contract | `src/lib/monitor/contract.ts` | Types of `tilcai-monitor-v1` and the validation of a delivery. Mirrors the backend's `src/modules/monitor/domain.ts` |
| Signature | `src/lib/monitor/signature.ts` | `X-Tilcai-Signature: v1=HMAC-SHA256(secret, "<X-Tilcai-Timestamp>.<body>")`, refused when older than 5 minutes |
| Store | `src/lib/monitor/store.ts` | The last 2000 events, each backend's last resource snapshot and its active alerts. A cache of the backend's log, not the log |
| Gaps | `src/lib/monitor/gaps.ts` | Events a backend pruned before they reached this site (`monitor.gap` and the delivery's `gap`), counted once. No Node APIs: the dashboard uses it in the browser. With `MONITOR_STORE_FILE`, the store keeps every backend's gaps whole in `<file>.gaps.json`, so a restart remembers them even when the feed's bounded tail no longer holds the `monitor.gap` event |
| Interpretation | `src/lib/monitor/interpret.ts` | What every event type and alert code means, and what to do about an alert, in English and Spanish |
| Access | `src/lib/monitor/access.ts` | Who may read: the dashboard token (session cookie or `Authorization: Bearer`) |
| Hook and view | `src/components/monitor/` | `useMonitorFeed()` (summary + events + live stream) and `MonitorBoard`, a plain base view |

Configuration (`.env.local`, or the host's environment variables):

| Variable | Purpose |
| --- | --- |
| `MONITOR_INGEST_SECRET` | Shared with the backend (`MONITOR_WEB_SECRET` there). Without it the site accepts no events (`503`) |
| `MONITOR_DASHBOARD_TOKEN` | What a person presents to open `/[lang]/monitor`. Without it the monitor is open in development and closed in production (`503`): it shows balances, addresses and operation ids |
| `MONITOR_STORE_FILE` | Optional JSON-lines file so a single long-lived server keeps the feed across restarts |

On the backend: `MONITOR_WEB_URL=<this site>/api/monitor/events` and `MONITOR_WEB_SECRET`.

Limits to know before relying on it:

- **The store is in memory.** It starts empty with every server process, and on serverless
  hosting (Vercel) each instance has its own: an event received by one instance is not seen
  by a reader served by another. It is correct for `pnpm start` on one host and for local
  development; a deployment with more than one instance needs a durable store behind the
  same `MonitorStore` interface first.
- The backend keeps the complete log (`GET /v1/monitor/events` there) and sends again whatever
  this site did not acknowledge, so a restart loses history on screen, not events.
- `MonitorBoard` is the base the designed dashboard builds on: tiles, a feed and filters, no
  charts or history yet.

## Deployment

The team publishes the landing at `https://tilcai.vercel.app/en`. This is a website deployment, not a deployed TilcAI payment service. It also works on any Next.js host or as a Node server with `pnpm build && pnpm start`.

### In a container

`Dockerfile` builds the whole site. With a single instance and `MONITOR_STORE_FILE` on a
volume, the dashboard keeps its events across restarts, which a serverless deployment with the
in-memory store cannot do:

```sh
docker build -t tilcai/tilcai-web:local .
docker run -d --name tilcai-web --restart unless-stopped -p 3311:3000 \
  -e MONITOR_INGEST_SECRET=… -e MONITOR_DASHBOARD_TOKEN=… \
  -e MONITOR_STORE_FILE=/data/monitor-events.json -v tilcai-web-data:/data tilcai/tilcai-web:local
# backend: MONITOR_WEB_URL=http://<host>:3311/api/monitor/events, MONITOR_WEB_SECRET = MONITOR_INGEST_SECRET
```

A mainnet backend reports to the same endpoint with its own secret: add
`-e MONITOR_INGEST_SECRET_MAINNET=…` here and set `MONITOR_WEB_URL_MAINNET` and
`MONITOR_WEB_SECRET_MAINNET` there. Each secret is accepted for its environment only, so the two
must differ. The dashboard shows one block per backend, mainnet first and labelled as real funds.

## Estado de integración · 2026-11-02 UTC

`feat/qr-gateway-events` está publicada con referencia `6b3179f`; `main` se actualizó a
`5c5701e` antes de esta edición del README. Comprobar la rama al revisar cambios del monitor QR:
publicación de la rama no implica integración en main o despliegue del sitio.

Backend, SDK y MCP publicaron sus ramas de credenciales: API keys por tenant, entorno y
permisos, caducidad y rotación. La gestión se realiza con la CLI del operador del backend;
el sitio no incorpora un panel de emisión de claves. Guardar las credenciales de socios en
sus backends/gestores de secretos, fuera del navegador y del contenido público.

QR Simple genera imágenes desde payload; los depósitos del simulador no acreditan abonos.
Consultar [QR/configuración](https://github.com/TilcAI/documentation/blob/main/3-CONSTRUCCION/QR_PAYLOAD_Y_CONFIGURACION_2026-11-02.md), [credenciales](https://github.com/TilcAI/documentation/blob/main/3-CONSTRUCCION/CREDENCIALES_TERCEROS_IMPLEMENTACION_2026-11-01.md) y [estado de entrega](https://github.com/TilcAI/documentation/blob/main/3-CONSTRUCCION/ESTADO_REPOSITORIOS_2026-11-01.md).
La [facturación SIN](https://github.com/TilcAI/documentation/blob/main/2-ARQUITECTURA/TILCAI_FACTURACION_SIN_2026-11-01.md) permanece en diseño; el sitio no emite facturas fiscales.
