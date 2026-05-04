import {Heart} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {Logo} from "./Brand/Logo";
import {LanguageSwitcher} from "./LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-12 border-t border-ink-200 bg-white">
      <div className="container-pad mx-auto grid max-w-7xl gap-6 py-10 text-sm text-ink-600 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="grid gap-3">
          <Logo size={28} />
          <p className="max-w-xl text-sm leading-6">{t("footer.disclaimer")}</p>
          <p className="inline-flex items-center gap-2 font-semibold text-ink-800">
            <Heart aria-hidden="true" className="h-4 w-4 text-critical-600" />
            {t("footer.built")}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
          <Link className="font-semibold transition hover:text-brand-700" href="/privacy-policy">
            {t("nav.privacy")}
          </Link>
          <Link className="font-semibold transition hover:text-brand-700" href="/terms-of-service">
            {t("nav.terms")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
