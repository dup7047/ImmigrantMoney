import type {SourceNote} from "@/lib/types";

export const sourceNotes = {
  wageTheftLegacy: {
    sourceName: "NELP, Broken Laws, Unprotected Workers",
    sourceUrl: "https://www.nelp.org/insights-research/broken-laws-unprotected-workers-violations-of-employment-and-labor-laws-in-americas-cities/",
    publishedAt: "2009-09-01",
    lastReviewedAt: "2026-05-02"
  },
  wageTheft2025: {
    sourceName: "Rutgers/Northwestern Workplace Justice Lab",
    sourceUrl: "https://smlr.rutgers.edu/news-events/smlr-news/labor-investigator-staffing-hits-52-year-low-raising-risk-wage-theft",
    publishedAt: "2025-05-29",
    lastReviewedAt: "2026-05-02"
  },
  dolDeductions: {
    sourceName: "U.S. Department of Labor Fact Sheet #16",
    sourceUrl: "https://www.dol.gov/agencies/whd/fact-sheets/16-flsa-wage-deductions",
    publishedAt: "2009-07-01",
    lastReviewedAt: "2026-05-02"
  },
  irsItin: {
    sourceName: "IRS ITIN guidance",
    sourceUrl: "https://www.irs.gov/individuals/individual-taxpayer-identification-number",
    publishedAt: "2025-10-01",
    lastReviewedAt: "2026-05-02"
  },
  irsCredits: {
    sourceName: "IRS EITC and Child Tax Credit guidance",
    sourceUrl: "https://www.eitc.irs.gov/credits-deductions/individuals/earned-income-tax-credit/who-qualifies-for-the-earned-income-tax-credit-eitc",
    publishedAt: "2026-02-01",
    lastReviewedAt: "2026-05-02"
  },
  irsTipsOvertime: {
    sourceName: "IRS tips and overtime deduction guidance",
    sourceUrl: "https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors",
    publishedAt: "2025-07-14",
    lastReviewedAt: "2026-05-02"
  },
  budgetLabTax: {
    sourceName: "The Budget Lab at Yale",
    sourceUrl: "https://budgetlab.yale.edu/research/potential-impact-irs-ice-data-sharing-tax-compliance",
    publishedAt: "2025-04-08",
    lastReviewedAt: "2026-05-02"
  },
  itepTaxes: {
    sourceName: "Institute on Taxation and Economic Policy",
    sourceUrl: "https://itep.org/undocumented-immigrants-taxes-2024/",
    publishedAt: "2024-07-30",
    lastReviewedAt: "2026-05-02"
  },
  uscisFees: {
    sourceName: "USCIS G-1055 Fee Schedule",
    sourceUrl: "https://www.uscis.gov/g-1055",
    publishedAt: "2025-07-17",
    lastReviewedAt: "2026-05-02"
  },
  ftcFraud: {
    sourceName: "Federal Trade Commission fraud testimony",
    sourceUrl: "https://www.ftc.gov/news-events/news/press-releases/2026/03/ftc-testifies-joint-economic-committee-agencys-efforts-combat-fraud",
    publishedAt: "2026-03-01",
    lastReviewedAt: "2026-05-02"
  },
  uscisScams: {
    sourceName: "USCIS common immigration scams",
    sourceUrl: "https://www.uscis.gov/scams-fraud-and-misconduct/avoid-scams/common-scams",
    publishedAt: "2024-02-09",
    lastReviewedAt: "2026-05-02"
  },
  cfpbBanking: {
    sourceName: "CFPB newcomer bank account guidance",
    sourceUrl: "https://www.consumerfinance.gov/es/obtener-respuestas/puedo-abrir-una-cuenta-corriente-sin-tener-numero-de-seguro-social-ni-licencia-de-conducir-es-929/",
    publishedAt: "2025-01-09",
    lastReviewedAt: "2026-05-02"
  },
  fdicBanked: {
    sourceName: "FDIC 2023 National Survey of Unbanked and Underbanked Households",
    sourceUrl: "https://www.fdic.gov/household-survey",
    publishedAt: "2024-11-12",
    lastReviewedAt: "2026-05-02"
  },
  cfpbCredit: {
    sourceName: "CFPB technical correction to credit invisibles estimate",
    sourceUrl: "https://www.consumerfinance.gov/data-research/research-reports/technical-correction-and-update-to-the-cfpbs-credit-invisibles-estimate/",
    publishedAt: "2025-06-23",
    lastReviewedAt: "2026-05-02"
  },
  worldBankRemittance: {
    sourceName: "World Bank Remittance Prices Worldwide",
    sourceUrl: "https://remittanceprices.worldbank.org/",
    publishedAt: "2025-08-18",
    lastReviewedAt: "2026-05-02"
  },
  cfpbRemittance: {
    sourceName: "CFPB remittance transfer guidance",
    sourceUrl: "https://www.consumerfinance.gov/compliance/circulars/consumer-financial-protection-circular-2024-02/",
    publishedAt: "2024-03-27",
    lastReviewedAt: "2026-05-02"
  },
  kffImmigrants: {
    sourceName: "KFF/LA Times Survey of Immigrants",
    sourceUrl: "https://www.kff.org/racial-equity-and-health-policy/poll-finding/kff-la-times-survey-of-immigrants",
    publishedAt: "2023-09-17",
    lastReviewedAt: "2026-05-02"
  }
} satisfies Record<string, SourceNote>;
