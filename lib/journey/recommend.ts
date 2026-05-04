import type {CategoryKey, ToolSlug} from "@/lib/types";

export const GOAL_KEYS = ["protectPay", "bankCredit", "usciTaxes", "sendMoney", "budget"] as const;
export const STATUS_KEYS = ["ssn", "itin", "neither", "notSure"] as const;
export const PRIORITY_KEYS = ["pocket", "avoidScams", "bigExpense"] as const;

export type GoalKey = (typeof GOAL_KEYS)[number];
export type StatusKey = (typeof STATUS_KEYS)[number];
export type PriorityKey = (typeof PRIORITY_KEYS)[number];

export type JourneyAnswers = {
  goal: GoalKey;
  status: StatusKey;
  priority: PriorityKey;
};

export type JourneyRecommendation = {
  primary: ToolSlug;
  secondary: ToolSlug[];
  categoryKey: CategoryKey;
  rationaleKey: GoalKey;
};

// Living config — keep small and review periodically.
export const RECOMMEND_LAST_REVIEWED = "2026-05-03";

const BY_GOAL: Record<GoalKey, JourneyRecommendation> = {
  protectPay: {
    primary: "wage-theft-checker",
    secondary: ["scam-detector", "affordability-planner"],
    categoryKey: "earn-protect",
    rationaleKey: "protectPay"
  },
  bankCredit: {
    primary: "bank-without-ssn",
    secondary: ["credit-builder-roadmap", "scam-detector"],
    categoryKey: "bank-credit",
    rationaleKey: "bankCredit"
  },
  usciTaxes: {
    primary: "uscis-fee-calculator",
    secondary: ["itin-tax-guide", "credit-builder-roadmap"],
    categoryKey: "taxes-immigration",
    rationaleKey: "usciTaxes"
  },
  sendMoney: {
    primary: "remittance-calculator",
    secondary: ["bank-without-ssn", "affordability-planner"],
    categoryKey: "send-spend",
    rationaleKey: "sendMoney"
  },
  budget: {
    primary: "affordability-planner",
    secondary: ["remittance-calculator", "credit-builder-roadmap"],
    categoryKey: "send-spend",
    rationaleKey: "budget"
  }
};

export function recommend({goal, status, priority}: JourneyAnswers): JourneyRecommendation {
  const base = BY_GOAL[goal];
  let primary = base.primary;
  let secondary = [...base.secondary];

  // Status overrides — keep narrow.
  if (goal === "usciTaxes" && status === "itin") primary = "itin-tax-guide";
  if (goal === "bankCredit" && status === "neither") secondary = ["itin-tax-guide", ...secondary];

  // Priority overrides — surface the right secondary tool.
  if (priority === "avoidScams" && !secondary.includes("scam-detector")) secondary.unshift("scam-detector");
  if (priority === "bigExpense" && !secondary.includes("uscis-fee-calculator") && primary !== "uscis-fee-calculator") {
    secondary.unshift("uscis-fee-calculator");
  }

  return {
    primary,
    secondary: secondary.filter((slug) => slug !== primary).slice(0, 2),
    categoryKey: base.categoryKey,
    rationaleKey: base.rationaleKey
  };
}

export function isGoalKey(value: string | null | undefined): value is GoalKey {
  return !!value && (GOAL_KEYS as readonly string[]).includes(value);
}

export function isStatusKey(value: string | null | undefined): value is StatusKey {
  return !!value && (STATUS_KEYS as readonly string[]).includes(value);
}

export function isPriorityKey(value: string | null | undefined): value is PriorityKey {
  return !!value && (PRIORITY_KEYS as readonly string[]).includes(value);
}
