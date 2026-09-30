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
| `/en/docs`, `/es/docs` | Proposed architecture |

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
│   ├── HomePage.tsx              # all landing sections (server component)
│   ├── FaqSection.tsx            # eight native disclosures from typed dictionaries
│   ├── AgentCatalog.tsx          # client: six main clients + expandable group
│   ├── AgentCard.tsx             # keyboard-operable card with asset fallback
│   ├── AgentGuidePanel.tsx       # client-specific preparation / validated guide
│   ├── PolicyDemo.tsx            # client: illustrative policy choices
│   ├── DocsPage.tsx              # architecture page (server component)
│   ├── CodeTabs.tsx              # client: accessible tabs for the proposed JSON
│   ├── DocsToc.tsx               # client: table of contents with scroll-spy
│   ├── RevealObserver.tsx        # client: subtle reveal-on-scroll
│   └── Icon.tsx
└── lib/
    ├── content/agents.ts         # typed catalog, surfaces and official references
    ├── i18n/                     # all visible copy — en.ts, es.ts, docs.en.ts, docs.es.ts, types.ts
    ├── highlight.ts              # build-time syntax colouring for code blocks
    ├── snippets.ts               # conceptual JSON shown on the landing
    ├── metadata.ts               # per-page title, description, hreflang, Open Graph
    └── site.ts                   # routes and site URL
public/assets/                    # original TilcAI logo (resized), favicon, social image
```

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
- The architecture dictionaries retain the earlier proposal pending Saul's WEB-11 migration.
- Only change wording to "live" or "deployed" when there is something verifiable (contract ID, testnet transaction, public repository).
- Absolute Open Graph URLs use `NEXT_PUBLIC_SITE_URL` if it is set to a valid URL (e.g. `https://tilcai.xyz`). On Vercel it is optional: if it is missing or empty, the production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically. Locally, copy `.env.example` to `.env.local`.

## Styling

The design uses semantic CSS classes in `globals.css` (unlayered, so they take precedence over Tailwind's base layer).
Tailwind CSS v4 stays available for new components; brand tokens are exposed as utilities (`bg-surface`, `text-teal`, `text-amber`, `font-mono`…).
Fonts are Geist and Geist Mono via `next/font`, as in the default scaffold.

## Accessibility

Skip link, visible focus, keyboard-operable menu (Esc closes) and code tabs (arrow keys, Home, End), `prefers-reduced-motion` support, readable without JavaScript, text contrast ≥ 4.5:1, `lang` and `hreflang` per language.

## WEB-01 validation

The production build and TypeScript check pass. Dictionary parity, eight FAQ answers per language (40–80 words), desktop/mobile copy, FAQ keyboard operation and the mobile menu after language switching were checked locally. See [the verification record](docs/messaging-map.md#verificación-local--2026-09-30) for scope and pending team review.

Lint remains blocked before source analysis: the installed `typescript-eslint` rejects TypeScript 7.0.2. Resolve the tooling compatibility in a dependency task; do not work around it by rebuilding this project from a scaffold. This content update preserves `package.json` and `pnpm-lock.yaml`.

## Deployment

The team publishes the landing at `https://tilcai.vercel.app/en`. This is a website deployment, not a deployed TilcAI payment service. It also works on any Next.js host or as a Node server with `pnpm build && pnpm start`.
