import {defineRouting} from "next-intl/routing";

export const locales = ["en", "es", "zh"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  // Auto-detect the visitor's language on their first hit to "/" by reading
  // the Accept-Language header (which mirrors the OS / browser language
  // setting). Best-supported match wins:
  //   es-ES, es-MX, es-…  → /es
  //   zh-CN, zh-TW, zh-HK → /zh
  //   anything else        → /en (defaultLocale)
  // After the first redirect, next-intl writes a NEXT_LOCALE cookie so
  // subsequent visits skip detection. The LanguageSwitcher updates that
  // cookie when the user picks a language manually, so an explicit choice
  // always overrides the OS default.
  localeDetection: true
});
