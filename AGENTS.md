# ImmigrantMoney Architecture

ImmigrantMoney is a bilingual Next.js 15 App Router app. Locale routes live under `app/[locale]` and are powered by `next-intl`.

## Core Rules

- Tool inputs and calculations stay client-side.
- Supabase is only used for optional email capture after explicit consent.
- Legal, tax, wage, fee, banking, and remittance data must include source metadata and visible last-reviewed dates.
- Spanish is a first-class locale. Add every visible string to both `messages/en.json` and `messages/es.json`.
- Affiliate links must use `rel="nofollow sponsored"` and `target="_blank"`.
- Avoid `any` types.

## Main Areas

- `components/`: shared layout, monetization, and tool UI.
- `components/tools/`: interactive calculators and wizards.
- `data/`: source-backed static datasets.
- `lib/calculations/`: pure typed calculator logic.
- `messages/`: English and Spanish translations.

## Verification

Run `npm run typecheck`, `npm run lint`, and `npm run build` before shipping.

The local macOS Node in this workspace may be older than Next.js 15 requires. If so, run checks with the bundled Codex Node runtime:

```sh
/Users/dantino/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/next/dist/bin/next build
```
