import {uscisFees} from "@/data/uscis-fees";

export type UscisInput = {
  form: string;
  familyMembers: number;
  savings: number;
  monthlySavings: number;
  receivesPublicBenefit: boolean;
  lowIncome: boolean;
  financialHardship: boolean;
};

export type UscisResult = {
  form: string;
  totalCost: number;
  gap: number;
  monthsToSave: number | null;
  creditCardInterestExample: number;
  paydayLoanWarning: boolean;
  feeWaiverMaybe: boolean;
  notes: {
    en: string;
    es: string;
    zh: string;
  };
};

export function calculateUscisFees(input: UscisInput): UscisResult {
  const fee = uscisFees.find((item) => item.form === input.form) ?? uscisFees[0];
  const totalCost = (fee.baseFee + fee.biometricsFee) * input.familyMembers;
  const gap = Math.max(totalCost - input.savings, 0);
  const monthsToSave = gap === 0 ? 0 : input.monthlySavings > 0 ? Math.ceil(gap / input.monthlySavings) : null;
  const monthlyRate = 0.24 / 12;
  const creditCardInterestExample =
    gap > 0 ? Math.max(gap * monthlyRate * 12 - Math.max(input.monthlySavings, 0), 0) : 0;

  return {
    form: fee.form,
    totalCost,
    gap,
    monthsToSave,
    creditCardInterestExample,
    paydayLoanWarning: gap > 300,
    feeWaiverMaybe: fee.feeWaiverPossible && (input.receivesPublicBenefit || input.lowIncome || input.financialHardship),
    notes: fee.notes
  };
}
