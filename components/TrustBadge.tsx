import {LockKeyhole} from "lucide-react";
import {useTranslations} from "next-intl";

export function TrustBadge() {
  const t = useTranslations("common");

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-positive-200 bg-positive-50 px-3 py-1 text-caption font-semibold text-positive-800">
      <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
      {t("trustBadge")}
    </span>
  );
}
