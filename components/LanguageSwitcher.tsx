"use client";

import {Languages} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/navigation";
import {locales} from "@/i18n/routing";
import type {Locale} from "@/lib/types";

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  zh: "中文"
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    // Read query at click time (no useSearchParams hook = no CSR opt-out).
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${pathname}${search}`, {locale: nextLocale});
  }

  return (
    <div
      aria-label={t("language")}
      className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-1 shadow-sm"
    >
      <Languages aria-hidden="true" className="ml-2 h-4 w-4 text-ink-500" />
      {locales.map((item) => (
        <button
          aria-pressed={locale === item}
          className={`rounded-md px-2 py-1 text-caption font-bold transition ${
            locale === item ? "bg-brand-600 text-white shadow-sm" : "text-ink-600 hover:bg-ink-100"
          }`}
          key={item}
          onClick={() => switchLocale(item)}
          type="button"
        >
          {LOCALE_LABEL[item]}
        </button>
      ))}
    </div>
  );
}
