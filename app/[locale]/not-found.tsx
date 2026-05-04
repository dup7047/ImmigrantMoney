import {ArrowRight, Sparkles} from "lucide-react";
import {useTranslations} from "next-intl";
import {Blob} from "@/components/Brand/Ornaments";
import {Button} from "@/components/ui/Button";
import {Link} from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="relative overflow-hidden">
      <Blob className="-right-24 top-0 h-[420px] w-[420px] opacity-60" />
      <div className="container-pad relative mx-auto grid max-w-3xl gap-6 py-20 md:py-28">
        <p className="text-overline font-semibold uppercase text-brand-700">{t("eyebrow")}</p>
        <h1 className="font-display text-display-2 tracking-tight text-ink-900 md:text-display-1">
          {t("title")}
        </h1>
        <p className="text-body-lg text-ink-600">{t("body")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link href="/start">
            <Button size="lg">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              {t("primaryCta")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
            href="/#tools"
          >
            {t("secondaryCta")}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
