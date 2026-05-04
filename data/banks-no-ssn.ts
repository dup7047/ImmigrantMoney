import {sourceNotes} from "./source-notes";

export type BankIdType = "passport" | "matricula" | "foreign-id" | "itin" | "state-id";
export type BankAccountType = "checking" | "savings" | "both";

export type BankOption = {
  id: string;
  name: string;
  acceptedIds: BankIdType[];
  accountTypes: BankAccountType[];
  monthlyFee: number;
  minBalance: number;
  internationalTransfers: boolean;
  spanishSupport: boolean;
  mobileRating: 1 | 2 | 3 | 4 | 5;
  features: {
    en: string[];
    es: string[];
    zh: string[];
  };
  sourceUrl: string;
  lastReviewedAt: string;
};

export const bankSource = sourceNotes.cfpbBanking;

export const bankOptions: BankOption[] = [
  {
    id: "chase",
    name: "Chase",
    acceptedIds: ["passport", "itin", "matricula", "state-id"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 12,
    minBalance: 1500,
    internationalTransfers: true,
    spanishSupport: true,
    mobileRating: 5,
    features: {en: ["Large branch network", "Spanish support in many markets"], es: ["Amplia red de sucursales", "Soporte en español en muchos mercados"], zh: ["分行网络庞大", "许多地区提供西班牙语服务"]},
    sourceUrl: "https://www.chase.com/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "bank-of-america",
    name: "Bank of America",
    acceptedIds: ["passport", "matricula", "itin", "state-id"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 12,
    minBalance: 1500,
    internationalTransfers: true,
    spanishSupport: true,
    mobileRating: 5,
    features: {en: ["Matrícula Consular accepted in some branches", "Strong Spanish-language site"], es: ["Matrícula Consular aceptada en algunas sucursales", "Sitio sólido en español"], zh: ["部分分行接受领事馆身份证（Matrícula Consular）", "西班牙语版网站做得很好"]},
    sourceUrl: "https://www.bankofamerica.com/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "wells-fargo",
    name: "Wells Fargo",
    acceptedIds: ["passport", "matricula", "itin", "state-id"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 10,
    minBalance: 500,
    internationalTransfers: true,
    spanishSupport: true,
    mobileRating: 4,
    features: {en: ["Broad branch footprint", "Spanish-language support"], es: ["Muchas sucursales", "Soporte en español"], zh: ["分行覆盖广泛", "提供西班牙语客服"]},
    sourceUrl: "https://www.wellsfargo.com/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "alliant",
    name: "Alliant Credit Union",
    acceptedIds: ["passport", "itin", "state-id"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 0,
    minBalance: 0,
    internationalTransfers: false,
    spanishSupport: false,
    mobileRating: 4,
    features: {en: ["Low fees", "Credit union option"], es: ["Tarifas bajas", "Opción de cooperativa de crédito"], zh: ["费用较低", "属于信用合作社", ]},
    sourceUrl: "https://www.alliantcreditunion.org/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "chime",
    name: "Chime",
    acceptedIds: ["passport", "itin", "state-id"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 0,
    minBalance: 0,
    internationalTransfers: false,
    spanishSupport: false,
    mobileRating: 5,
    features: {en: ["No monthly fee", "Mobile-first account"], es: ["Sin mensualidad", "Cuenta móvil"], zh: ["无月费", "以手机端为主的账户"]},
    sourceUrl: "https://www.chime.com/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "majority",
    name: "Majority",
    acceptedIds: ["passport", "foreign-id", "matricula", "itin"],
    accountTypes: ["checking"],
    monthlyFee: 5.99,
    minBalance: 0,
    internationalTransfers: true,
    spanishSupport: true,
    mobileRating: 4,
    features: {en: ["Built for immigrants", "International calling and transfers"], es: ["Diseñada para inmigrantes", "Llamadas y transferencias internacionales"], zh: ["专为移民设计", "支持国际通话和汇款"]},
    sourceUrl: "https://www.majority.com/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "latino-community-cu",
    name: "Latino Community Credit Union",
    acceptedIds: ["passport", "matricula", "foreign-id", "itin"],
    accountTypes: ["checking", "savings", "both"],
    monthlyFee: 0,
    minBalance: 10,
    internationalTransfers: true,
    spanishSupport: true,
    mobileRating: 4,
    features: {en: ["Immigrant-focused credit union", "Spanish-first service"], es: ["Cooperativa enfocada en inmigrantes", "Servicio en español"], zh: ["专注于服务移民的信用合作社", "以西班牙语为主的服务"]},
    sourceUrl: "https://latinoccu.org/",
    lastReviewedAt: "2026-05-02"
  },
  {
    id: "mission-asset-fund",
    name: "Mission Asset Fund",
    acceptedIds: ["passport", "matricula", "foreign-id", "itin"],
    accountTypes: ["savings"],
    monthlyFee: 0,
    minBalance: 0,
    internationalTransfers: false,
    spanishSupport: true,
    mobileRating: 3,
    features: {en: ["Lending Circles and credit-building programs", "Nonprofit model"], es: ["Tandas y programas para construir crédito", "Modelo sin fines de lucro"], zh: ["互助借贷圈与信用建立项目", "非营利组织模式"]},
    sourceUrl: "https://www.missionassetfund.org/",
    lastReviewedAt: "2026-05-02"
  }
];
