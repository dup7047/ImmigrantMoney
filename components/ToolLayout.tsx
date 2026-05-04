import type {ReactNode} from "react";
import type {Locale, ToolMetadata} from "@/lib/types";
import {Link} from "@/i18n/navigation";
import {AdSlot} from "./AdSlot";
import {DisclaimerBanner} from "./DisclaimerBanner";
import {EmailCapture} from "./EmailCapture";
import {SourceList} from "./SourceList";
import {AffiliateLinks} from "./AffiliateLinks";

export function ToolLayout({
  tool,
  locale,
  children,
  labels
}: {
  tool: ToolMetadata;
  locale: Locale;
  children: ReactNode;
  labels: {
    home: string;
    related: string;
    sources: string;
    lastReviewed: string;
    sourceIntro: string;
  };
}) {
  return (
    <main className="container-pad mx-auto grid max-w-7xl gap-6 py-10">
      <nav aria-label="Breadcrumb" className="text-caption font-semibold text-ink-500">
        <Link className="transition hover:text-brand-700" href="/">
          {labels.home}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-900">{tool.title[locale]}</span>
      </nav>

      <section className="grid gap-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-display-2 tracking-tight text-ink-900 md:text-display-1">
            {tool.title[locale]}
          </h1>
          <p className="mt-4 text-body-lg text-ink-600">{tool.evidence[locale]}</p>
        </div>
        <DisclaimerBanner />
        <AdSlot className="mx-auto" kind="leaderboard" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-8">
          {children}
          <AffiliateLinks locale={locale} toolSlug={tool.slug} />
          <EmailCapture sourceTool={tool.slug} />
          <SourceList labels={{sources: labels.sources, lastReviewed: labels.lastReviewed}} locale={locale} sources={tool.sourceNotes} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-6">
            <AdSlot kind="sidebar" />
            <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
              <h2 className="text-heading-3 text-ink-900">{labels.related}</h2>
              <div className="mt-3 grid gap-2">
                {tool.related.map((slug) => (
                  <Link
                    className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                    href={`/tools/${slug}`}
                    key={slug}
                  >
                    {slug
                      .split("-")
                      .map((part) => part[0]?.toUpperCase() + part.slice(1))
                      .join(" ")}
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-caption leading-5 text-ink-500">{labels.sourceIntro}</p>
            </section>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center border-t border-ink-200 bg-white/95 py-2 shadow-lg lg:hidden">
        <AdSlot kind="mobile" />
      </div>
    </main>
  );
}
