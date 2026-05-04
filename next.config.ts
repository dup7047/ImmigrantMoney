import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Force every request to receive complete <head> metadata before <body>
  // streams. Default Next 15 streams async generateMetadata into the body
  // for non-bot UAs, which causes Lighthouse + some legacy crawlers to miss
  // <title>, <meta description>, hreflang, og:* etc. The perf cost on this
  // site is minimal (pages render quickly) and the SEO / social-share win
  // is real (Lighthouse SEO score 82 → 100).
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"]
  }
};

export default withNextIntl(nextConfig);
