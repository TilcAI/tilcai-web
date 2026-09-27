# TilcAI — web (Next.js)

Landing page and **proposed architecture** page for TilcAI, an early-stage project in development.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**, following the `create-next-app --yes` defaults.
English is the default language; Spanish is available through the EN / ES selector.

> Everything on this site describes plans. There is no deployed contract, no published package and no live service.

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
│   ├── DocsPage.tsx              # architecture page (server component)
│   ├── CodeTabs.tsx              # client: accessible tabs for the proposed JSON
│   ├── DocsToc.tsx               # client: table of contents with scroll-spy
│   ├── RevealObserver.tsx        # client: subtle reveal-on-scroll
│   └── Icon.tsx
└── lib/
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
- Stage labels (`Stellar Elite · in development`, `HackMeridian · planned`, `Vision · not scheduled`) are defined once in `stageLabels`.
- Only change wording to "live" or "deployed" when there is something verifiable (contract ID, testnet transaction, public repository).
- For correct absolute Open Graph URLs in production, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.

## Styling

The design uses semantic CSS classes in `globals.css` (unlayered, so they take precedence over Tailwind's base layer).
Tailwind CSS v4 stays available for new components; brand tokens are exposed as utilities (`bg-surface`, `text-teal`, `text-amber`, `font-mono`…).
Fonts are Geist and Geist Mono via `next/font`, as in the default scaffold.

## Accessibility

Skip link, visible focus, keyboard-operable menu (Esc closes) and code tabs (arrow keys, Home, End), `prefers-reduced-motion` support, readable without JavaScript, text contrast ≥ 4.5:1, `lang` and `hreflang` per language.

## Deployment

Not deployed. It works on any Next.js host (e.g. Vercel) or as a Node server with `pnpm build && pnpm start`.
