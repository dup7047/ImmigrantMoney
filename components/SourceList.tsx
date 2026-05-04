import type {Locale, SourceNote} from "@/lib/types";

export function SourceList({
  sources,
  locale,
  labels
}: {
  sources: SourceNote[];
  locale: Locale;
  labels: {
    sources: string;
    lastReviewed: string;
  };
}) {
  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
      <h2 className="text-heading-3 text-ink-900">{labels.sources}</h2>
      <ul className="mt-3 grid gap-3 text-sm text-ink-600">
        {sources.map((source) => (
          <li key={source.sourceUrl}>
            <a
              className="font-semibold text-brand-600 transition hover:text-brand-700"
              href={source.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              {source.sourceName}
            </a>
            <span className="ml-2 text-ink-500">
              {labels.lastReviewed}: {new Date(source.lastReviewedAt).toLocaleDateString(locale)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
