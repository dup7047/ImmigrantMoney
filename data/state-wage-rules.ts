import {sourceNotes} from "./source-notes";

export type StateWageRule = {
  stateCode: string;
  minimumWage: number;
  tippedMinimumWage: number;
  overtimeThreshold: number;
  payStubNote?: {
    en: string;
    es: string;
    zh: string;
  };
};

const federalMinimum = 7.25;

export const stateWageRules: StateWageRule[] = [
  {stateCode: "AL", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "AK", minimumWage: 11.73, tippedMinimumWage: 11.73, overtimeThreshold: 40},
  {stateCode: "AZ", minimumWage: 14.35, tippedMinimumWage: 11.35, overtimeThreshold: 40},
  {stateCode: "AR", minimumWage: 11, tippedMinimumWage: 2.63, overtimeThreshold: 40},
  {stateCode: "CA", minimumWage: 16, tippedMinimumWage: 16, overtimeThreshold: 40},
  {stateCode: "CO", minimumWage: 14.42, tippedMinimumWage: 11.4, overtimeThreshold: 40},
  {stateCode: "CT", minimumWage: 15.69, tippedMinimumWage: 6.38, overtimeThreshold: 40},
  {stateCode: "DE", minimumWage: 13.25, tippedMinimumWage: 2.23, overtimeThreshold: 40},
  {stateCode: "DC", minimumWage: 17.5, tippedMinimumWage: 10, overtimeThreshold: 40},
  {stateCode: "FL", minimumWage: 12, tippedMinimumWage: 8.98, overtimeThreshold: 40},
  {stateCode: "GA", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "HI", minimumWage: 14, tippedMinimumWage: 12.75, overtimeThreshold: 40},
  {stateCode: "ID", minimumWage: 7.25, tippedMinimumWage: 3.35, overtimeThreshold: 40},
  {stateCode: "IL", minimumWage: 14, tippedMinimumWage: 8.4, overtimeThreshold: 40},
  {stateCode: "IN", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "IA", minimumWage: 7.25, tippedMinimumWage: 4.35, overtimeThreshold: 40},
  {stateCode: "KS", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "KY", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "LA", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "ME", minimumWage: 14.15, tippedMinimumWage: 7.08, overtimeThreshold: 40},
  {stateCode: "MD", minimumWage: 15, tippedMinimumWage: 3.63, overtimeThreshold: 40},
  {stateCode: "MA", minimumWage: 15, tippedMinimumWage: 6.75, overtimeThreshold: 40},
  {stateCode: "MI", minimumWage: 10.33, tippedMinimumWage: 3.93, overtimeThreshold: 40},
  {stateCode: "MN", minimumWage: 10.85, tippedMinimumWage: 10.85, overtimeThreshold: 40},
  {stateCode: "MS", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "MO", minimumWage: 12.3, tippedMinimumWage: 6.15, overtimeThreshold: 40},
  {stateCode: "MT", minimumWage: 10.3, tippedMinimumWage: 10.3, overtimeThreshold: 40},
  {stateCode: "NE", minimumWage: 12, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "NV", minimumWage: 12, tippedMinimumWage: 12, overtimeThreshold: 40},
  {stateCode: "NH", minimumWage: 7.25, tippedMinimumWage: 3.27, overtimeThreshold: 40},
  {stateCode: "NJ", minimumWage: 15.13, tippedMinimumWage: 5.26, overtimeThreshold: 40},
  {stateCode: "NM", minimumWage: 12, tippedMinimumWage: 3, overtimeThreshold: 40},
  {stateCode: "NY", minimumWage: 15, tippedMinimumWage: 10, overtimeThreshold: 40},
  {stateCode: "NC", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "ND", minimumWage: 7.25, tippedMinimumWage: 4.86, overtimeThreshold: 40},
  {
    stateCode: "OH",
    minimumWage: 10.45,
    tippedMinimumWage: 5.25,
    overtimeThreshold: 40,
    payStubNote: {
      en: "Ohio's Pay Stub Protection Act requires covered employers to provide pay statements and a process to request them within 10 days.",
      es: "La Ley de Protección de Talones de Pago de Ohio exige a empleadores cubiertos entregar estados de pago y un proceso para solicitarlos dentro de 10 días.",
      zh: "俄亥俄州《工资单保护法》要求被涵盖的雇主提供工资单，并在 10 天内响应索取请求。"
    }
  },
  {stateCode: "OK", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "OR", minimumWage: 14.2, tippedMinimumWage: 14.2, overtimeThreshold: 40},
  {stateCode: "PA", minimumWage: 7.25, tippedMinimumWage: 2.83, overtimeThreshold: 40},
  {stateCode: "RI", minimumWage: 14, tippedMinimumWage: 3.89, overtimeThreshold: 40},
  {stateCode: "SC", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "SD", minimumWage: 11.2, tippedMinimumWage: 5.6, overtimeThreshold: 40},
  {stateCode: "TN", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "TX", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "UT", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "VT", minimumWage: 13.67, tippedMinimumWage: 6.84, overtimeThreshold: 40},
  {stateCode: "VA", minimumWage: 12, tippedMinimumWage: 2.13, overtimeThreshold: 40},
  {stateCode: "WA", minimumWage: 16.28, tippedMinimumWage: 16.28, overtimeThreshold: 40},
  {stateCode: "WV", minimumWage: 8.75, tippedMinimumWage: 2.62, overtimeThreshold: 40},
  {stateCode: "WI", minimumWage: 7.25, tippedMinimumWage: 2.33, overtimeThreshold: 40},
  {stateCode: "WY", minimumWage: 7.25, tippedMinimumWage: 2.13, overtimeThreshold: 40}
];

export const wageRuleSource = {
  ...sourceNotes.dolDeductions,
  sourceName: "Federal and state wage rules snapshot",
  sourceUrl: "https://www.dol.gov/agencies/whd/minimum-wage/state",
  publishedAt: "2026-01-01",
  lastReviewedAt: "2026-05-02"
};

export function getStateWageRule(stateCode: string) {
  return (
    stateWageRules.find((rule) => rule.stateCode === stateCode) ?? {
      stateCode,
      minimumWage: federalMinimum,
      tippedMinimumWage: 2.13,
      overtimeThreshold: 40
    }
  );
}
