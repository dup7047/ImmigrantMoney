import * as Icons from "lucide-react";
import {ArrowRight} from "lucide-react";
import type {ReactNode} from "react";
import {Link} from "@/i18n/navigation";
import {cn} from "@/lib/utils";

type IconName = keyof typeof Icons;

type ChoiceCardProps = {
  href: string;
  icon: string;
  title: string;
  subtitle?: string;
  tone?: "brand" | "positive" | "caution" | "accent";
  children?: ReactNode;
};

const TONE_CLASSES = {
  brand: {ring: "ring-brand-100", icon: "bg-brand-50 text-brand-700", glow: "from-brand-100/60", hoverBorder: "hover:border-brand-300"},
  positive: {ring: "ring-positive-200", icon: "bg-positive-50 text-positive-700", glow: "from-positive-100/60", hoverBorder: "hover:border-positive-200"},
  caution: {ring: "ring-caution-200", icon: "bg-caution-50 text-caution-700", glow: "from-caution-100/60", hoverBorder: "hover:border-caution-200"},
  accent: {ring: "ring-brand-100", icon: "bg-[#F3EAFF] text-accent-500", glow: "from-[#EADCFF]/70", hoverBorder: "hover:border-brand-200"}
} as const;

export function ChoiceCard({href, icon, title, subtitle, tone = "brand", children}: ChoiceCardProps) {
  const Icon = Icons[icon as IconName] as Icons.LucideIcon | undefined;
  const tones = TONE_CLASSES[tone];

  return (
    <Link
      className={cn(
        "group relative grid gap-4 overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover",
        tones.hoverBorder
      )}
      href={href}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -right-12 -top-16 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-0 transition group-hover:opacity-100",
          tones.glow
        )}
      />
      <div
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-xl ring-1",
          tones.icon,
          tones.ring
        )}
      >
        {Icon ? <Icon aria-hidden="true" className="h-6 w-6" /> : null}
      </div>
      <div className="relative">
        <h3 className="text-heading-3 text-ink-900">{title}</h3>
        {subtitle ? <p className="mt-1.5 text-sm leading-6 text-ink-600">{subtitle}</p> : null}
        {children}
      </div>
      <span className="relative mt-auto inline-flex items-center gap-1.5 text-caption font-bold uppercase tracking-wide text-brand-600 transition group-hover:gap-2.5">
        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
