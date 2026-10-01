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
│   │   ├── HeroSection.tsx       # the only <h1>: eyebrow, headline, CTAs, facts
│   │   ├── HeroScene.tsx         # section entry point for the holographic CommerceScene
│   │   ├── ProductOverview.tsx   # "What TilcAI is" (copy key `problem`): your agent / TilcAI / the business
│   │   ├── FlowSection, DemoSection, CapabilitiesSection, InterfaceSection, CompareSection,
│   │   │   StackSection, CtaSection   # earlier content, moved unchanged
│   │   │   RoadmapSection         # three build-status columns with a maintainer per item
│   │   └── shared.tsx            # SectionHead, StageTag
│   ├── FaqSection.tsx            # eight native disclosures from typed dictionaries
│   ├── AgentCatalog.tsx          # client: perspective carousel, six / twelve clients
│   ├── AgentCard.tsx             # keyboard-operable card with asset fallback
│   ├── AgentGuidePanel.tsx       # native modal drawer; preparation / validated guide
│   ├── CommerceScene.tsx         # holographic hero and four scroll-driven layers
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

## Hero and overview

- The hero section retains the compact headline and holographic composition. `sections/HeroScene.tsx` delegates to `CommerceScene.tsx`; pointer depth is event-driven, with a static presentation when JavaScript is unavailable or reduced motion is requested. The illustration represents roles and permissions, not a live operation or price quote.
- On mobile the copy comes first and the compact scene follows it. The four decorative flow layers are omitted below 960px to avoid increasing the page height.
- "Explore how it works" points to `#flow`; the secondary CTA ("Explore for my business") points to `#capabilities`.
- Copy lives in `hero` and `problem` in `src/lib/i18n/*.ts`. The caption uses `hero.visionNote`; the imported `hero.scene` example data remains available for future content but is not rendered by the current scene.

## Editing content

- Change text in `src/lib/i18n/en.ts` and `es.ts`. `types.ts` forces both languages to carry the same keys, so a page never mixes languages.
- Architecture sections live in `docs.en.ts` / `docs.es.ts` as small HTML strings written in this repo (trusted content, rendered with `dangerouslySetInnerHTML`). Never put user input there.
- The ES/EN message map, CTA destinations and team handoffs are in [docs/messaging-map.md](docs/messaging-map.md).
- Construction labels (`available`, `integration`, `next`) are defined once in `stageLabels`. Assistant integration labels and environment labels are separate dimensions in `integrationLabels` and `environmentLabels`.
- `FAQ_IDS` fixes the order of eight questions. Both dictionaries must provide every answer; keep each answer between 40 and 80 words.
- `businesses` and `control` provide copy for the team's upcoming components. `agents` supplies the catalog and guide panel. Dictionary content does not mean an operational integration is enabled.
- Add assistant clients in `src/lib/content/agents.ts`; no component changes are needed. See [docs/agent-catalog.md](docs/agent-catalog.md) for state promotion requirements, surface distinctions and asset handling.
- Landing snippets receive translated comments from `code.comments`; they are illustrative excerpts, not complete payloads or a public SDK API.
- CTAs currently explore the flow, capabilities, simulation and docs. A public contact channel/backend is needed before enabling pilot requests.
- The architecture dictionaries (`docs.en.ts`, `docs.es.ts`) follow the new direction: architecture, business integration, MCP and assistants, permissions and payments. Their HTML is trusted repository content; never interpolate form data or any user-supplied value into it.
- The build-status roadmap has one entry per capability in `src/lib/content/roadmap.ts` (stage and maintainer) and its copy under `roadmap.items` in both dictionaries (`ROADMAP_IDS` keeps them aligned). Move an item to another stage only with evidence in its stated environment, and never add dates. The x402 / Relayer wording must stay consistent with [tilcai-core's payment rail documentation](https://github.com/TilcAI/tilcai-core/blob/main/docs/payment-rail-environment.md).
- Financial-state wording (allowed ≠ approved ≠ sent ≠ settled ≠ delivered) was reviewed in [docs/qa-financial-states.md](docs/qa-financial-states.md); repeat that review when copy about decisions, payments or delivery changes.
- Only change wording to "live" or "deployed" when there is something verifiable (contract ID, testnet transaction, public repository).
- Absolute Open Graph URLs use `NEXT_PUBLIC_SITE_URL` if it is set to a valid URL (e.g. `https://tilcai.xyz`). On Vercel it is optional: if it is missing or empty, the production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically. Locally, copy `.env.example` to `.env.local`.

## Styling

The design uses semantic CSS classes in `globals.css` (unlayered, so they take precedence over Tailwind's base layer).
Tailwind CSS v4 stays available for new components; brand tokens are exposed as utilities (`bg-surface`, `text-teal`, `text-amber`, `font-mono`…).
Fonts are Geist and Geist Mono via `next/font`, as in the default scaffold.

`landing.css` composes the compact hero, holographic scenes and technical disclosures;
`agents.css` styles the carousel and right-side modal. General sections use 36px
vertical padding on mobile and 48px on desktop. Technical detail is available on
demand through native disclosures, retaining the public section anchors.
Motion uses CSS perspective and event-driven updates; no animation dependency was added.
See [the visual structure and verification record](docs/visual-structure.md) for
asset replacement, team extension points and suggested commits.

## Accessibility

Skip link, visible focus, keyboard-operable menu (Esc closes) and code tabs (arrow keys, Home, End), `prefers-reduced-motion` support, readable without JavaScript, text contrast ≥ 4.5:1, `lang` and `hreflang` per language.

## WEB-01 validation

The production build and TypeScript check pass. Dictionary parity, eight FAQ answers per language (40–80 words), desktop/mobile copy, FAQ keyboard operation and the mobile menu after language switching were checked locally. See [the verification record](docs/messaging-map.md#verificación-local--2026-09-30) for scope and pending team review.

Lint remains blocked before source analysis: the installed `typescript-eslint` rejects TypeScript 7.0.2. Resolve the tooling compatibility in a dependency task; do not work around it by rebuilding this project from a scaffold. This content update preserves `package.json` and `pnpm-lock.yaml`.

## Deployment

The team publishes the landing at `https://tilcai.vercel.app/en`. This is a website deployment, not a deployed TilcAI payment service. It also works on any Next.js host or as a Node server with `pnpm build && pnpm start`.
