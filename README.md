# ImmigrantMoney

Free, trilingual (English / Español / 中文) financial tools for immigrants in the United States. No account required, no data stored — every calculator runs in the browser.

> ⚠️ Educational only. ImmigrantMoney provides general information, not legal, tax, immigration, or financial advice. Always verify current rules with a licensed professional.

🌐 https://github.com/dup7047/ImmigrantMoney

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdup7047%2FImmigrantMoney)

---

## What's in the box

Eight calculators, organized into four categories with a guided onboarding flow that recommends a starting tool from a 3-question quiz.

| Category | Tools |
|---|---|
| **Earn & Protect Pay** | Wage Theft Checker · Scam Detector |
| **Bank & Build Credit** | Open a Bank Without SSN · Credit Builder Roadmap |
| **Send & Spend Smart** | Remittance Comparator · Affordability Planner |
| **Taxes & Immigration** | ITIN Tax Guide · USCIS Fee Planner |

### User flows

- **`/`** — Auto-detected locale redirect (`Accept-Language` → `/en`, `/es`, or `/zh`)
- **`/[locale]`** — Hero with guided journey teaser, "How it works" strip, categorized tool hub, FAQ
- **`/[locale]/start`** — 3-question intake wizard
- **`/[locale]/start/results?goal=…&status=…&priority=…`** — Deep-linkable, shareable recommendation
- **`/[locale]/categories/[slug]`** — Category landing pages
- **`/[locale]/tools/[slug]`** — The calculators themselves

---

## Tech stack

- **Next.js 15** (App Router) + React 19
- **TypeScript** (strict, no `any`)
- **Tailwind CSS** with a custom semantic palette (`brand`, `ink`, `positive`, `caution`, `critical`, `accent`)
- **next-intl** for routing, locale detection, and translation catalogs
- **react-hook-form** + **zod** (the Wizard primitive)
- **recharts** for the budget pie chart and credit timeline
- **Supabase** (optional, for opt-in email capture only)
- **next/og** (Satori) for dynamic OG images and favicons

---

## Internationalization

- Full UI translations in [`messages/en.json`](messages/en.json), [`messages/es.json`](messages/es.json), [`messages/zh.json`](messages/zh.json) (≈ 268 keys each, kept in parity)
- Tool metadata (titles, descriptions, CTAs, evidence statements) translated per locale in [`data/tools-metadata.ts`](data/tools-metadata.ts)
- Brand-tinted Chinese fallback fonts (PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC) layered into the Tailwind font stack
- Auto-detection on first visit reads `Accept-Language`; subsequent visits respect the user's explicit choice via the `NEXT_LOCALE` cookie set by the language switcher
- Bilingual hreflang with `x-default` and self-referential canonicals on every page

To add a fourth locale: add it to `i18n/routing.ts`, add the matcher pattern in `middleware.ts`, drop a new `messages/<code>.json`, and translate the `LocalizedText` fields in the data files.

---

## SEO

- Self-referential canonicals per locale + full hreflang set with `x-default`
- Structured data: `Organization` (root), `FAQPage` (home), `WebApplication` (per tool)
- Dynamic OG images (1200×630) generated per locale at `/{locale}/opengraph-image`
- Twitter cards on every page (`summary_large_image`)
- Favicon stack: SVG (modern), PNG fallback, 180×180 Apple touch icon, Safari pinned-tab mask icon, `theme-color`
- Sitemap covers home + 3 locales × 4 categories × 8 tools + start + legal pages
- All `seoTitle` strings ≤ 60 characters across all locales

---

## Getting started

```bash
# Node ≥ 20 required (Next.js 15)
nvm use   # honors .nvmrc

npm install
cp .env.example .env.local   # optional; only needed for Supabase email capture
npm run dev                  # http://localhost:3000
```

### Verification before shipping

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
npm run build       # full production build
```

If your local macOS Node is older than Next.js 15 requires, use the bundled Codex Node runtime:

```bash
/Users/$USER/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/next/dist/bin/next build
```

(See [`AGENTS.md`](AGENTS.md) for more.)

---

## Environment variables

All optional — the app runs entirely client-side without any of them. Configure in `.env.local`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for sitemaps, OG, hreflang). Defaults to `https://immigrantmoney.example`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — only needed if email capture is wired up. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) for the `/api/leads` route. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | If set, Plausible analytics is loaded in the locale layout. |

---

## Project structure

```
app/
  [locale]/            Locale-prefixed routes (page, layout, start, categories, tools, legal)
    opengraph-image.tsx  Per-locale dynamic OG image
  api/leads/           Supabase email capture endpoint
  icon.svg             Primary favicon
  icon0.tsx            PNG fallback favicon (next/og)
  apple-icon.tsx       180×180 Apple touch icon
  layout.tsx           Root: fonts, metadata, theme-color, icon stack
components/
  Brand/               Logo, ornaments
  journey/             Intake, ChoiceCard, JourneyTeaser, Results
  tools/               ToolRenderer + per-tool calculation UI
  ui/                  Button, Field, Panel primitives
  wizard/              Reusable multi-step Wizard primitive (RHF + zod)
data/                  Source-backed datasets (tools, banks, USCIS fees, …)
i18n/                  next-intl routing + navigation
lib/
  calculations/        Pure typed calculator logic
  journey/recommend.ts Pure recommendation engine
  seo.ts               Metadata + canonical/hreflang helpers
messages/              en.json · es.json · zh.json (UI translations)
public/                Static assets (Safari pinned-tab SVG, etc.)
```

---

## Privacy

- **Tool inputs never leave your browser.** All calculations are pure client-side.
- **No accounts.** No login, no profile.
- **Email is opt-in only.** If a user submits the optional roadmap email, only `email`, `locale`, `source_tool`, and submission time are stored — nothing about their financial inputs.
- **No third-party tracking by default.** Plausible analytics loads only if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is configured.

---

## Contributing

PRs welcome. Two house rules from [`AGENTS.md`](AGENTS.md):

1. **Both languages, every time.** Any visible string change must update both `messages/en.json`, `messages/es.json`, and `messages/zh.json`. Don't ship one without the others.
2. **Source the source.** Legal, tax, wage, fee, banking, and remittance data must include source metadata and a visible last-reviewed date.

Affiliate links use `rel="nofollow sponsored"` and `target="_blank"`. Avoid `any`. Run typecheck + lint + build before shipping.

---

## License

Educational and informational use. Datasets and source notes credit their origins (CFPB, FTC, USCIS, KFF, World Bank, IRS, DOL, NLRB).
