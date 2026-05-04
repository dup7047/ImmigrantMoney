export type ImmigrationStatusForBenefits = "documented" | "undocumented" | "mixed";

export const benefitEligibilityNotes: Record<
  ImmigrationStatusForBenefits,
  {
    en: string;
    es: string;
    zh: string;
  }
> = {
  documented: {
    en: "Eligibility for SNAP, Medicaid, ACA subsidies, and state benefits depends on status, income, waiting periods, and state rules.",
    es: "La elegibilidad para SNAP, Medicaid, subsidios ACA y beneficios estatales depende de estatus, ingresos, periodos de espera y reglas estatales.",
    zh: "SNAP、Medicaid、ACA 补贴和各州福利的资格取决于身份、收入、等待期以及各州的具体规定。"
  },
  undocumented: {
    en: "Undocumented adults are usually excluded from many federal benefits, but emergency Medicaid, school meals, community clinics, and some state or local programs may still be available.",
    es: "Adultos indocumentados normalmente quedan fuera de muchos beneficios federales, pero Medicaid de emergencia, comidas escolares, clínicas comunitarias y algunos programas estatales o locales podrían estar disponibles.",
    zh: "无证成年人通常无法获得许多联邦福利，但仍可能符合紧急 Medicaid、学校餐食、社区诊所，以及部分州或地方项目的资格。"
  },
  mixed: {
    en: "Mixed-status households may have eligible family members. Do not assume everyone is ineligible; ask a trusted benefits navigator.",
    es: "Hogares con estatus mixto pueden tener familiares elegibles. No asumas que todos quedan fuera; consulta a un navegador de beneficios confiable.",
    zh: "身份混合的家庭中可能有符合资格的成员。不要假设所有人都不符合资格；请咨询可信赖的福利顾问。"
  }
};
