import {ExternalLink} from "lucide-react";
import type {Locale, ToolSlug} from "@/lib/types";
import {getAffiliateLinksForTool} from "@/data/affiliate-links";
import {AffiliateDisclosure} from "./AffiliateDisclosure";

export function AffiliateLinks({toolSlug, locale}: {toolSlug: ToolSlug; locale: Locale}) {
  const links = getAffiliateLinksForTool(toolSlug);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <AffiliateDisclosure />
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <a
            className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-cardHover"
            href={link.href}
            key={link.id}
            rel="nofollow sponsored"
            target="_blank"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-heading-3 text-ink-900">{link.label[locale]}</h3>
              <ExternalLink aria-hidden="true" className="h-4 w-4 text-ink-400 transition group-hover:text-brand-600" />
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-600">{link.description[locale]}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
