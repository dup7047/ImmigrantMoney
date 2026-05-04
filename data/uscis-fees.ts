import {sourceNotes} from "./source-notes";

export type UscisFee = {
  form: string;
  label: {
    en: string;
    es: string;
    zh: string;
  };
  baseFee: number;
  biometricsFee: number;
  notes: {
    en: string;
    es: string;
    zh: string;
  };
  feeWaiverPossible: boolean;
};

export const uscisFeeSource = sourceNotes.uscisFees;

export const uscisFees: UscisFee[] = [
  {
    form: "N-400",
    label: {en: "Naturalization", es: "Naturalización", zh: "入籍"},
    baseFee: 760,
    biometricsFee: 0,
    notes: {en: "Online and paper fees can differ. Verify before filing.", es: "Tarifas en línea y papel pueden variar. Verifica antes de enviar.", zh: "在线申请与纸质申请的费用可能不同。提交前请核实。"},
    feeWaiverPossible: true
  },
  {
    form: "I-485",
    label: {en: "Green Card from within the U.S.", es: "Residencia desde dentro de EE.UU.", zh: "在美国境内申请绿卡"},
    baseFee: 1440,
    biometricsFee: 0,
    notes: {en: "Category and age can change the fee.", es: "La categoría y edad pueden cambiar la tarifa.", zh: "申请类别和申请人年龄都可能影响费用。"},
    feeWaiverPossible: true
  },
  {
    form: "I-90",
    label: {en: "Green Card renewal", es: "Renovación de residencia", zh: "绿卡续签"},
    baseFee: 415,
    biometricsFee: 0,
    notes: {en: "Some replacement reasons may have no fee.", es: "Algunas razones de reemplazo pueden no tener tarifa.", zh: "部分换发原因可能无需付费。"},
    feeWaiverPossible: true
  },
  {
    form: "I-765",
    label: {en: "Work permit / EAD", es: "Permiso de trabajo / EAD", zh: "工作许可 / EAD"},
    baseFee: 520,
    biometricsFee: 0,
    notes: {en: "Fee varies by eligibility category.", es: "La tarifa varía según la categoría de elegibilidad.", zh: "费用因资格类别而异。"},
    feeWaiverPossible: true
  },
  {
    form: "I-821D",
    label: {en: "DACA renewal", es: "Renovación de DACA", zh: "DACA 续签"},
    baseFee: 495,
    biometricsFee: 0,
    notes: {en: "DACA rules change often; verify current acceptance.", es: "Las reglas de DACA cambian seguido; verifica aceptación actual.", zh: "DACA 规则经常变动，请确认当前的受理情况。"},
    feeWaiverPossible: false
  },
  {
    form: "I-821",
    label: {en: "Temporary Protected Status", es: "Estatus de Protección Temporal", zh: "临时保护身份（TPS）"},
    baseFee: 50,
    biometricsFee: 30,
    notes: {en: "TPS totals depend on age, initial/renewal status, and EAD request.", es: "TPS depende de edad, solicitud inicial/renovación y EAD.", zh: "TPS 的总费用取决于年龄、首次申请或续签，以及是否申请 EAD。"},
    feeWaiverPossible: true
  },
  {
    form: "I-589",
    label: {en: "Asylum", es: "Asilo", zh: "庇护"},
    baseFee: 0,
    biometricsFee: 0,
    notes: {en: "No filing fee for the main asylum application.", es: "No hay tarifa principal para la solicitud de asilo.", zh: "庇护主申请无需提交申请费。"},
    feeWaiverPossible: false
  },
  {
    form: "I-130",
    label: {en: "Family petition", es: "Petición familiar", zh: "家庭团聚申请"},
    baseFee: 675,
    biometricsFee: 0,
    notes: {en: "Online filing may have a different fee.", es: "La presentación en línea puede tener otra tarifa.", zh: "在线申请的费用可能与纸质申请不同。"},
    feeWaiverPossible: false
  },
  {
    form: "I-131",
    label: {en: "Travel document", es: "Documento de viaje", zh: "旅行证件"},
    baseFee: 630,
    biometricsFee: 0,
    notes: {en: "Some parole-related fee waivers were removed in 2025.", es: "Algunas exenciones relacionadas con parole se eliminaron en 2025.", zh: "2025 年部分与 parole 相关的费用减免已被取消。"},
    feeWaiverPossible: false
  },
  {
    form: "I-751",
    label: {en: "Remove conditions on residence", es: "Eliminar condiciones de residencia", zh: "解除居留条件限制"},
    baseFee: 760,
    biometricsFee: 0,
    notes: {en: "Verify family member fee treatment before filing.", es: "Verifica el tratamiento de tarifas familiares antes de enviar.", zh: "提交前请确认家庭成员的费用如何处理。"},
    feeWaiverPossible: true
  },
  {
    form: "I-912",
    label: {en: "Fee waiver request", es: "Solicitud de exención de tarifa", zh: "费用减免申请"},
    baseFee: 0,
    biometricsFee: 0,
    notes: {en: "Use only with eligible forms.", es: "Úsala solo con formularios elegibles.", zh: "仅可与符合条件的表格一同使用。"},
    feeWaiverPossible: false
  }
];
