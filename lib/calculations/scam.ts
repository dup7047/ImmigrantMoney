export type ScamCategory = "loan" | "immigration" | "tax";

export type ScamInput = {
  category: ScamCategory;
  apr: number;
  yesFlags: string[];
};

export function calculateScamRisk(input: ScamInput) {
  const aprPoints = input.category === "loan" && input.apr > 36 ? 2 : 0;
  const points = input.yesFlags.length + aprPoints;
  const level = points >= 4 ? "high" : points >= 2 ? "caution" : "likely";

  return {
    points,
    level,
    notarioWarning: input.yesFlags.includes("notario"),
    aprWarning: input.category === "loan" && input.apr > 36
  };
}
