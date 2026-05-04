import {cityCostPresets} from "@/data/city-cost-presets";
import type {ImmigrationStatusForBenefits} from "@/data/benefit-eligibility-notes";

export type AffordabilityInput = {
  city: string;
  income: number;
  householdSize: number;
  remittances: number;
  healthInsurance: "employer" | "marketplace" | "uninsured";
  hasChildren: boolean;
  status: ImmigrationStatusForBenefits;
  debtPayments: number;
  immigrationSavingsGoal: number;
  goalMonths: number;
};

export type BudgetLine = {
  id: string;
  amount: number;
};

export function calculateAffordability(input: AffordabilityInput) {
  const preset = cityCostPresets.find((city) => city.city === input.city) ?? cityCostPresets[cityCostPresets.length - 1];
  const recommendedRent = Math.min(input.income * 0.3, preset.rentBaseline);
  const food = preset.foodPerPerson * input.householdSize;
  const healthcare =
    input.healthInsurance === "uninsured"
      ? preset.healthcareUninsured
      : input.healthInsurance === "marketplace"
        ? Math.max(preset.healthcareUninsured * 0.65, 150)
        : 120;
  const childcare = input.hasChildren ? 250 : 0;
  const immigrationSavings =
    input.immigrationSavingsGoal > 0 && input.goalMonths > 0
      ? input.immigrationSavingsGoal / input.goalMonths
      : 0;
  const emergencyFund = Math.max(input.income * 0.05, 25);
  const discretionary = Math.max(
    input.income -
      recommendedRent -
      food -
      preset.transport -
      input.remittances -
      healthcare -
      childcare -
      immigrationSavings -
      input.debtPayments -
      emergencyFund,
    0
  );

  const lines: BudgetLine[] = [
    {id: "rent", amount: recommendedRent},
    {id: "food", amount: food},
    {id: "transportation", amount: preset.transport},
    {id: "remittances", amount: input.remittances},
    {id: "healthcare", amount: healthcare},
    {id: "childcare", amount: childcare},
    {id: "immigrationSavings", amount: immigrationSavings},
    {id: "debt", amount: input.debtPayments},
    {id: "emergency", amount: emergencyFund},
    {id: "discretionary", amount: discretionary}
  ];

  const leaseSavings = recommendedRent * (2 + preset.brokerFeeMultiplier);
  const monthlyUsed = lines.reduce((sum, line) => sum + line.amount, 0);
  const status = monthlyUsed <= input.income ? "workable" : monthlyUsed <= input.income * 1.1 ? "tight" : "shortfall";

  return {
    lines,
    leaseSavings,
    monthlyUsed,
    monthlyShortfall: Math.max(monthlyUsed - input.income, 0),
    status
  };
}
