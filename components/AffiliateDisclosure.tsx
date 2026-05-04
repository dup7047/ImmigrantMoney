import {BadgeDollarSign} from "lucide-react";
import {useTranslations} from "next-intl";

export function AffiliateDisclosure() {
  const t = useTranslations("common");

  return (
    <div className="flex gap-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-brand-900">
      <BadgeDollarSign aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{t("affiliateDisclosure")}</p>
    </div>
  );
}
