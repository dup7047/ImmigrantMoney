import {jsonLdScript} from "@/lib/seo";

export function JsonLd({data}: {data: Record<string, unknown>}) {
  return <script dangerouslySetInnerHTML={jsonLdScript(data)} type="application/ld+json" />;
}
