export type CreditProduct = {
  id: string;
  name: string;
  minBudget: number;
  maxBudget: number;
  acceptsItin: boolean;
  acceptsForeignCredit: boolean;
  bestFor: {
    en: string;
    es: string;
    zh: string;
  };
  affiliateId?: string;
};

export const creditProducts: CreditProduct[] = [
  {
    id: "self",
    name: "Self Credit Builder",
    minBudget: 25,
    maxBudget: 50,
    acceptsItin: true,
    acceptsForeignCredit: false,
    bestFor: {en: "Small monthly budget and no score yet", es: "Presupuesto mensual pequeño y sin puntaje", zh: "月预算较小且暂无信用分数"},
    affiliateId: "self"
  },
  {
    id: "kikoff",
    name: "Kikoff",
    minBudget: 5,
    maxBudget: 35,
    acceptsItin: true,
    acceptsForeignCredit: false,
    bestFor: {en: "Very low monthly budget", es: "Presupuesto mensual muy bajo", zh: "月预算非常有限"}
  },
  {
    id: "opensky",
    name: "OpenSky Secured Visa",
    minBudget: 50,
    maxBudget: 200,
    acceptsItin: true,
    acceptsForeignCredit: false,
    bestFor: {en: "Secured card without a traditional credit check", es: "Tarjeta garantizada sin revisión tradicional", zh: "无需传统信用审查的担保信用卡"}
  },
  {
    id: "chime-credit-builder",
    name: "Chime Credit Builder",
    minBudget: 50,
    maxBudget: 300,
    acceptsItin: true,
    acceptsForeignCredit: false,
    bestFor: {en: "Has or wants a Chime account", es: "Tiene o quiere una cuenta Chime", zh: "已有或想要 Chime 账户"},
    affiliateId: "chime"
  },
  {
    id: "nova",
    name: "Nova Credit",
    minBudget: 0,
    maxBudget: 300,
    acceptsItin: false,
    acceptsForeignCredit: true,
    bestFor: {en: "Has credit history in another country", es: "Tiene historial de crédito en otro país", zh: "在其他国家已有信用记录"},
    affiliateId: "nova-credit"
  },
  {
    id: "petal",
    name: "Petal Card",
    minBudget: 0,
    maxBudget: 300,
    acceptsItin: false,
    acceptsForeignCredit: false,
    bestFor: {en: "Has eligible banking history and work authorization", es: "Tiene historial bancario elegible y autorización de trabajo", zh: "已有合资格的银行记录与工作许可"}
  }
];
