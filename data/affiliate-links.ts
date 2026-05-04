import type {AffiliateLink} from "@/lib/types";

export const affiliateLinks: AffiliateLink[] = [
  {
    id: "nova-credit",
    label: {en: "Nova Credit", es: "Nova Credit", zh: "Nova Credit"},
    description: {
      en: "May help eligible newcomers use foreign credit history.",
      es: "Puede ayudar a recién llegados elegibles a usar historial extranjero.",
      zh: "可能帮助符合条件的新移民使用国外的信用记录。"
    },
    href: "https://www.novacredit.com/",
    priority: 1,
    tools: ["credit-builder-roadmap"]
  },
  {
    id: "majority",
    label: {en: "Majority", es: "Majority", zh: "Majority"},
    description: {
      en: "Immigrant-focused banking and remittance app.",
      es: "App de banca y remesas enfocada en inmigrantes.",
      zh: "面向移民的银行与汇款应用。"
    },
    href: "https://www.majority.com/",
    priority: 2,
    tools: ["bank-without-ssn", "remittance-calculator"]
  },
  {
    id: "remitly",
    label: {en: "Remitly", es: "Remitly", zh: "Remitly"},
    description: {en: "Compare promotional remittance pricing.", es: "Compara precios promocionales de remesas.", zh: "比较优惠的汇款价格。"},
    href: "https://www.remitly.com/",
    priority: 3,
    tools: ["remittance-calculator"]
  },
  {
    id: "wise",
    label: {en: "Wise", es: "Wise", zh: "Wise"},
    description: {en: "Compare transparent transfer pricing.", es: "Compara precios transparentes de transferencias.", zh: "比较透明的转账价格。"},
    href: "https://wise.com/",
    priority: 4,
    tools: ["remittance-calculator"]
  },
  {
    id: "self",
    label: {en: "Self.inc", es: "Self.inc", zh: "Self.inc"},
    description: {en: "Credit-builder loan option.", es: "Opción de préstamo para construir crédito.", zh: "建立信用记录的贷款方案。"},
    href: "https://www.self.inc/",
    priority: 5,
    tools: ["credit-builder-roadmap"]
  },
  {
    id: "chime",
    label: {en: "Chime", es: "Chime", zh: "Chime"},
    description: {en: "Mobile banking and credit builder option.", es: "Opción móvil de banca y construcción de crédito.", zh: "移动银行与信用建立工具的方案。"},
    href: "https://www.chime.com/",
    priority: 6,
    tools: ["bank-without-ssn", "credit-builder-roadmap"]
  }
];

export function getAffiliateLinksForTool(toolSlug: string) {
  return affiliateLinks
    .filter((link) => link.tools.includes(toolSlug as AffiliateLink["tools"][number]))
    .sort((a, b) => a.priority - b.priority);
}
