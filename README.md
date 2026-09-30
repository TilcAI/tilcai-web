# TilcAI — web (Next.js)

Landing page and **proposed architecture** page for TilcAI, an early-stage project in development.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, following the `create-next-app --yes` defaults.
English is the default language; Spanish is available through the EN / ES selector.

> The policy demo is a visual simulation only. There is no deployed contract, published package, live payment service or transfer of funds.

## Run it

Requirements: Node.js 20.9+ (22 LTS recommended) and pnpm.

```bash
cd tilcai-web
pnpm install      # first time only — resolves the latest Next.js and writes pnpm-lock.yaml
pnpm dev          # http://localhost:3000  (redirects to /en)
```

Production build:

```bash
pnpm build
pnpm start
```

> `package.json` uses `"latest"` for Next.js, React and tooling, like `pnpm create next-app@latest` would install today.
> After the first `pnpm install`, commit `pnpm-lock.yaml` so the whole team uses the same versions.

### Alternative: start from a fresh scaffold

If the first install or build complains about a config file (for example ESLint changes between Next.js versions):

```bash
pnpm create next-app@latest tilcai-web --yes   # choose "src/" directory if asked
```

Then copy these from this folder into the new project, replacing what exists: `src/`, `public/assets/`, `next.config.ts`, and the `"@/*": ["./src/*"]` path in `tsconfig.json`.

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
│   ├── HomePage.tsx              # landing = composition of the sections below (server component)
│   ├── sections/                 # one file per landing section
│   │   ├── HeroSection.tsx       # the only <h1>: eyebrow, headline, CTAs, stage facts
│   │   ├── HeroScene.tsx         # illustrative 3-node scene (server component, CSS-only motion)
│   │   ├── ProductOverview.tsx   # "What TilcAI is": your agent / TilcAI / the business
│   │   ├── ProblemSection, FlowSection, DemoSection, CapabilitiesSection, InterfaceSection,
│   │   │   CompareSection, StackSection, RoadmapSection, CtaSection   # earlier content, unchanged
│   │   └── shared.tsx            # SectionHead, StageTag
│   ├── DocsPage.tsx              # architecture page (server component)
│   ├── CodeTabs.tsx              # client: accessible tabs for the proposed JSON
│   ├── DocsToc.tsx               # client: table of contents with scroll-spy
│   ├── RevealObserver.tsx        # client: reveal-on-scroll; also starts the hero scene when it is visible
│   └── Icon.tsx
└── lib/
    ├── i18n/                     # all visible copy — en.ts, es.ts, docs.en.ts, docs.es.ts, types.ts
    ├── highlight.ts              # build-time syntax colouring for code blocks
    ├── snippets.ts               # conceptual JSON shown on the landing
    ├── metadata.ts               # per-page title, description, hreflang, Open Graph
    └── site.ts                   # routes and site URL
public/assets/                    # original TilcAI logo (resized), favicon, social image
```

## Hero and overview

- The hero scene (`sections/HeroScene.tsx`) is a **drawing**, labelled "Flujo ilustrativo" / "Illustrative flow". Its names and figures (cinema company, 10 USDC) are sample data, not a partner or a real quote. It is server-rendered, needs no client JavaScript and adds no dependency: the entrance sequence is CSS and is triggered by `RevealObserver` adding `is-visible`. Without JS or with `prefers-reduced-motion` it renders in its final state.
- On mobile the copy comes first and the compact scene below it; the scene is a vertical chain so it works from 360 px.
- "Enable my business" points to `#pilot` (the closing CTA) until the real contact channel exists (WEB-13). "Explore how it works" points to `#flow`.
- Copy lives in `hero`, `hero.scene` and `overview` in `src/lib/i18n/*.ts`.

## Editing content

- Change text in `src/lib/i18n/en.ts` and `es.ts`. `types.ts` forces both languages to carry the same keys, so a page never mixes languages.
- Architecture sections live in `docs.en.ts` / `docs.es.ts` as small HTML strings written in this repo (trusted content, rendered with `dangerouslySetInnerHTML`). Never put user input there.
- Stage labels (`Stellar Elite · in development`, `HackMeridian · planned`, `Vision · not scheduled`) are defined once in `stageLabels`.
- Only change wording to "live" or "deployed" when there is something verifiable (contract ID, testnet transaction, public repository).
- Absolute Open Graph URLs use `NEXT_PUBLIC_SITE_URL` if it is set to a valid URL (e.g. `https://tilcai.xyz`). On Vercel it is optional: if it is missing or empty, the production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically. Locally, copy `.env.example` to `.env.local`.

## Styling

The design uses semantic CSS classes in `globals.css` (unlayered, so they take precedence over Tailwind's base layer).
Tailwind CSS v4 stays available for new components; brand tokens are exposed as utilities (`bg-surface`, `text-teal`, `text-amber`, `font-mono`…).
Fonts are Geist and Geist Mono via `next/font`, as in the default scaffold.

## Accessibility

Skip link, visible focus, keyboard-operable menu (Esc closes) and code tabs (arrow keys, Home, End), `prefers-reduced-motion` support, readable without JavaScript, text contrast ≥ 4.5:1, `lang` and `hreflang` per language.

## Deployment

The team publishes the landing at `https://tilcai.vercel.app/en`. This is a website deployment, not a deployed TilcAI payment service. It also works on any Next.js host or as a Node server with `pnpm build && pnpm start`.
