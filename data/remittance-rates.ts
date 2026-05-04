import {sourceNotes} from "./source-notes";

export type RemittanceCountry =
  | "Mexico"
  | "Guatemala"
  | "El Salvador"
  | "Honduras"
  | "Dominican Republic"
  | "Haiti"
  | "Jamaica"
  | "Colombia"
  | "Ecuador"
  | "Peru"
  | "Nicaragua"
  | "Venezuela"
  | "Philippines"
  | "India"
  | "Bangladesh"
  | "China"
  | "Nigeria"
  | "Ghana"
  | "Senegal"
  | "Morocco";

export type DeliveryMethod = "bank" | "wallet" | "cash" | "any";

export type RemittanceRate = {
  service: string;
  countries: RemittanceCountry[];
  methods: DeliveryMethod[];
  flatFee: number;
  percentFee: number;
  exchangeMarkup: number;
  speed: string;
  note: {
    en: string;
    es: string;
    zh: string;
  };
  affiliateId?: string;
};

export const remittanceSource = sourceNotes.worldBankRemittance;

export const countryExchangeRates: Record<RemittanceCountry, number> = {
  Mexico: 17,
  Guatemala: 7.8,
  "El Salvador": 1,
  Honduras: 24.7,
  "Dominican Republic": 59,
  Haiti: 132,
  Jamaica: 155,
  Colombia: 3900,
  Ecuador: 1,
  Peru: 3.7,
  Nicaragua: 36.6,
  Venezuela: 36,
  Philippines: 56,
  India: 83,
  Bangladesh: 110,
  China: 7.2,
  Nigeria: 1450,
  Ghana: 14,
  Senegal: 610,
  Morocco: 10
};

export const remittanceCountries = Object.keys(countryExchangeRates) as RemittanceCountry[];

export const remittanceRates: RemittanceRate[] = [
  {
    service: "Wise",
    countries: remittanceCountries,
    methods: ["bank", "wallet", "any"],
    flatFee: 1.99,
    percentFee: 0.008,
    exchangeMarkup: 0.004,
    speed: "Same day to 2 days",
    note: {en: "Often strong exchange rates for bank transfers.", es: "Suele tener buen tipo de cambio para transferencias bancarias.", zh: "银行转账的汇率通常较优。"},
    affiliateId: "wise"
  },
  {
    service: "Remitly",
    countries: remittanceCountries,
    methods: ["bank", "wallet", "cash", "any"],
    flatFee: 3.99,
    percentFee: 0.004,
    exchangeMarkup: 0.012,
    speed: "Minutes to 3 days",
    note: {en: "Promotional pricing may be temporary.", es: "Precios promocionales pueden ser temporales.", zh: "优惠价格可能只是临时性的。"},
    affiliateId: "remitly"
  },
  {
    service: "Western Union",
    countries: remittanceCountries,
    methods: ["bank", "cash", "wallet", "any"],
    flatFee: 5.99,
    percentFee: 0.01,
    exchangeMarkup: 0.025,
    speed: "Minutes to 4 days",
    note: {en: "Large cash pickup network.", es: "Red amplia para recoger efectivo.", zh: "现金提取网点覆盖广泛。"}
  },
  {
    service: "MoneyGram",
    countries: remittanceCountries,
    methods: ["bank", "cash", "wallet", "any"],
    flatFee: 4.99,
    percentFee: 0.012,
    exchangeMarkup: 0.02,
    speed: "Minutes to 3 days",
    note: {en: "Cash pickup can cost more than bank deposit.", es: "Recoger efectivo puede costar más que depósito bancario.", zh: "现金提取通常比银行存款更贵。"}
  },
  {
    service: "PayPal/Xoom",
    countries: remittanceCountries,
    methods: ["bank", "cash", "wallet", "any"],
    flatFee: 4.99,
    percentFee: 0.01,
    exchangeMarkup: 0.03,
    speed: "Minutes to 2 days",
    note: {en: "Convenient if sender already uses PayPal.", es: "Conveniente si ya usas PayPal.", zh: "如果你本来就用 PayPal，会比较方便。"}
  },
  {
    service: "Majority",
    countries: ["Mexico", "Guatemala", "El Salvador", "Honduras", "Dominican Republic", "Colombia", "Ecuador", "Peru", "Nigeria", "Ghana"],
    methods: ["bank", "cash", "wallet", "any"],
    flatFee: 2.99,
    percentFee: 0.006,
    exchangeMarkup: 0.018,
    speed: "Minutes to 2 days",
    note: {en: "Immigrant-focused app with banking bundle.", es: "App para inmigrantes con cuenta incluida.", zh: "面向移民的应用，自带银行账户功能。"},
    affiliateId: "majority"
  },
  {
    service: "RIA",
    countries: remittanceCountries,
    methods: ["bank", "cash", "wallet", "any"],
    flatFee: 3.99,
    percentFee: 0.009,
    exchangeMarkup: 0.018,
    speed: "Minutes to 4 days",
    note: {en: "Good cash pickup footprint in many corridors.", es: "Buena red para efectivo en muchos corredores.", zh: "在许多汇款走廊都有不错的现金提取网络。"}
  },
  {
    service: "Sendwave",
    countries: ["Nigeria", "Ghana", "Senegal", "Morocco", "Bangladesh", "Haiti"],
    methods: ["wallet", "bank", "any"],
    flatFee: 0,
    percentFee: 0.004,
    exchangeMarkup: 0.015,
    speed: "Minutes to same day",
    note: {en: "Often competitive for African corridors.", es: "Suele competir bien para corredores africanos.", zh: "在非洲方向的汇款上通常具有竞争力。"}
  }
];
