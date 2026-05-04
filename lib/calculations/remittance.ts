import {countryExchangeRates, type DeliveryMethod, type RemittanceCountry, remittanceRates} from "@/data/remittance-rates";

export type Frequency = "once" | "weekly" | "monthly" | "biweekly";

export type RemittanceInput = {
  amount: number;
  country: RemittanceCountry;
  method: DeliveryMethod;
  frequency: Frequency;
};

export type RemittanceResult = {
  service: string;
  fee: number;
  exchangeMarkup: number;
  exchangeRate: number;
  amountReceived: number;
  totalCost: number;
  speed: string;
  note: {
    en: string;
    es: string;
    zh: string;
  };
  affiliateId?: string;
};

const frequencyMultiplier: Record<Frequency, number> = {
  once: 1,
  weekly: 52,
  monthly: 12,
  biweekly: 26
};

export function compareRemittances(input: RemittanceInput) {
  const marketRate = countryExchangeRates[input.country];
  const results = remittanceRates
    .filter((rate) => rate.countries.includes(input.country))
    .filter((rate) => input.method === "any" || rate.methods.includes(input.method) || rate.methods.includes("any"))
    .map<RemittanceResult>((rate) => {
      const fee = rate.flatFee + input.amount * rate.percentFee;
      const exchangeRate = marketRate * (1 - rate.exchangeMarkup);
      const amountReceived = Math.max(input.amount - fee, 0) * exchangeRate;
      return {
        service: rate.service,
        fee,
        exchangeMarkup: rate.exchangeMarkup,
        exchangeRate,
        amountReceived,
        totalCost: fee + input.amount * rate.exchangeMarkup,
        speed: rate.speed,
        note: rate.note,
        affiliateId: rate.affiliateId
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);

  const best = results[0];
  const worst = results[results.length - 1];
  const annualSavings = best && worst ? (worst.totalCost - best.totalCost) * frequencyMultiplier[input.frequency] : 0;

  return {results, best, worst, annualSavings};
}
