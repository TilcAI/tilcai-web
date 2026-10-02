# TilcAI — web (Next.js)

Landing page and **proposed architecture** page for TilcAI, an early-stage project in development.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, following the `create-next-app --yes` defaults.
English is the default language; Spanish is available through the EN / ES selector.

> The policy demo is a visual simulation only. There is no deployed contract, published package, live payment service or transfer of funds.

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
| `/en/docs`, `/es/docs` | Proposed design: architecture, business integration, MCP and assistants, permissions and payments, planned extensions |

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
│       ├── docs/page.tsx         # proposed architecture
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
│   │   ├── FlowSection, DemoSection, CapabilitiesSection, InterfaceSection, CompareSection,
│   │   │   StackSection, CtaSection   # earlier content, moved unchanged
│   │   │   RoadmapSection         # three build-status columns with a maintainer per item
│   │   └── shared.tsx            # SectionHead, StageTag
│   ├── FaqSection.tsx            # eight native disclosures from typed dictionaries
│   ├── AgentCatalog.tsx          # client: perspective carousel, six / twelve clients
│   ├── AgentCard.tsx             # keyboard-operable card with asset fallback
│   ├── AgentGuidePanel.tsx       # native modal drawer; preparation / validated guide
│   ├── CommerceScene.tsx         # four scroll-driven flow layers (FlowLayers)
│   ├── office/                   # full-screen office: layout, A*, simulation, canvas renderer, OfficeHero
│   ├── useDepthMotion.ts         # event-driven depth and reduced-motion preference
│   ├── PolicyDemo.tsx            # client: illustrative policy choices
│   ├── DocsPage.tsx              # architecture page (server component)
│   ├── CodeTabs.tsx              # client: accessible tabs for the proposed JSON
│   ├── DocsToc.tsx               # client: table of contents with scroll-spy
│   ├── RevealObserver.tsx        # client: reveal as content enters the viewport
│   └── Icon.tsx
└── lib/
    ├── content/agents.ts         # typed catalog, surfaces and official references
    ├── content/roadmap.ts        # stage and maintainer of every roadmap item (no dates)
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
- The build-status roadmap has one entry per capability in `src/lib/content/roadmap.ts` (stage and maintainer) and its copy under `roadmap.items` in both dictionaries (`ROADMAP_IDS` keeps them aligned). Move an item to another stage only with evidence in its stated environment, and never add dates. The x402 / Relayer wording must stay consistent with [tilcai-core's payment rail documentation](https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md).
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

## Deployment

The team publishes the landing at `https://tilcai.vercel.app/en`. This is a website deployment, not a deployed TilcAI payment service. It also works on any Next.js host or as a Node server with `pnpm build && pnpm start`.
