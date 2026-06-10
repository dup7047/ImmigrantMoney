# ImmigrantMoney Architecture

ImmigrantMoney is a trilingual (English / Español / 中文) Next.js 15 App Router app. Locale routes live under `app/[locale]` and are powered by `next-intl`.

## Core Rules

- Tool inputs and calculations stay client-side.
- Supabase is only used for optional email capture after explicit consent.
- Legal, tax, wage, fee, banking, and remittance data must include source metadata and visible last-reviewed dates.
- Every locale is first-class. Add every visible string to `messages/en.json`, `messages/es.json`, and `messages/zh.json` — `npm run check:i18n` fails the build if catalogs drift.
- Affiliate links must use `rel="nofollow sponsored"` and `target="_blank"`.
- Avoid `any` types.

## Main Areas

- `components/`: shared layout, monetization, and tool UI.
- `components/tools/`: interactive calculators and wizards.
- `data/`: source-backed static datasets.
- `lib/calculations/`: pure typed calculator logic.
- `messages/`: English, Spanish, and Chinese translation catalogs.
- `scripts/`: dev-only checks (i18n parity).

## Verification

Run before shipping (requires Node ≥ 20, see `.nvmrc`):

```sh
npm run typecheck
npm run lint
npm run check:i18n
npm run build
```
