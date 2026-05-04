"use client";

import dynamic from "next/dynamic";
import {zodResolver} from "@hookform/resolvers/zod";
import {AlertTriangle, ExternalLink} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {benefitEligibilityNotes, type ImmigrationStatusForBenefits} from "@/data/benefit-eligibility-notes";
import {bankOptions, type BankIdType} from "@/data/banks-no-ssn";
import {cityCostPresets} from "@/data/city-cost-presets";
import {remittanceCountries, type DeliveryMethod, type RemittanceCountry} from "@/data/remittance-rates";
import {stateLaborBoards, usStates} from "@/data/state-labor-boards";
import {uscisFees} from "@/data/uscis-fees";
import {calculateAffordability} from "@/lib/calculations/affordability";
import {buildCreditRoadmap} from "@/lib/calculations/credit-builder";
import {compareRemittances, type Frequency} from "@/lib/calculations/remittance";
import {calculateScamRisk, type ScamCategory} from "@/lib/calculations/scam";
import {calculateUscisFees} from "@/lib/calculations/uscis-fees";
import {calculateWage, type DeductionType, type EmploymentType} from "@/lib/calculations/wage-theft";
import type {Locale, ToolSlug} from "@/lib/types";
import {formatCurrency, formatCurrencyPrecise} from "@/lib/utils";
import {Button} from "../ui/Button";
import {Checkbox, FieldShell, Input, Select} from "../ui/Field";
import {Panel, Stat} from "../ui/Panel";

const CreditTimelineChart = dynamic(
  () => import("./CreditTimelineChart").then((module) => module.CreditTimelineChart),
  {ssr: false, loading: () => <div className="h-64 rounded-md bg-slate-100" />}
);

const BudgetPieChart = dynamic(
  () => import("./BudgetPieChart").then((module) => module.BudgetPieChart),
  {ssr: false, loading: () => <div className="h-72 rounded-md bg-slate-100" />}
);

const budgetLabels: Record<string, string> = {
  rent: "Rent",
  food: "Food",
  transportation: "Transportation",
  remittances: "Remittances",
  healthcare: "Healthcare",
  childcare: "Childcare",
  immigrationSavings: "Immigration savings",
  debt: "Debt",
  emergency: "Emergency fund",
  discretionary: "Discretionary"
};

export function ToolRenderer({slug}: {slug: ToolSlug}) {
  switch (slug) {
    case "wage-theft-checker":
      return <WageTheftTool />;
    case "itin-tax-guide":
      return <ItinTaxGuide />;
    case "uscis-fee-calculator":
      return <UscisFeeTool />;
    case "scam-detector":
      return <ScamDetectorTool />;
    case "bank-without-ssn":
      return <BankFinderTool />;
    case "credit-builder-roadmap":
      return <CreditRoadmapTool />;
    case "remittance-calculator":
      return <RemittanceTool />;
    case "affordability-planner":
      return <AffordabilityTool />;
    default:
      return null;
  }
}

function FormGrid({children}: {children: React.ReactNode}) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function WarningList({items}: {items: string[]}) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div className="flex gap-2 rounded-xl border border-caution-200 bg-caution-50 p-3 text-sm text-caution-950" key={item}>
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

const wageSchema = z.object({
  stateCode: z.string().min(2),
  employmentType: z.enum(["hourly", "salaried", "tipped", "cash"]),
  hoursWorked: z.coerce.number().min(0).max(80),
  hourlyRate: z.coerce.number().min(0).max(500),
  weeklySalary: z.coerce.number().min(0).max(25000),
  overtimeHours: z.coerce.number().min(0).max(40),
  tips: z.coerce.number().min(0).max(10000),
  actualPay: z.coerce.number().min(0).max(25000),
  withholdingAmount: z.coerce.number().min(0).max(10000),
  benefitDeductions: z.coerce.number().min(0).max(10000),
  unlistedDeductions: z.boolean()
});

type WageForm = z.infer<typeof wageSchema>;

function WageTheftTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [deductions, setDeductions] = useState<DeductionType[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calculateWage> | null>(null);
  const {register, handleSubmit, watch} = useForm<WageForm>({
    resolver: zodResolver(wageSchema),
    defaultValues: {
      stateCode: "CA",
      employmentType: "hourly",
      hoursWorked: 40,
      hourlyRate: 16,
      weeklySalary: 0,
      overtimeHours: 0,
      tips: 0,
      actualPay: 0,
      withholdingAmount: 0,
      benefitDeductions: 0,
      unlistedDeductions: false
    }
  });
  const stateCode = watch("stateCode");
  const board = stateLaborBoards.find((item) => item.code === stateCode);

  const deductionLabels: Record<DeductionType, string> = {
    federalTax: "Federal income tax",
    stateTax: "State income tax",
    socialSecurity: "Social Security",
    medicare: "Medicare",
    healthInsurance: "Health insurance",
    tools: "Tools/equipment",
    transportation: "Transportation",
    uniform: "Uniform",
    breakage: "Breakage or damage",
    other: "Other"
  };

  function toggleDeduction(deduction: DeductionType, checked: boolean) {
    setDeductions((current) =>
      checked ? [...current, deduction] : current.filter((item) => item !== deduction)
    );
  }

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-6"
        onSubmit={handleSubmit((data) => {
          setResult(calculateWage({...data, employmentType: data.employmentType as EmploymentType, deductions}));
        })}
      >
        <FormGrid>
          <FieldShell label={t("fields.state")}>
            <Select {...register("stateCode")}>
              {usStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.wage.employmentType")}>
            <Select {...register("employmentType")}>
              <option value="hourly">{t("tools.wage.hourly")}</option>
              <option value="salaried">{t("tools.wage.salaried")}</option>
              <option value="tipped">{t("tools.wage.tipped")}</option>
              <option value="cash">{t("tools.wage.cash")}</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.wage.hoursWorked")}>
            <Input type="number" step="0.25" {...register("hoursWorked")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.overtimeHours")}>
            <Input type="number" step="0.25" {...register("overtimeHours")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.hourlyRate")}>
            <Input type="number" step="0.01" {...register("hourlyRate")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.weeklySalary")}>
            <Input type="number" step="0.01" {...register("weeklySalary")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.tips")}>
            <Input type="number" step="0.01" {...register("tips")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.actualPay")}>
            <Input type="number" step="0.01" {...register("actualPay")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.withholding")}>
            <Input type="number" step="0.01" {...register("withholdingAmount")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.benefits")}>
            <Input type="number" step="0.01" {...register("benefitDeductions")} />
          </FieldShell>
        </FormGrid>

        <div>
          <p className="mb-3 text-sm font-bold text-slate-800">{t("tools.wage.deductions")}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {(Object.keys(deductionLabels) as DeductionType[]).map((deduction) => (
              <Checkbox
                checked={deductions.includes(deduction)}
                key={deduction}
                label={deductionLabels[deduction]}
                onChange={(event) => toggleDeduction(deduction, event.target.checked)}
              />
            ))}
          </div>
        </div>
        <Checkbox label={t("tools.wage.unlisted")} {...register("unlistedDeductions")} />
        <Button type="submit">{t("common.calculate")}</Button>
      </form>

      {result ? (
        <div className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label={t("tools.wage.expectedGross")} value={formatCurrencyPrecise(result.expectedGross, locale)} />
            <Stat label={t("tools.wage.expectedNet")} value={formatCurrencyPrecise(result.expectedNetKnownDeductions, locale)} />
            <Stat
              label={result.possibleUnderpayment > 0 ? t("tools.wage.underpaid") : t("common.results")}
              tone={result.possibleUnderpayment > 0 ? "danger" : "success"}
              value={
                result.possibleUnderpayment > 0
                  ? formatCurrencyPrecise(result.possibleUnderpayment, locale)
                  : t("tools.wage.appearsCorrect")
              }
            />
          </div>
          {result.possibleUnderpayment > 0 ? (
            <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
              {t("tools.wage.annualLoss")}: {formatCurrencyPrecise(result.annualLoss, locale)}
            </p>
          ) : null}
          <WarningList
            items={[
              ...result.warnings.map((warning) => t(`tools.wage.${warning}`)),
              ...(result.illegalDeductionFlags.length > 0
                ? [`${t("tools.wage.illegalFlags")}: ${result.illegalDeductionFlags.map((item) => deductionLabels[item]).join(", ")}`]
                : []),
              ...(result.payStubNote ? [result.payStubNote[locale]] : [])
            ]}
          />
          {board ? (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-bold text-ink-900">{t("tools.wage.resources")}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a className="font-semibold text-brand-600 hover:text-brand-700" href={board.reportUrl} rel="noreferrer" target="_blank">
                  {board.name} <ExternalLink className="inline h-3.5 w-3.5" />
                </a>
                <a className="font-semibold text-brand-600 hover:text-brand-700" href="https://www.nlrb.gov/" rel="noreferrer" target="_blank">
                  {t("tools.wage.nlrb")} <ExternalLink className="inline h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}

const itinSchema = z.object({
  status: z.string(),
  tin: z.enum(["ssn", "itin", "neither", "notSure"]),
  worked: z.enum(["w2", "cash", "no"]),
  withheld: z.enum(["yes", "no", "notSure"]),
  children: z.enum(["yes", "no"]),
  stateCode: z.string()
});

type ItinForm = z.infer<typeof itinSchema>;

function ItinTaxGuide() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ItinForm | null>(null);
  const {register, handleSubmit} = useForm<ItinForm>({
    resolver: zodResolver(itinSchema),
    defaultValues: {status: "undocumented", tin: "itin", worked: "w2", withheld: "notSure", children: "no", stateCode: "CA"}
  });
  const fields = [
    <FieldShell key="status" label={t("tools.itin.status")}>
      <Select {...register("status")}>
        {["undocumented", "daca", "tps", "workVisa", "student", "greenCard", "other"].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </FieldShell>,
    <FieldShell key="tin" label={t("tools.itin.tin")}>
      <Select {...register("tin")}>
        <option value="ssn">SSN</option>
        <option value="itin">ITIN</option>
        <option value="neither">Neither</option>
        <option value="notSure">{t("fields.notSure")}</option>
      </Select>
    </FieldShell>,
    <FieldShell key="worked" label={t("tools.itin.worked")}>
      <Select {...register("worked")}>
        <option value="w2">Yes - W-2 job</option>
        <option value="cash">Yes - cash/gig work</option>
        <option value="no">{t("fields.no")}</option>
      </Select>
    </FieldShell>,
    <FieldShell key="withheld" label={t("tools.itin.withheld")}>
      <Select {...register("withheld")}>
        <option value="yes">{t("fields.yes")}</option>
        <option value="no">{t("fields.no")}</option>
        <option value="notSure">{t("fields.notSure")}</option>
      </Select>
    </FieldShell>,
    <FieldShell key="children" label={t("tools.itin.children")}>
      <Select {...register("children")}>
        <option value="yes">{t("fields.yes")}</option>
        <option value="no">{t("fields.no")}</option>
      </Select>
    </FieldShell>,
    <FieldShell key="state" label={t("fields.state")}>
      <Select {...register("stateCode")}>
        {usStates.map((state) => (
          <option key={state.code} value={state.code}>
            {state.name}
          </option>
        ))}
      </Select>
    </FieldShell>
  ];

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          setResult(data);
        })}
      >
        <div className="rounded-md bg-slate-50 p-4">
          <p className="mb-3 text-sm font-bold text-slate-600">
            {step + 1} / {fields.length}
          </p>
          {fields[step]}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={step === 0} onClick={() => setStep((value) => Math.max(value - 1, 0))} type="button" variant="secondary">
            {t("common.back")}
          </Button>
          {step < fields.length - 1 ? (
            <Button onClick={() => setStep((value) => Math.min(value + 1, fields.length - 1))} type="button">
              {t("common.next")}
            </Button>
          ) : (
            <Button type="submit">{t("common.results")}</Button>
          )}
        </div>
      </form>
      {result ? (
        <div className="grid gap-4">
          <h2 className="font-display text-heading-1 text-ink-900">{t("tools.itin.verdict")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Panel className="border-brand-100 bg-brand-50">
              <h3 className="font-bold text-brand-900">{t("tools.itin.fileRisks")}</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-brand-900">
                <li>{result.withheld === "yes" ? "You may be able to claim over-withheld taxes." : "You may document tax compliance history."}</li>
                <li>{t("tools.itin.privacyVolatile")}</li>
              </ul>
            </Panel>
            <Panel className="border-caution-200 bg-caution-50">
              <h3 className="font-bold text-caution-950">{t("tools.itin.dontFileRisks")}</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-caution-950">
                <li>You may lose a refund if taxes were withheld.</li>
                <li>Not filing can create tax compliance issues if you had a filing requirement.</li>
              </ul>
            </Panel>
          </div>
          <WarningList
            items={[
              result.tin === "ssn" ? "SSN entered: ask a trusted preparer about EITC, CTC, tips, and overtime eligibility." : t("tools.itin.ssnRequired"),
              t("tools.itin.vita")
            ]}
          />
          <p className="text-xs font-semibold text-slate-500">{t("common.lastReviewed")}: {new Date("2026-05-02").toLocaleDateString(locale)}</p>
        </div>
      ) : null}
    </Panel>
  );
}

const uscisSchema = z.object({
  form: z.string(),
  familyMembers: z.coerce.number().min(1).max(8),
  savings: z.coerce.number().min(0),
  monthlySavings: z.coerce.number().min(0),
  receivesPublicBenefit: z.boolean(),
  lowIncome: z.boolean(),
  financialHardship: z.boolean()
});

type UscisForm = z.infer<typeof uscisSchema>;

function UscisFeeTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [result, setResult] = useState<ReturnType<typeof calculateUscisFees> | null>(null);
  const {register, handleSubmit} = useForm<UscisForm>({
    resolver: zodResolver(uscisSchema),
    defaultValues: {
      form: "N-400",
      familyMembers: 1,
      savings: 0,
      monthlySavings: 100,
      receivesPublicBenefit: false,
      lowIncome: false,
      financialHardship: false
    }
  });

  return (
    <Panel className="grid gap-6">
      <form className="grid gap-5" onSubmit={handleSubmit((data) => setResult(calculateUscisFees(data)))}>
        <FormGrid>
          <FieldShell label={t("tools.uscis.application")}>
            <Select {...register("form")}>
              {uscisFees.map((fee) => (
                <option key={fee.form} value={fee.form}>
                  {fee.form} - {fee.label[locale]}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.uscis.familyMembers")}>
            <Input type="number" {...register("familyMembers")} />
          </FieldShell>
          <FieldShell label={t("tools.uscis.savings")}>
            <Input type="number" {...register("savings")} />
          </FieldShell>
          <FieldShell label={t("tools.uscis.monthlySavings")}>
            <Input type="number" {...register("monthlySavings")} />
          </FieldShell>
        </FormGrid>
        <div className="grid gap-2">
          <Checkbox label={t("tools.uscis.publicBenefit")} {...register("receivesPublicBenefit")} />
          <Checkbox label={t("tools.uscis.lowIncome")} {...register("lowIncome")} />
          <Checkbox label={t("tools.uscis.hardship")} {...register("financialHardship")} />
        </div>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label={t("tools.uscis.totalCost")} value={formatCurrency(result.totalCost, locale)} />
            <Stat label={t("tools.uscis.gap")} value={formatCurrency(result.gap, locale)} tone={result.gap > 0 ? "warning" : "success"} />
            <Stat label={t("tools.uscis.months")} value={result.monthsToSave === null ? "—" : result.monthsToSave} />
          </div>
          <WarningList
            items={[
              result.feeWaiverMaybe ? t("tools.uscis.feeWaiver") : t("tools.uscis.noFeeWaiver"),
              ...(result.paydayLoanWarning ? [t("tools.uscis.danger")] : []),
              result.notes[locale],
              t("tools.uscis.verify")
            ]}
          />
        </div>
      ) : null}
    </Panel>
  );
}

const scamSchema = z.object({
  category: z.enum(["loan", "immigration", "tax"]),
  apr: z.coerce.number().min(0).max(1000)
});

type ScamForm = z.infer<typeof scamSchema>;

function ScamDetectorTool() {
  const t = useTranslations();
  const [flags, setFlags] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calculateScamRisk> | null>(null);
  const {register, handleSubmit, watch} = useForm<ScamForm>({
    resolver: zodResolver(scamSchema),
    defaultValues: {category: "loan", apr: 36}
  });
  const category = watch("category") as ScamCategory;
  const flagOptions: Record<ScamCategory, {id: string; label: string}[]> = {
    loan: [
      {id: "feesHidden", label: "Fees were not disclosed upfront"},
      {id: "pressure", label: "You were pressured to sign today"},
      {id: "licenseUnknown", label: "Lender license is unknown"},
      {id: "ssnEarly", label: "They asked for SSN/ITIN before explaining terms"}
    ],
    immigration: [
      {id: "notario", label: "They called themselves a notario"},
      {id: "guarantee", label: "They guaranteed a visa or result"},
      {id: "blankForms", label: "They asked you to sign blank forms"},
      {id: "noAccreditation", label: "They cannot prove attorney or DOJ accreditation"}
    ],
    tax: [
      {id: "largerRefund", label: "They promised a larger refund than others"},
      {id: "percentFee", label: "They charge a percentage of your refund"},
      {id: "blankReturn", label: "They asked you to sign a blank return"},
      {id: "noPtin", label: "They do not have a PTIN"}
    ]
  };

  function toggleFlag(id: string, checked: boolean) {
    setFlags((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  return (
    <Panel className="grid gap-6">
      <form className="grid gap-5" onSubmit={handleSubmit((data) => setResult(calculateScamRisk({...data, category, yesFlags: flags})))}>
        <FormGrid>
          <FieldShell label={t("tools.scam.category")}>
            <Select
              {...register("category")}
              onChange={(event) => {
                register("category").onChange(event);
                setFlags([]);
                setResult(null);
              }}
            >
              <option value="loan">{t("tools.scam.loan")}</option>
              <option value="immigration">{t("tools.scam.immigration")}</option>
              <option value="tax">{t("tools.scam.tax")}</option>
            </Select>
          </FieldShell>
          {category === "loan" ? (
            <FieldShell label={t("tools.scam.apr")}>
              <Input type="number" {...register("apr")} />
            </FieldShell>
          ) : null}
        </FormGrid>
        <div className="grid gap-2">
          {flagOptions[category].map((flag) => (
            <Checkbox checked={flags.includes(flag.id)} key={flag.id} label={flag.label} onChange={(event) => toggleFlag(flag.id, event.target.checked)} />
          ))}
        </div>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div className="grid gap-4">
          <Stat
            label={t("tools.scam.score")}
            tone={result.level === "high" ? "danger" : result.level === "caution" ? "warning" : "success"}
            value={t(`tools.scam.${result.level}`)}
          />
          <WarningList
            items={[
              ...(flags.length > 0 ? [`${t("tools.scam.redFlags")}: ${flags.join(", ")}`] : []),
              ...(result.notarioWarning ? [t("tools.scam.notario")] : []),
              ...(result.aprWarning ? [t("tools.scam.aprWarning")] : []),
              "FTC: ReportFraud.ftc.gov · CFPB: consumerfinance.gov/complaint"
            ]}
          />
        </div>
      ) : null}
    </Panel>
  );
}

const bankSchema = z.object({
  accountType: z.enum(["checking", "savings", "both"]),
  income: z.string(),
  sendsMoney: z.boolean(),
  language: z.enum(["en", "es", "both"])
});

type BankForm = z.infer<typeof bankSchema>;

function BankFinderTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [ids, setIds] = useState<BankIdType[]>(["passport"]);
  const [result, setResult] = useState<typeof bankOptions>([]);
  const {register, handleSubmit} = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    defaultValues: {accountType: "checking", income: "1000-2500", sendsMoney: false, language: "both"}
  });
  const idLabels: Record<BankIdType, string> = {
    passport: t("tools.bank.passport"),
    matricula: t("tools.bank.matricula"),
    "foreign-id": t("tools.bank.foreignId"),
    itin: t("tools.bank.itin"),
    "state-id": t("tools.bank.stateId")
  };

  function toggleId(id: BankIdType, checked: boolean) {
    setIds((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          setResult(
            bankOptions.filter((bank) => {
              const idMatch = ids.some((id) => bank.acceptedIds.includes(id));
              const accountMatch = bank.accountTypes.includes(data.accountType) || bank.accountTypes.includes("both");
              const transferMatch = !data.sendsMoney || bank.internationalTransfers;
              const languageMatch = data.language !== "es" || bank.spanishSupport;
              return idMatch && accountMatch && transferMatch && languageMatch;
            })
          );
        })}
      >
        <div>
          <p className="mb-3 text-sm font-bold text-slate-800">{t("tools.bank.ids")}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {(Object.keys(idLabels) as BankIdType[]).map((id) => (
              <Checkbox checked={ids.includes(id)} key={id} label={idLabels[id]} onChange={(event) => toggleId(id, event.target.checked)} />
            ))}
          </div>
        </div>
        <FormGrid>
          <FieldShell label={t("tools.bank.accountType")}>
            <Select {...register("accountType")}>
              <option value="checking">{t("tools.bank.checking")}</option>
              <option value="savings">{t("tools.bank.savings")}</option>
              <option value="both">{t("tools.bank.both")}</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.bank.income")}>
            <Select {...register("income")}>
              <option value="under1000">Under $1,000</option>
              <option value="1000-2500">$1,000-$2,500</option>
              <option value="2500-5000">$2,500-$5,000</option>
              <option value="over5000">Over $5,000</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.bank.language")}>
            <Select {...register("language")}>
              <option value="both">Both</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </Select>
          </FieldShell>
        </FormGrid>
        <Checkbox label={t("tools.bank.sendMoney")} {...register("sendsMoney")} />
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result.length > 0 ? (
        <div className="grid gap-4">
          <WarningList items={[t("tools.bank.requirementsVary"), t("tools.bank.checkCasher")]} />
          <h2 className="font-display text-heading-1 text-ink-900">{t("tools.bank.matches")}</h2>
          <div className="grid gap-3">
            {result.map((bank) => (
              <Panel key={bank.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{bank.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{bank.features[locale].join(" · ")}</p>
                  </div>
                  <a className="text-sm font-bold text-brand-600 hover:text-brand-700" href={bank.sourceUrl} rel="noreferrer" target="_blank">
                    {t("common.learnMore")}
                  </a>
                </div>
                <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                  <span>{t("tools.bank.fee")}: {formatCurrencyPrecise(bank.monthlyFee, locale)}</span>
                  <span>{t("tools.bank.minBalance")}: {formatCurrency(bank.minBalance, locale)}</span>
                  <span>Mobile: {bank.mobileRating}/5</span>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

const creditSchema = z.object({
  visaType: z.string(),
  timeInUs: z.enum(["lt6", "6to12", "1to2", "2to5", "over5"]),
  hasBankAccount: z.boolean(),
  tin: z.enum(["ssn", "itin", "neither"]),
  scoreStatus: z.enum(["none", "under580", "580to669", "670to739", "740plus"]),
  budget: z.coerce.number().min(0).max(300),
  hasForeignCredit: z.boolean()
});

type CreditForm = z.infer<typeof creditSchema>;

function CreditRoadmapTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [result, setResult] = useState<ReturnType<typeof buildCreditRoadmap> | null>(null);
  const {register, handleSubmit} = useForm<CreditForm>({
    resolver: zodResolver(creditSchema),
    defaultValues: {
      visaType: "other",
      timeInUs: "lt6",
      hasBankAccount: false,
      tin: "itin",
      scoreStatus: "none",
      budget: 50,
      hasForeignCredit: false
    }
  });

  return (
    <Panel className="grid gap-6">
      <form className="grid gap-5" onSubmit={handleSubmit((data) => setResult(buildCreditRoadmap(data)))}>
        <FormGrid>
          <FieldShell label={t("tools.credit.visa")}>
            <Select {...register("visaType")}>
              {["DACA", "TPS", "H-1B", "H-2A", "F-1", "Green Card", "Other"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.time")}>
            <Select {...register("timeInUs")}>
              <option value="lt6">Less than 6 months</option>
              <option value="6to12">6-12 months</option>
              <option value="1to2">1-2 years</option>
              <option value="2to5">2-5 years</option>
              <option value="over5">Over 5 years</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.tin")}>
            <Select {...register("tin")}>
              <option value="ssn">SSN</option>
              <option value="itin">ITIN</option>
              <option value="neither">Neither</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.score")}>
            <Select {...register("scoreStatus")}>
              <option value="none">No score yet</option>
              <option value="under580">Below 580</option>
              <option value="580to669">580-669</option>
              <option value="670to739">670-739</option>
              <option value="740plus">740+</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.budget")}>
            <Input type="range" min="0" max="300" {...register("budget")} />
          </FieldShell>
        </FormGrid>
        <Checkbox label={t("tools.credit.bank")} {...register("hasBankAccount")} />
        <Checkbox label={t("tools.credit.foreignCredit")} {...register("hasForeignCredit")} />
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div className="grid gap-5">
          <WarningList items={[t("tools.credit.noGuarantee")]} />
          <section>
            <h2 className="font-display text-heading-1 text-ink-900">{t("tools.credit.roadmap")}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              {result.phases.map((phase) => (
                <Panel key={phase.id}>
                  <h3 className="font-bold capitalize">{phase.id}</h3>
                  <p className="mt-2 text-sm text-slate-600">{phase.durationMonths} months · {phase.impact}</p>
                </Panel>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-display text-heading-1 text-ink-900">{t("tools.credit.timeline")}</h2>
            <CreditTimelineChart data={result.timeline} />
          </section>
          <section>
            <h2 className="font-display text-heading-1 text-ink-900">{t("tools.credit.products")}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {result.products.map((product) => (
                <Panel key={product.id}>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{product.bestFor[locale]}</p>
                </Panel>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </Panel>
  );
}

const remittanceSchema = z.object({
  amount: z.coerce.number().min(1).max(10000),
  country: z.string(),
  method: z.enum(["bank", "wallet", "cash", "any"]),
  frequency: z.enum(["once", "weekly", "monthly", "biweekly"])
});

type RemittanceForm = z.infer<typeof remittanceSchema>;

function RemittanceTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [result, setResult] = useState<ReturnType<typeof compareRemittances> | null>(null);
  const {register, handleSubmit} = useForm<RemittanceForm>({
    resolver: zodResolver(remittanceSchema),
    defaultValues: {amount: 300, country: "Mexico", method: "any", frequency: "monthly"}
  });

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) =>
          setResult(
            compareRemittances({
              amount: data.amount,
              country: data.country as RemittanceCountry,
              method: data.method as DeliveryMethod,
              frequency: data.frequency as Frequency
            })
          )
        )}
      >
        <FormGrid>
          <FieldShell label={t("tools.remit.amount")}>
            <Input type="number" {...register("amount")} />
          </FieldShell>
          <FieldShell label={t("tools.remit.country")}>
            <Select {...register("country")}>
              {remittanceCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.remit.method")}>
            <Select {...register("method")}>
              <option value="any">{t("tools.remit.any")}</option>
              <option value="bank">{t("tools.remit.bank")}</option>
              <option value="wallet">{t("tools.remit.wallet")}</option>
              <option value="cash">{t("tools.remit.cash")}</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.remit.frequency")}>
            <Select {...register("frequency")}>
              <option value="once">{t("tools.remit.once")}</option>
              <option value="weekly">{t("tools.remit.weekly")}</option>
              <option value="monthly">{t("tools.remit.monthly")}</option>
              <option value="biweekly">{t("tools.remit.biweekly")}</option>
            </Select>
          </FieldShell>
        </FormGrid>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div className="grid gap-4">
          <WarningList items={[t("tools.remit.static")]} />
          <Stat label={t("tools.remit.annualSavings")} value={formatCurrencyPrecise(result.annualSavings, locale)} tone="success" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  {["Service", t("tools.remit.fee"), t("tools.remit.rate"), t("tools.remit.received"), t("tools.remit.totalCost"), "Speed"].map((head) => (
                    <th className="p-3 font-bold text-slate-700" key={head}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.results.map((row) => (
                  <tr className="border-b border-slate-100" key={row.service}>
                    <td className="p-3 font-bold">{row.service}</td>
                    <td className="p-3">{formatCurrencyPrecise(row.fee, locale)}</td>
                    <td className="p-3">{row.exchangeRate.toFixed(3)}</td>
                    <td className="p-3">{row.amountReceived.toFixed(2)}</td>
                    <td className="p-3">{formatCurrencyPrecise(row.totalCost, locale)}</td>
                    <td className="p-3">{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

const affordabilitySchema = z.object({
  city: z.string(),
  income: z.coerce.number().min(0).max(100000),
  householdSize: z.coerce.number().min(1).max(8),
  remittances: z.coerce.number().min(0),
  healthInsurance: z.enum(["employer", "marketplace", "uninsured"]),
  hasChildren: z.boolean(),
  status: z.enum(["documented", "undocumented", "mixed"]),
  debtPayments: z.coerce.number().min(0),
  immigrationSavingsGoal: z.coerce.number().min(0),
  goalMonths: z.coerce.number().min(1).max(120)
});

type AffordabilityForm = z.infer<typeof affordabilitySchema>;

function AffordabilityTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [statusInput, setStatusInput] = useState<ImmigrationStatusForBenefits>("mixed");
  const [result, setResult] = useState<ReturnType<typeof calculateAffordability> | null>(null);
  const {register, handleSubmit} = useForm<AffordabilityForm>({
    resolver: zodResolver(affordabilitySchema),
    defaultValues: {
      city: "NYC",
      income: 3500,
      householdSize: 3,
      remittances: 200,
      healthInsurance: "uninsured",
      hasChildren: false,
      status: "mixed",
      debtPayments: 150,
      immigrationSavingsGoal: 760,
      goalMonths: 12
    }
  });

  const chartData = useMemo(
    () =>
      result?.lines
        .filter((line) => line.amount > 0)
        .map((line) => ({name: budgetLabels[line.id] ?? line.id, value: Math.round(line.amount)})) ?? [],
    [result]
  );

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          setStatusInput(data.status);
          setResult(calculateAffordability(data));
        })}
      >
        <FormGrid>
          <FieldShell label={t("tools.afford.city")}>
            <Select {...register("city")}>
              {cityCostPresets.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.afford.income")}>
            <Input type="number" {...register("income")} />
          </FieldShell>
          <FieldShell label={t("tools.afford.household")}>
            <Input type="number" {...register("householdSize")} />
          </FieldShell>
          <FieldShell label={t("tools.afford.remittances")}>
            <Input type="number" {...register("remittances")} />
          </FieldShell>
          <FieldShell label={t("tools.afford.health")}>
            <Select {...register("healthInsurance")}>
              <option value="employer">Employer</option>
              <option value="marketplace">Marketplace</option>
              <option value="uninsured">Uninsured</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.afford.status")}>
            <Select {...register("status")}>
              <option value="documented">Documented</option>
              <option value="undocumented">Undocumented</option>
              <option value="mixed">Mixed household</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.afford.debt")}>
            <Input type="number" {...register("debtPayments")} />
          </FieldShell>
          <FieldShell label={t("tools.afford.goal")}>
            <Input type="number" {...register("immigrationSavingsGoal")} />
          </FieldShell>
          <FieldShell label={t("tools.afford.months")}>
            <Input type="number" {...register("goalMonths")} />
          </FieldShell>
        </FormGrid>
        <Checkbox label={t("tools.afford.children")} {...register("hasChildren")} />
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div className="grid gap-5">
          <Stat
            label={t("common.results")}
            tone={result.status === "workable" ? "success" : result.status === "tight" ? "warning" : "danger"}
            value={t(`tools.afford.${result.status}`)}
          />
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <BudgetPieChart data={chartData} />
            <div className="grid gap-2">
              {result.lines
                .filter((line) => line.amount > 0)
                .map((line) => (
                  <div className="flex justify-between rounded-md border border-slate-200 bg-slate-50 p-3 text-sm" key={line.id}>
                    <span>{budgetLabels[line.id] ?? line.id}</span>
                    <strong>{formatCurrency(line.amount, locale)}</strong>
                  </div>
                ))}
            </div>
          </div>
          <WarningList
            items={[
              `${t("tools.afford.lease")}: ${formatCurrency(result.leaseSavings, locale)}`,
              benefitEligibilityNotes[statusInput][locale],
              "FeedingAmerica.org · findahealthcenter.hrsa.gov · LawHelp.org"
            ]}
          />
        </div>
      ) : null}
    </Panel>
  );
}
