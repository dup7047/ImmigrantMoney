import type {ToolMetadata} from "@/lib/types";
import {sourceNotes} from "./source-notes";

export const toolsMetadata: ToolMetadata[] = [
  {
    slug: "wage-theft-checker",
    icon: "ReceiptText",
    category: "earn-protect",
    title: {
      en: "Was I Paid Correctly? Wage Theft Checker",
      es: "¿Me Pagaron Bien? Verificador de Robo de Salario",
      zh: "我的工资发对了吗？工资被克扣检查器"
    },
    shortDescription: {
      en: "Check gross pay, overtime, tipped wages, and risky deductions.",
      es: "Revisa pago bruto, horas extra, propinas y deducciones riesgosas.",
      zh: "检查总工资、加班费、小费工资和有风险的扣款。"
    },
    cta: {en: "Check my pay", es: "Revisar mi pago", zh: "检查我的工资"},
    seoTitle: {
      en: "Was I Paid Correctly? Free Wage Theft Checker",
      es: "¿Me Pagaron Bien? Verificador Gratis de Robo de Salario",
      zh: "我的工资发对了吗？面向移民工人的免费工资被克扣检查器"
    },
    metaDescription: {
      en: "Check if your paycheck may be missing wages, overtime, tips, or illegal deductions. Free tool in English and Spanish.",
      es: "Revisa si tu cheque podría tener salarios, horas extra, propinas o deducciones indebidas. Herramienta gratis en inglés y español.",
      zh: "检查您的工资单是否可能缺少工资、加班费、小费或非法扣款。提供英文、西班牙文和中文的免费工具。"
    },
    evidence: {
      en: "Wage theft affects millions of low-wage workers, including many immigrant workers, and can add up to thousands of dollars per year.",
      es: "El robo de salario afecta a millones de trabajadores de bajos ingresos, incluyendo muchos inmigrantes, y puede sumar miles de dólares por año.",
      zh: "工资被克扣影响着数百万低薪工人（包括许多移民工人），每年可能累计达数千美元。"
    },
    sourceNotes: [sourceNotes.wageTheftLegacy, sourceNotes.wageTheft2025, sourceNotes.dolDeductions],
    related: ["scam-detector", "affordability-planner", "itin-tax-guide"]
  },
  {
    slug: "itin-tax-guide",
    icon: "FileQuestion",
    category: "taxes-immigration",
    title: {
      en: "Should I File Taxes? Safe ITIN Tax Guide 2026",
      es: "¿Debo Declarar Impuestos? Guía Segura de ITIN 2026",
      zh: "我应该报税吗？2026 年 ITIN 安全报税指南"
    },
    shortDescription: {
      en: "Understand filing tradeoffs, ITIN limits, credits, and changing privacy risks.",
      es: "Entiende riesgos, límites del ITIN, créditos y privacidad cambiante.",
      zh: "了解报税利弊、ITIN 的限制、可申请的抵免，以及不断变化的隐私风险。"
    },
    cta: {en: "Start guide", es: "Empezar guía", zh: "开始使用指南"},
    seoTitle: {
      en: "Should I File Taxes? 2026 ITIN Guide",
      es: "¿Debo Declarar Impuestos? Guía ITIN 2026",
      zh: "无证移民应该报税吗？2026 年 ITIN 指南"
    },
    metaDescription: {
      en: "Learn tax filing risks, benefits, ITIN limits, and changing IRS privacy issues. General information, not legal or tax advice.",
      es: "Conoce riesgos, beneficios, límites del ITIN y cambios de privacidad del IRS. Información general, no asesoría legal ni tributaria.",
      zh: "了解报税的风险、益处、ITIN 的限制以及 IRS 不断变化的隐私问题。仅供一般参考，不构成法律或税务建议。"
    },
    evidence: {
      en: "Tax rules and enforcement policies have changed rapidly. This guide explains public information without telling users what to do.",
      es: "Las reglas tributarias y políticas de cumplimiento cambian rápido. Esta guía explica información pública sin decirte qué hacer.",
      zh: "税务规则和执法政策变化迅速。本指南解读公开信息，但不会告诉用户应该怎么做。"
    },
    sourceNotes: [sourceNotes.irsItin, sourceNotes.irsCredits, sourceNotes.irsTipsOvertime, sourceNotes.budgetLabTax, sourceNotes.itepTaxes],
    related: ["uscis-fee-calculator", "wage-theft-checker", "affordability-planner"]
  },
  {
    slug: "uscis-fee-calculator",
    icon: "Landmark",
    category: "taxes-immigration",
    title: {
      en: "Can I Afford My Immigration Application? USCIS Fee Planner",
      es: "¿Puedo Costear Mi Trámite Migratorio? Calculadora de Tarifas USCIS",
      zh: "我能负担得起移民申请吗？USCIS 费用规划器"
    },
    shortDescription: {
      en: "Estimate fee totals, savings timelines, and lower-cost alternatives.",
      es: "Estima tarifas, tiempos de ahorro y alternativas de menor costo.",
      zh: "估算费用总额、储蓄时间表和成本较低的替代方案。"
    },
    cta: {en: "Plan fees", es: "Planear tarifas", zh: "规划费用"},
    seoTitle: {
      en: "USCIS Fee Calculator 2026 — Plan Without High-Cost Debt",
      es: "Calculadora USCIS 2026 — Paga Sin Deuda Cara",
      zh: "USCIS 费用计算器 2026 — 不背高成本债务也能支付移民申请"
    },
    metaDescription: {
      en: "Use a free USCIS fee planner to estimate costs, savings gaps, and possible fee waiver paths. Always verify fees before filing.",
      es: "Usa una calculadora gratis para estimar costos USCIS, brechas de ahorro y posibles exenciones. Verifica tarifas antes de enviar.",
      zh: "使用免费的 USCIS 费用规划器估算费用、储蓄缺口和可能的费用减免途径。提交前请务必核实费用。"
    },
    evidence: {
      en: "Application fees can be a major barrier. Planning ahead helps families avoid high-cost credit and rushed decisions.",
      es: "Las tarifas migratorias pueden ser una barrera fuerte. Planear ayuda a evitar crédito caro y decisiones apresuradas.",
      zh: "申请费用可能是巨大的障碍。提前规划能帮助家庭避免高成本信贷和仓促决定。"
    },
    sourceNotes: [sourceNotes.uscisFees],
    related: ["itin-tax-guide", "credit-builder-roadmap", "affordability-planner"]
  },
  {
    slug: "scam-detector",
    icon: "ShieldAlert",
    category: "earn-protect",
    title: {
      en: "Is This a Scam? Financial Fraud Checker for Immigrants",
      es: "¿Es una Estafa? Verificador de Fraudes Financieros para Inmigrantes",
      zh: "这是骗局吗？面向移民的金融欺诈检查器"
    },
    shortDescription: {
      en: "Spot red flags in loans, notarios, immigration helpers, and tax preparers.",
      es: "Detecta señales de alerta en préstamos, notarios, trámites y preparadores.",
      zh: "识别贷款、公证人、移民帮办和报税员中的危险信号。"
    },
    cta: {en: "Check risk", es: "Revisar riesgo", zh: "检查风险"},
    seoTitle: {
      en: "Scam Detector for Immigrants — Loans, Notarios, Taxes",
      es: "Detector de Estafas — Préstamos, Notarios, Impuestos",
      zh: "移民骗局检测器 — 贷款、公证人和报税员欺诈检查器"
    },
    metaDescription: {
      en: "Check whether a lender, immigration helper, notario, or tax preparer shows fraud red flags. Free tool in English and Spanish.",
      es: "Revisa señales de fraude en prestamistas, ayudantes migratorios, notarios o preparadores de impuestos. Gratis en inglés y español.",
      zh: "检查贷款方、移民帮办、公证人或报税员是否存在欺诈迹象。提供英文、西班牙文和中文的免费工具。"
    },
    evidence: {
      en: "Fraud losses reported to the FTC rose sharply, and immigrants are targeted by notario, tax, and imposter scams.",
      es: "Las pérdidas por fraude reportadas a la FTC aumentaron mucho, e inmigrantes son blanco de notarios, impuestos e impostores.",
      zh: "向 FTC 上报的欺诈损失大幅上升，移民常成为公证人骗局、税务诈骗和冒充诈骗的目标。"
    },
    sourceNotes: [sourceNotes.ftcFraud, sourceNotes.uscisScams],
    related: ["bank-without-ssn", "itin-tax-guide", "wage-theft-checker"]
  },
  {
    slug: "bank-without-ssn",
    icon: "Building2",
    category: "bank-credit",
    title: {
      en: "Open a Bank Account Without SSN — Find Your Options",
      es: "Abrir Cuenta de Banco Sin SSN — Encuentra Tus Opciones",
      zh: "没有 SSN 也能开银行账户 — 找到你的选择"
    },
    shortDescription: {
      en: "Find banks and fintechs that may accept passports, ITINs, and Matrícula Consular.",
      es: "Encuentra bancos y fintechs que podrían aceptar pasaportes, ITIN y Matrícula Consular.",
      zh: "寻找可能接受护照、ITIN 和领事馆身份证（Matrícula Consular）的银行和金融科技公司。"
    },
    cta: {en: "Find options", es: "Ver opciones", zh: "查看选项"},
    seoTitle: {
      en: "Open a Bank Account Without SSN — Free Finder for Immigrants",
      es: "Abrir Cuenta Bancaria Sin SSN — Buscador Gratis",
      zh: "没有 SSN 也能开银行账户 — 面向移民的免费查找工具"
    },
    metaDescription: {
      en: "See banking options that may accept passports, Matrícula Consular, foreign IDs, or ITIN. Requirements vary by institution.",
      es: "Ve opciones bancarias que podrían aceptar pasaporte, Matrícula Consular, ID extranjero o ITIN. Requisitos varían.",
      zh: "查看可能接受护照、领事馆身份证、外国身份证或 ITIN 的银行选项。具体要求因机构而异。"
    },
    evidence: {
      en: "CFPB guidance says an SSN is not always required for checking or savings accounts, though institutions must verify identity.",
      es: "La CFPB indica que no siempre se requiere SSN para cuentas corrientes o de ahorro, aunque deben verificar identidad.",
      zh: "CFPB 的指引表明，开支票或储蓄账户并非总是需要 SSN，但机构必须验证身份。"
    },
    sourceNotes: [sourceNotes.cfpbBanking, sourceNotes.fdicBanked],
    related: ["credit-builder-roadmap", "remittance-calculator", "scam-detector"]
  },
  {
    slug: "credit-builder-roadmap",
    icon: "LineChart",
    category: "bank-credit",
    title: {
      en: "Build Credit From Zero — Immigrant Credit Roadmap",
      es: "Construir Crédito Desde Cero — Hoja de Ruta para Inmigrantes",
      zh: "从零开始建立信用 — 移民信用路线图"
    },
    shortDescription: {
      en: "Get an educational roadmap from no score to stronger credit habits.",
      es: "Obtén una hoja de ruta educativa desde cero hacia mejores hábitos de crédito.",
      zh: "获得一份从没有信用分数到建立稳健信用习惯的教学路线图。"
    },
    cta: {en: "Build roadmap", es: "Crear ruta", zh: "生成路线图"},
    seoTitle: {
      en: "How to Build Credit as an Immigrant in the US — Free Roadmap",
      es: "Construir Crédito Como Inmigrante en EE.UU. — Ruta Gratis",
      zh: "作为移民如何在美国建立信用 — 免费路线图"
    },
    metaDescription: {
      en: "Create a credit-building roadmap based on time in the U.S., banking access, SSN/ITIN status, and budget.",
      es: "Crea una ruta de crédito según tiempo en EE.UU., acceso bancario, SSN/ITIN y presupuesto.",
      zh: "根据您在美时间、银行使用情况、SSN/ITIN 状态和预算，制定信用建立路线图。"
    },
    evidence: {
      en: "Recent immigrants often arrive without transferable U.S. credit history. CFPB data shows millions still have no usable credit score.",
      es: "Muchos inmigrantes llegan sin historial crediticio transferible. Datos de la CFPB muestran que millones no tienen puntaje usable.",
      zh: "新移民通常没有可转移的美国信用记录。CFPB 数据显示，仍有数百万人没有可用的信用分数。"
    },
    sourceNotes: [sourceNotes.cfpbCredit, sourceNotes.cfpbBanking],
    related: ["bank-without-ssn", "uscis-fee-calculator", "affordability-planner"]
  },
  {
    slug: "remittance-calculator",
    icon: "Send",
    category: "send-spend",
    title: {
      en: "Best Way to Send Money Home — Remittance Comparator",
      es: "La Mejor Forma de Enviar Dinero a Casa — Comparador de Remesas",
      zh: "把钱寄回家的最佳方式 — 汇款比较器"
    },
    shortDescription: {
      en: "Compare static fee and exchange-rate estimates before sending money.",
      es: "Compara estimados estáticos de tarifas y tipo de cambio antes de enviar dinero.",
      zh: "汇款前比较静态的手续费和汇率估算。"
    },
    cta: {en: "Compare costs", es: "Comparar costos", zh: "比较费用"},
    seoTitle: {
      en: "Best Way to Send Money Home — Free Remittance Comparator",
      es: "Mejor Forma de Enviar Dinero — Comparador Gratis",
      zh: "把钱寄回家的最佳方式 — 免费汇款比较器"
    },
    metaDescription: {
      en: "Compare estimated remittance costs, exchange markups, and annual savings for common services. Static estimates only.",
      es: "Compara costos estimados de remesas, márgenes cambiarios y ahorros anuales. Estimados estáticos solamente.",
      zh: "比较常见服务的汇款成本估算、汇率加价和年度节省。仅为静态估算。"
    },
    evidence: {
      en: "World Bank data shows remittance costs include both fees and exchange-rate markups, making comparison difficult.",
      es: "Datos del Banco Mundial muestran que las remesas incluyen tarifas y márgenes cambiarios, lo que dificulta comparar.",
      zh: "世界银行数据显示，汇款成本同时包含手续费和汇率加价，因此比较起来并不容易。"
    },
    sourceNotes: [sourceNotes.worldBankRemittance, sourceNotes.cfpbRemittance, sourceNotes.kffImmigrants],
    related: ["bank-without-ssn", "affordability-planner", "scam-detector"]
  },
  {
    slug: "affordability-planner",
    icon: "PieChart",
    category: "send-spend",
    title: {
      en: "Can I Afford to Live Here? Immigrant Budget Planner",
      es: "¿Puedo Vivir Aquí? Planificador de Presupuesto para Inmigrantes",
      zh: "我能负担得起在这里生活吗？移民预算规划器"
    },
    shortDescription: {
      en: "Build a realistic budget with remittances, health costs, debt, and immigration savings.",
      es: "Crea un presupuesto realista con remesas, salud, deudas y ahorro migratorio.",
      zh: "把汇款、医疗支出、债务和移民储蓄一起纳入，做出更贴近现实的预算。"
    },
    cta: {en: "Plan budget", es: "Planear presupuesto", zh: "规划预算"},
    seoTitle: {
      en: "Immigrant Budget Planner — Can You Afford to Live Here?",
      es: "Presupuesto para Inmigrantes — ¿Puedes Vivir Aquí?",
      zh: "移民预算规划器 — 你能负担得起在这里生活吗？"
    },
    metaDescription: {
      en: "Use a free budget planner built around immigrant realities: remittances, higher deposits, health costs, and immigration savings.",
      es: "Usa un planificador gratis para realidades inmigrantes: remesas, depósitos altos, salud y ahorro migratorio.",
      zh: "使用为移民现实而设计的免费预算规划器：汇款、较高的押金、医疗费用和移民储蓄。"
    },
    evidence: {
      en: "KFF found many immigrants struggle with basics like food, housing, utilities, and health care despite high employment.",
      es: "KFF encontró que muchos inmigrantes batallan con comida, vivienda, servicios y salud, aunque muchos trabajan.",
      zh: "KFF 的研究发现，尽管就业率很高，许多移民仍在食物、住房、水电和医疗等基本需求上挣扎。"
    },
    sourceNotes: [sourceNotes.kffImmigrants],
    related: ["remittance-calculator", "uscis-fee-calculator", "credit-builder-roadmap"]
  }
];

export function getToolMetadata(slug: string) {
  return toolsMetadata.find((tool) => tool.slug === slug);
}
