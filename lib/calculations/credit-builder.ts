import {creditProducts} from "@/data/secured-cards";

export type CreditInput = {
  visaType: string;
  timeInUs: "lt6" | "6to12" | "1to2" | "2to5" | "over5";
  hasBankAccount: boolean;
  tin: "ssn" | "itin" | "neither";
  scoreStatus: "none" | "under580" | "580to669" | "670to739" | "740plus";
  budget: number;
  hasForeignCredit: boolean;
};

export type CreditRoadmapPhase = {
  id: string;
  durationMonths: number;
  impact: "foundation" | "low" | "medium";
};

export function buildCreditRoadmap(input: CreditInput) {
  const phases: CreditRoadmapPhase[] = [
    {id: "documents", durationMonths: 1, impact: "foundation"},
    {id: "bank", durationMonths: input.hasBankAccount ? 0 : 1, impact: "foundation"},
    {id: "firstProduct", durationMonths: 3, impact: "low"},
    {id: "grow", durationMonths: 18, impact: "medium"}
  ];

  const products = creditProducts.filter((product) => {
    const budgetFit = input.budget >= product.minBudget && input.budget <= product.maxBudget;
    const tinFit = input.tin !== "neither" || product.acceptsForeignCredit;
    const foreignFit = input.hasForeignCredit ? true : !product.acceptsForeignCredit;
    return budgetFit && tinFit && foreignFit;
  });

  const startingScore = {
    none: 0,
    under580: 540,
    "580to669": 620,
    "670to739": 700,
    "740plus": 760
  }[input.scoreStatus];

  const timeline = [0, 6, 12, 18, 24].map((month) => ({
    month,
    projected: startingScore === 0 ? (month === 0 ? 0 : Math.min(620 + month * 3, 700)) : Math.min(startingScore + month * 2, 780)
  }));

  return {phases, products, timeline};
}
