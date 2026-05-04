import {useTranslations} from "next-intl";
import type {AdSlotKind} from "@/lib/types";
import {cn} from "@/lib/utils";

const slotDimensions: Record<AdSlotKind, string> = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  sidebar: "h-[250px] w-[300px]",
  mobile: "h-[50px] w-[300px]"
};

export function AdSlot({kind, className}: {kind: AdSlotKind; className?: string}) {
  const t = useTranslations("toolLayout");
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!enabled || !client) {
    return (
      <div
        aria-label={t("adPlaceholder")}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400",
          slotDimensions[kind],
          className
        )}
      >
        {t("adPlaceholder")}
      </div>
    );
  }

  return (
    <ins
      className={cn("adsbygoogle block", slotDimensions[kind], className)}
      data-ad-client={client}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
