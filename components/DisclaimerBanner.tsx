import {Info} from "lucide-react";
import {useTranslations} from "next-intl";

export function DisclaimerBanner() {
  const t = useTranslations("common");

  return (
    <div className="flex gap-3 rounded-xl border border-caution-200 bg-caution-50 p-4 text-sm text-caution-950">
      <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <p>{t("notAdvice")}</p>
    </div>
  );
}
