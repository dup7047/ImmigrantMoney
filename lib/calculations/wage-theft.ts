import {getStateWageRule} from "@/data/state-wage-rules";

export type EmploymentType = "hourly" | "salaried" | "tipped" | "cash";
export type DeductionType =
  | "federalTax"
  | "stateTax"
  | "socialSecurity"
  | "medicare"
  | "healthInsurance"
  | "tools"
  | "transportation"
  | "uniform"
  | "breakage"
  | "other";

export type WageInput = {
  stateCode: string;
  employmentType: EmploymentType;
  hoursWorked: number;
  overtimeHours: number;
  hourlyRate: number;
  weeklySalary: number;
  tips: number;
  actualPay: number;
  withholdingAmount: number;
  benefitDeductions: number;
  deductions: DeductionType[];
  unlistedDeductions: boolean;
};

export type WageResult = {
  minimumWage: number;
  tippedMinimumWage: number;
  regularHours: number;
  overtimeHours: number;
  expectedGross: number;
  expectedNetKnownDeductions: number;
  actualPay: number;
  possibleUnderpayment: number;
  annualLoss: number;
  illegalDeductionFlags: DeductionType[];
  payStubNote?: {
    en: string;
    es: string;
    zh: string;
  };
  warnings: string[];
};

const employerBenefitDeductions: DeductionType[] = ["tools", "transportation", "uniform", "breakage"];

export function calculateWage(input: WageInput): WageResult {
  const rule = getStateWageRule(input.stateCode);
  const overtimeHours = Math.max(input.overtimeHours, Math.max(input.hoursWorked - rule.overtimeThreshold, 0));
  const regularHours = Math.max(input.hoursWorked - overtimeHours, 0);
  const rate = input.employmentType === "tipped" ? Math.max(input.hourlyRate, rule.tippedMinimumWage) : input.hourlyRate;
  const wageGross =
    input.employmentType === "salaried"
      ? input.weeklySalary
      : regularHours * rate + overtimeHours * rate * 1.5 + input.tips;
  const minimumGross = regularHours * rule.minimumWage + overtimeHours * rule.minimumWage * 1.5;
  const expectedGross = Math.max(wageGross, minimumGross);
  const knownLegalDeductions = Math.max(input.withholdingAmount, 0) + Math.max(input.benefitDeductions, 0);
  const expectedNetKnownDeductions = Math.max(expectedGross - knownLegalDeductions, 0);
  const possibleUnderpayment = Math.max(expectedNetKnownDeductions - input.actualPay, 0);
  const effectiveHourlyAfterDeductions =
    input.hoursWorked > 0 ? (expectedGross - knownLegalDeductions) / input.hoursWorked : expectedGross;
  const illegalDeductionFlags =
    effectiveHourlyAfterDeductions <= rule.minimumWage
      ? input.deductions.filter((deduction) => employerBenefitDeductions.includes(deduction))
      : input.deductions.filter((deduction) => deduction === "breakage");

  const warnings: string[] = [];
  if (input.unlistedDeductions) {
    warnings.push("unlistedDeductions");
  }
  if (input.employmentType === "cash") {
    warnings.push("cashNoStub");
  }
  if (input.employmentType === "tipped" && input.tips + input.hourlyRate * input.hoursWorked < minimumGross) {
    warnings.push("tipCreditGap");
  }

  return {
    minimumWage: rule.minimumWage,
    tippedMinimumWage: rule.tippedMinimumWage,
    regularHours,
    overtimeHours,
    expectedGross,
    expectedNetKnownDeductions,
    actualPay: input.actualPay,
    possibleUnderpayment,
    annualLoss: possibleUnderpayment * 52,
    illegalDeductionFlags,
    payStubNote: rule.payStubNote,
    warnings
  };
}
