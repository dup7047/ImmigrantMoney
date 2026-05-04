"use client";

import dynamic from "next/dynamic";
import {zodResolver} from "@hookform/resolvers/zod";
import {track} from "@vercel/analytics";
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
import {Checkbox, FieldShell, Input, MoneyInput, Select} from "../ui/Field";
import {HelpTip} from "../ui/HelpTip";
import {Panel, Stat} from "../ui/Panel";
import {MethodologyNote} from "./MethodologyNote";
import {useResultScroll} from "./useResultScroll";

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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<WageForm>({
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
  const employmentType = watch("employmentType") as EmploymentType;
  const board = stateLaborBoards.find((item) => item.code === stateCode);
  const isHourly = employmentType === "hourly" || employmentType === "tipped" || employmentType === "cash";
  const isSalaried = employmentType === "salaried";
  const isTipped = employmentType === "tipped";
  const tracksOvertime = employmentType === "hourly" || employmentType === "tipped";

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
          track("tool_complete", {tool: "wage-theft-checker", locale});
          setResult(calculateWage({...data, employmentType: data.employmentType as EmploymentType, deductions}));
        })}
      >
        <FormGrid>
          {/* 1. Employment type first — drives everything else */}
          <FieldShell label={t("tools.wage.employmentType")} error={errors.employmentType?.message as string | undefined}>
            <Select {...register("employmentType")}>
              <option value="hourly">{t("tools.wage.hourly")}</option>
              <option value="salaried">{t("tools.wage.salaried")}</option>
              <option value="tipped">{t("tools.wage.tipped")}</option>
              <option value="cash">{t("tools.wage.cash")}</option>
            </Select>
          </FieldShell>
          {/* 2. State — needed for minimum-wage lookup */}
          <FieldShell label={t("fields.state")} error={errors.stateCode?.message as string | undefined}>
            <Select {...register("stateCode")}>
              {usStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </FieldShell>
          {/* 3. Pay basis — conditional on type */}
          {isHourly ? (
            <FieldShell label={t("tools.wage.hourlyRate")} error={errors.hourlyRate?.message as string | undefined}>
              <MoneyInput step="0.01" unit="/ hr" {...register("hourlyRate")} />
            </FieldShell>
          ) : null}
          {isSalaried ? (
            <FieldShell label={t("tools.wage.weeklySalary")} error={errors.weeklySalary?.message as string | undefined}>
              <MoneyInput step="0.01" unit="/ week" {...register("weeklySalary")} />
            </FieldShell>
          ) : null}
          {/* 4. Hours worked — only relevant for non-salaried */}
          {isHourly ? (
            <FieldShell label={t("tools.wage.hoursWorked")} error={errors.hoursWorked?.message as string | undefined}>
              <Input type="number" step="0.25" {...register("hoursWorked")} />
            </FieldShell>
          ) : null}
          {/* 5. Overtime — only hourly/tipped track it */}
          {tracksOvertime ? (
            <FieldShell label={t("tools.wage.overtimeHours")} error={errors.overtimeHours?.message as string | undefined}>
              <Input type="number" step="0.25" {...register("overtimeHours")} />
            </FieldShell>
          ) : null}
          {/* 6. Tips — only tipped */}
          {isTipped ? (
            <FieldShell label={t("tools.wage.tips")} error={errors.tips?.message as string | undefined}>
              <MoneyInput step="0.01" unit="/ week" {...register("tips")} />
            </FieldShell>
          ) : null}
          {/* 7. What was actually received — always asked */}
          <FieldShell label={t("tools.wage.actualPay")} error={errors.actualPay?.message as string | undefined}>
            <MoneyInput step="0.01" unit="/ week" {...register("actualPay")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.withholding")} error={errors.withholdingAmount?.message as string | undefined}>
            <MoneyInput step="0.01" unit="/ week" {...register("withholdingAmount")} />
          </FieldShell>
          <FieldShell label={t("tools.wage.benefits")} error={errors.benefitDeductions?.message as string | undefined}>
            <MoneyInput step="0.01" unit="/ week" {...register("benefitDeductions")} />
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
        <div ref={resultRef} className="grid gap-5">
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
          <MethodologyNote>
            <p>{t("tools.wage.methodology")}</p>
          </MethodologyNote>
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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, formState: {errors}} = useForm<ItinForm>({
    resolver: zodResolver(itinSchema),
    defaultValues: {status: "undocumented", tin: "itin", worked: "w2", withheld: "notSure", children: "no", stateCode: "CA"}
  });
  const statusKeys = ["undocumented", "daca", "tps", "workVisa", "student", "greenCard", "other"] as const;
  const tinKeys = ["ssn", "itin", "neither", "notSure"] as const;
  const workedKeys = ["w2", "cash", "no"] as const;
  const yesNoSureKeys = ["yes", "no", "notSure"] as const;
  const yesNoKeys = ["yes", "no"] as const;

  const fields = [
    <FieldShell key="status" label={t("tools.itin.status")} error={errors.status?.message as string | undefined}>
      <Select {...register("status")}>
        {statusKeys.map((value) => (
          <option key={value} value={value}>
            {t(`tools.itin.statusOptions.${value}`)}
          </option>
        ))}
      </Select>
    </FieldShell>,
    <FieldShell
      key="tin"
      label={t("tools.itin.tin")}
      tooltip={
        <HelpTip ariaLabel={t("tools.itin.tinHelp.aria")}>
          <p>{t("tools.itin.tinHelp.body")}</p>
        </HelpTip>
      }
      error={errors.tin?.message as string | undefined}
    >
      <Select {...register("tin")}>
        {tinKeys.map((value) => (
          <option key={value} value={value}>
            {t(`tools.itin.tinOptions.${value}`)}
          </option>
        ))}
      </Select>
    </FieldShell>,
    <FieldShell key="worked" label={t("tools.itin.worked")} error={errors.worked?.message as string | undefined}>
      <Select {...register("worked")}>
        {workedKeys.map((value) => (
          <option key={value} value={value}>
            {t(`tools.itin.workedOptions.${value}`)}
          </option>
        ))}
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
          track("tool_complete", {tool: "itin-tax-guide", locale});
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
        <div ref={resultRef} className="grid gap-4">
          {/* Summary of what the user answered, so the verdict makes sense in context */}
          <Panel className="border-ink-200 bg-ink-50">
            <h3 className="text-heading-3 text-ink-900">{t("tools.itin.summaryHeading")}</h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("tools.itin.status")}</dt>
                <dd className="text-right font-semibold text-ink-900">
                  {t(`tools.itin.statusOptions.${result.status as typeof statusKeys[number]}`)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("tools.itin.tin")}</dt>
                <dd className="text-right font-semibold text-ink-900">{t(`tools.itin.tinOptions.${result.tin}`)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("tools.itin.worked")}</dt>
                <dd className="text-right font-semibold text-ink-900">{t(`tools.itin.workedOptions.${result.worked}`)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("tools.itin.withheld")}</dt>
                <dd className="text-right font-semibold text-ink-900">{t(`fields.${result.withheld === "notSure" ? "notSure" : result.withheld}`)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("tools.itin.children")}</dt>
                <dd className="text-right font-semibold text-ink-900">{t(`fields.${result.children}`)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">{t("fields.state")}</dt>
                <dd className="text-right font-semibold text-ink-900">{result.stateCode}</dd>
              </div>
            </dl>
          </Panel>
          <h2 className="font-display text-heading-1 text-ink-900">{t("tools.itin.verdict")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Panel className="border-brand-100 bg-brand-50">
              <h3 className="font-bold text-brand-900">{t("tools.itin.fileRisks")}</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-brand-900">
                <li>{result.withheld === "yes" ? t("tools.itin.fileBenefit.withheld") : t("tools.itin.fileBenefit.compliance")}</li>
                <li>{t("tools.itin.privacyVolatile")}</li>
              </ul>
            </Panel>
            <Panel className="border-caution-200 bg-caution-50">
              <h3 className="font-bold text-caution-950">{t("tools.itin.dontFileRisks")}</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-caution-950">
                <li>{t("tools.itin.dontFile.losesRefund")}</li>
                <li>{t("tools.itin.dontFile.complianceIssue")}</li>
              </ul>
            </Panel>
          </div>
          <WarningList
            items={[
              result.tin === "ssn" ? t("tools.itin.ssnEligible") : t("tools.itin.ssnRequired"),
              t("tools.itin.vita")
            ]}
          />
          <p className="text-caption font-semibold text-ink-500">
            {t("common.lastReviewed")}: {new Date("2026-05-02").toLocaleDateString(locale)}
          </p>
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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, formState: {errors}} = useForm<UscisForm>({
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
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          track("tool_complete", {tool: "uscis-fee-calculator", locale});
          setResult(calculateUscisFees(data));
        })}
      >
        <FormGrid>
          <FieldShell
            label={t("tools.uscis.application")}
            hint={t("tools.uscis.applicationHint")}
            tooltip={
              <HelpTip ariaLabel={t("tools.uscis.applicationHelp.aria")}>
                <p>{t("tools.uscis.applicationHelp.body")}</p>
              </HelpTip>
            }
            error={errors.form?.message as string | undefined}
          >
            <Select {...register("form")}>
              {uscisFees.map((fee) => (
                <option key={fee.form} value={fee.form}>
                  {fee.form} - {fee.label[locale]}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.uscis.familyMembers")} error={errors.familyMembers?.message as string | undefined}>
            <Input type="number" {...register("familyMembers")} />
          </FieldShell>
          <FieldShell label={t("tools.uscis.savings")} error={errors.savings?.message as string | undefined}>
            <MoneyInput {...register("savings")} />
          </FieldShell>
          <FieldShell label={t("tools.uscis.monthlySavings")} error={errors.monthlySavings?.message as string | undefined}>
            <MoneyInput unit="/ mo" {...register("monthlySavings")} />
          </FieldShell>
        </FormGrid>
        <div className="grid gap-3 rounded-xl border border-ink-200 bg-ink-50 p-4">
          <p className="text-sm font-bold text-ink-900">{t("tools.uscis.waiverHeading")}</p>
          <label className="flex items-start gap-2 text-sm text-ink-700">
            <input
              className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
              type="checkbox"
              {...register("receivesPublicBenefit")}
            />
            <span>
              <span className="font-semibold text-ink-900">{t("tools.uscis.publicBenefit")}</span>
              <span className="block text-caption text-ink-500">{t("tools.uscis.publicBenefitHint")}</span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-ink-700">
            <input
              className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
              type="checkbox"
              {...register("lowIncome")}
            />
            <span>
              <span className="font-semibold text-ink-900">{t("tools.uscis.lowIncome")}</span>
              <span className="block text-caption text-ink-500">{t("tools.uscis.lowIncomeHint")}</span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-ink-700">
            <input
              className="mt-1 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
              type="checkbox"
              {...register("financialHardship")}
            />
            <span>
              <span className="font-semibold text-ink-900">{t("tools.uscis.hardship")}</span>
              <span className="block text-caption text-ink-500">{t("tools.uscis.hardshipHint")}</span>
            </span>
          </label>
          <a
            className="text-caption font-semibold text-brand-700 hover:text-brand-800"
            href="https://www.uscis.gov/g-1055"
            rel="noreferrer"
            target="_blank"
          >
            {t("tools.uscis.verifyG1055")} →
          </a>
        </div>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div ref={resultRef} className="grid gap-4">
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
          <MethodologyNote>
            <p>{t("tools.uscis.methodology")}</p>
          </MethodologyNote>
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
  const locale = useLocale() as Locale;
  const [flags, setFlags] = useState<string[]>([]);
  const [result, setResult] = useState<ReturnType<typeof calculateScamRisk> | null>(null);
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<ScamForm>({
    resolver: zodResolver(scamSchema),
    defaultValues: {category: "loan", apr: 36}
  });
  const category = watch("category") as ScamCategory;
  const flagIds: Record<ScamCategory, string[]> = {
    loan: ["feesHidden", "pressure", "licenseUnknown", "ssnEarly"],
    immigration: ["notario", "guarantee", "blankForms", "noAccreditation"],
    tax: ["largerRefund", "percentFee", "blankReturn", "noPtin"]
  };
  // i18n labels live under tools.scam.flags.<category>.<flagId>
  const flagLabel = (cat: ScamCategory, id: string): string => t(`tools.scam.flags.${cat}.${id}`);

  function toggleFlag(id: string, checked: boolean) {
    setFlags((current) => (checked ? [...current, id] : current.filter((item) => item !== id)));
  }

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          track("tool_complete", {tool: "scam-detector", locale});
          setResult(calculateScamRisk({...data, category, yesFlags: flags}));
        })}
      >
        <FormGrid>
          <FieldShell label={t("tools.scam.category")} error={errors.category?.message as string | undefined}>
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
            <FieldShell
              label={t("tools.scam.apr")}
              hint={t("tools.scam.aprHint")}
              tooltip={
                <HelpTip ariaLabel={t("tools.scam.aprHelp.aria")}>
                  <p>{t("tools.scam.aprHelp.body")}</p>
                </HelpTip>
              }
              error={errors.apr?.message as string | undefined}
            >
              <Input type="number" {...register("apr")} />
            </FieldShell>
          ) : null}
        </FormGrid>
        <div className="grid gap-2">
          {flagIds[category].map((id) => (
            <Checkbox
              checked={flags.includes(id)}
              key={id}
              label={flagLabel(category, id)}
              onChange={(event) => toggleFlag(id, event.target.checked)}
            />
          ))}
        </div>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div ref={resultRef} className="grid gap-4">
          <Stat
            label={t("tools.scam.score")}
            tone={result.level === "high" ? "danger" : result.level === "caution" ? "warning" : "success"}
            value={t(`tools.scam.${result.level}`)}
          />
          {flags.length > 0 ? (
            <div className="rounded-xl border border-caution-200 bg-caution-50 p-4">
              <h3 className="font-bold text-caution-950">{t("tools.scam.redFlags")}</h3>
              <ul className="mt-2 grid gap-1.5 text-sm text-caution-950">
                {flags.map((id) => (
                  <li className="flex gap-2" key={id}>
                    <span aria-hidden="true">⚠</span>
                    {flagLabel(category, id)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <WarningList
            items={[
              ...(result.notarioWarning ? [t("tools.scam.notario")] : []),
              ...(result.aprWarning ? [t("tools.scam.aprWarning")] : []),
              t("tools.scam.reportLinks")
            ]}
          />
          <MethodologyNote>
            <p>{t("tools.scam.methodology")}</p>
          </MethodologyNote>
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

type BankMatch = {bank: (typeof bankOptions)[number]; reasons: string[]};

function BankFinderTool() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [ids, setIds] = useState<BankIdType[]>(["passport"]);
  const [result, setResult] = useState<BankMatch[] | null>(null);
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, formState: {errors}} = useForm<BankForm>({
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
          track("tool_complete", {tool: "bank-without-ssn", locale});
          const matches: BankMatch[] = [];
          for (const bank of bankOptions) {
            const matchedIds = ids.filter((id) => bank.acceptedIds.includes(id));
            const idMatch = matchedIds.length > 0;
            const accountMatch =
              bank.accountTypes.includes(data.accountType) || bank.accountTypes.includes("both");
            const transferMatch = !data.sendsMoney || bank.internationalTransfers;
            const languageMatch = data.language !== "es" || bank.spanishSupport;
            if (!(idMatch && accountMatch && transferMatch && languageMatch)) continue;

            const reasons: string[] = [];
            for (const id of matchedIds) {
              reasons.push(t("tools.bank.matchAccepts", {id: idLabels[id]}));
            }
            reasons.push(
              t("tools.bank.matchAccount", {
                type: t(`tools.bank.${data.accountType}`)
              })
            );
            if (data.sendsMoney && bank.internationalTransfers) {
              reasons.push(t("tools.bank.matchTransfers"));
            }
            if (data.language === "es" && bank.spanishSupport) {
              reasons.push(t("tools.bank.matchSpanish"));
            }
            matches.push({bank, reasons});
          }
          setResult(matches);
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
          <FieldShell label={t("tools.bank.accountType")} error={errors.accountType?.message as string | undefined}>
            <Select {...register("accountType")}>
              <option value="checking">{t("tools.bank.checking")}</option>
              <option value="savings">{t("tools.bank.savings")}</option>
              <option value="both">{t("tools.bank.both")}</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.bank.income")} error={errors.income?.message as string | undefined}>
            <Select {...register("income")}>
              <option value="under1000">Under $1,000</option>
              <option value="1000-2500">$1,000-$2,500</option>
              <option value="2500-5000">$2,500-$5,000</option>
              <option value="over5000">Over $5,000</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.bank.language")} error={errors.language?.message as string | undefined}>
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
      {result !== null && result.length === 0 ? (
        <div ref={resultRef} className="grid gap-3 rounded-xl border border-caution-200 bg-caution-50 p-5">
          <h2 className="text-heading-3 text-ink-900">{t("tools.bank.noMatches")}</h2>
          <p className="text-sm text-ink-700">{t("tools.bank.adjustFilters")}</p>
        </div>
      ) : null}
      {result && result.length > 0 ? (
        <div ref={resultRef} className="grid gap-4">
          <WarningList items={[t("tools.bank.requirementsVary"), t("tools.bank.checkCasher")]} />
          <h2 className="font-display text-heading-1 text-ink-900">{t("tools.bank.matches")}</h2>
          <div className="grid gap-3">
            {result.map(({bank, reasons}) => (
              <Panel key={bank.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{bank.name}</h3>
                    <p className="mt-1 text-sm text-ink-600">{bank.features[locale].join(" · ")}</p>
                  </div>
                  <a className="text-sm font-bold text-brand-600 hover:text-brand-700" href={bank.sourceUrl} rel="noreferrer" target="_blank">
                    {t("common.learnMore")}
                  </a>
                </div>
                {reasons.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {reasons.map((reason) => (
                      <li
                        className="inline-flex items-center gap-1 rounded-full border border-positive-200 bg-positive-50 px-2.5 py-1 text-caption font-semibold text-positive-700"
                        key={reason}
                      >
                        <span aria-hidden="true">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-4 grid gap-2 text-sm text-ink-600 md:grid-cols-3">
                  <span>{t("tools.bank.fee")}: {formatCurrencyPrecise(bank.monthlyFee, locale)}</span>
                  <span>{t("tools.bank.minBalance")}: {formatCurrency(bank.minBalance, locale)}</span>
                  <span>{t("tools.bank.mobile")}: {bank.mobileRating}/5</span>
                </div>
              </Panel>
            ))}
          </div>
          <MethodologyNote>
            <p>{t("tools.bank.methodology")}</p>
          </MethodologyNote>
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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, watch, formState: {errors}} = useForm<CreditForm>({
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
  const budget = watch("budget");
  const totalMonths = result?.phases.reduce((sum, p) => sum + p.durationMonths, 0) ?? 0;

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          track("tool_complete", {tool: "credit-builder-roadmap", locale});
          setResult(buildCreditRoadmap(data));
        })}
      >
        <FormGrid>
          <FieldShell label={t("tools.credit.visa")} error={errors.visaType?.message as string | undefined}>
            <Select {...register("visaType")}>
              {["DACA", "TPS", "H-1B", "H-2A", "F-1", "Green Card", "Other"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.time")} error={errors.timeInUs?.message as string | undefined}>
            <Select {...register("timeInUs")}>
              <option value="lt6">Less than 6 months</option>
              <option value="6to12">6-12 months</option>
              <option value="1to2">1-2 years</option>
              <option value="2to5">2-5 years</option>
              <option value="over5">Over 5 years</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.tin")} error={errors.tin?.message as string | undefined}>
            <Select {...register("tin")}>
              <option value="ssn">SSN</option>
              <option value="itin">ITIN</option>
              <option value="neither">Neither</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.credit.score")} error={errors.scoreStatus?.message as string | undefined}>
            <Select {...register("scoreStatus")}>
              <option value="none">No score yet</option>
              <option value="under580">Below 580</option>
              <option value="580to669">580-669</option>
              <option value="670to739">670-739</option>
              <option value="740plus">740+</option>
            </Select>
          </FieldShell>
          <FieldShell
            label={`${t("tools.credit.budget")} — $${budget ?? 0}/mo`}
            error={errors.budget?.message as string | undefined}
          >
            <Input type="range" min="0" max="300" step="5" {...register("budget")} />
            <div className="flex justify-between text-caption text-ink-500" aria-hidden="true">
              <span>$0</span>
              <span>$50</span>
              <span>$100</span>
              <span>$200</span>
              <span>$300</span>
            </div>
          </FieldShell>
        </FormGrid>
        <Checkbox label={t("tools.credit.bank")} {...register("hasBankAccount")} />
        <Checkbox label={t("tools.credit.foreignCredit")} {...register("hasForeignCredit")} />
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div ref={resultRef} className="grid gap-5">
          <WarningList items={[t("tools.credit.noGuarantee")]} />
          <Stat
            label={t("tools.credit.totalDuration")}
            value={t("tools.credit.totalDurationValue", {months: totalMonths})}
          />
          <section>
            <h2 className="font-display text-heading-1 text-ink-900">{t("tools.credit.roadmap")}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              {result.phases.map((phase) => (
                <Panel key={phase.id}>
                  <h3 className="font-bold capitalize">{phase.id}</h3>
                  <p className="mt-2 text-sm text-ink-600">{phase.durationMonths} {t("tools.credit.months")} · {phase.impact}</p>
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
          <MethodologyNote>
            <p>{t("tools.credit.methodology")}</p>
          </MethodologyNote>
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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, formState: {errors}} = useForm<RemittanceForm>({
    resolver: zodResolver(remittanceSchema),
    defaultValues: {amount: 300, country: "Mexico", method: "any", frequency: "monthly"}
  });

  return (
    <Panel className="grid gap-6">
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((data) => {
          track("tool_complete", {tool: "remittance-calculator", locale});
          setResult(
            compareRemittances({
              amount: data.amount,
              country: data.country as RemittanceCountry,
              method: data.method as DeliveryMethod,
              frequency: data.frequency as Frequency
            })
          );
        })}
      >
        <FormGrid>
          <FieldShell label={t("tools.remit.amount")} error={errors.amount?.message as string | undefined}>
            <MoneyInput {...register("amount")} />
          </FieldShell>
          <FieldShell label={t("tools.remit.country")} error={errors.country?.message as string | undefined}>
            <Select {...register("country")}>
              {remittanceCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.remit.method")} error={errors.method?.message as string | undefined}>
            <Select {...register("method")}>
              <option value="any">{t("tools.remit.any")}</option>
              <option value="bank">{t("tools.remit.bank")}</option>
              <option value="wallet">{t("tools.remit.wallet")}</option>
              <option value="cash">{t("tools.remit.cash")}</option>
            </Select>
          </FieldShell>
          <FieldShell label={t("tools.remit.frequency")} error={errors.frequency?.message as string | undefined}>
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
        (() => {
          const sorted = [...result.results].sort((a, b) => a.totalCost - b.totalCost);
          return (
            <div ref={resultRef} className="grid gap-4">
              <WarningList items={[t("tools.remit.static")]} />
              <Stat
                label={t("tools.remit.annualSavings")}
                value={formatCurrencyPrecise(result.annualSavings, locale)}
                tone="success"
              />

              {/* Mobile: stacked cards, sorted cheapest first */}
              <div className="grid gap-3 md:hidden">
                {sorted.map((row, idx) => (
                  <div
                    className={`rounded-xl border p-4 ${
                      idx === 0
                        ? "border-positive-600 bg-positive-50 ring-2 ring-positive-200"
                        : "border-ink-200 bg-white"
                    }`}
                    key={row.service}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-heading-3 text-ink-900">{row.service}</span>
                      {idx === 0 ? (
                        <span className="rounded-full bg-positive-600 px-2.5 py-0.5 text-overline font-bold uppercase text-white">
                          {t("tools.remit.bestValue")}
                        </span>
                      ) : null}
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-ink-500">{t("tools.remit.totalCost")}</dt>
                      <dd className="text-right font-semibold text-ink-900">
                        {formatCurrencyPrecise(row.totalCost, locale)}
                      </dd>
                      <dt className="text-ink-500">{t("tools.remit.fee")}</dt>
                      <dd className="text-right">{formatCurrencyPrecise(row.fee, locale)}</dd>
                      <dt className="text-ink-500">{t("tools.remit.rate")}</dt>
                      <dd className="text-right">{row.exchangeRate.toFixed(3)}</dd>
                      <dt className="text-ink-500">{t("tools.remit.received")}</dt>
                      <dd className="text-right">{row.amountReceived.toFixed(2)}</dd>
                      <dt className="text-ink-500">{t("tools.remit.speed")}</dt>
                      <dd className="text-right">{row.speed}</dd>
                    </dl>
                  </div>
                ))}
              </div>

              <MethodologyNote>
                <p>{t("tools.remit.methodology")}</p>
              </MethodologyNote>

              {/* Desktop: table, sorted cheapest first */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      {[
                        t("tools.remit.service"),
                        t("tools.remit.fee"),
                        t("tools.remit.rate"),
                        t("tools.remit.received"),
                        t("tools.remit.totalCost"),
                        t("tools.remit.speed")
                      ].map((head) => (
                        <th className="p-3 font-bold text-ink-700" key={head}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((row, idx) => (
                      <tr
                        className={
                          idx === 0
                            ? "border-b border-positive-200 bg-positive-50"
                            : "border-b border-ink-100"
                        }
                        key={row.service}
                      >
                        <td className="p-3 font-bold">
                          <span className="inline-flex items-center gap-2">
                            {row.service}
                            {idx === 0 ? (
                              <span className="rounded-full bg-positive-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                                {t("tools.remit.bestValue")}
                              </span>
                            ) : null}
                          </span>
                        </td>
                        <td className="p-3">{formatCurrencyPrecise(row.fee, locale)}</td>
                        <td className="p-3">{row.exchangeRate.toFixed(3)}</td>
                        <td className="p-3">{row.amountReceived.toFixed(2)}</td>
                        <td className="p-3 font-semibold">{formatCurrencyPrecise(row.totalCost, locale)}</td>
                        <td className="p-3">{row.speed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()
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
  const resultRef = useResultScroll(result);
  const {register, handleSubmit, formState: {errors}} = useForm<AffordabilityForm>({
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
          track("tool_complete", {tool: "affordability-planner", locale});
          setStatusInput(data.status);
          setResult(calculateAffordability(data));
        })}
      >
        {/* Basic section: open by default — minimum needed for a useful answer */}
        <details className="group rounded-xl border border-ink-200 bg-white p-4 open:border-brand-200 open:bg-brand-50/30" open>
          <summary className="cursor-pointer list-none text-heading-3 text-ink-900 marker:hidden">
            <span className="flex items-center justify-between">
              {t("tools.afford.basicSection")}
              <span aria-hidden="true" className="text-brand-600 transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <div className="mt-4">
            <FormGrid>
              <FieldShell label={t("tools.afford.city")} error={errors.city?.message as string | undefined}>
                <Select {...register("city")}>
                  {cityCostPresets.map((city) => (
                    <option key={city.city} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </Select>
              </FieldShell>
              <FieldShell label={t("tools.afford.income")} error={errors.income?.message as string | undefined}>
                <MoneyInput unit="/ mo" {...register("income")} />
              </FieldShell>
              <FieldShell label={t("tools.afford.household")} error={errors.householdSize?.message as string | undefined}>
                <Input type="number" {...register("householdSize")} />
              </FieldShell>
              <FieldShell label={t("tools.afford.status")} error={errors.status?.message as string | undefined}>
                <Select {...register("status")}>
                  <option value="documented">Documented</option>
                  <option value="undocumented">Undocumented</option>
                  <option value="mixed">Mixed household</option>
                </Select>
              </FieldShell>
            </FormGrid>
          </div>
        </details>

        {/* Optional section: collapsed by default. The 30%-rent baseline still
            works without these; adding them makes the budget more accurate. */}
        <details className="group rounded-xl border border-ink-200 bg-white p-4 open:border-brand-200 open:bg-brand-50/30">
          <summary className="cursor-pointer list-none text-heading-3 text-ink-900 marker:hidden">
            <span className="flex items-center justify-between">
              <span>
                {t("tools.afford.optionalSection")}
                <span className="ml-2 text-caption font-normal text-ink-500">{t("tools.afford.optionalHint")}</span>
              </span>
              <span aria-hidden="true" className="text-brand-600 transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <div className="mt-4 grid gap-4">
            <FormGrid>
              <FieldShell label={t("tools.afford.remittances")} error={errors.remittances?.message as string | undefined}>
                <MoneyInput unit="/ mo" {...register("remittances")} />
              </FieldShell>
              <FieldShell label={t("tools.afford.health")} error={errors.healthInsurance?.message as string | undefined}>
                <Select {...register("healthInsurance")}>
                  <option value="employer">Employer</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="uninsured">Uninsured</option>
                </Select>
              </FieldShell>
              <FieldShell label={t("tools.afford.debt")} error={errors.debtPayments?.message as string | undefined}>
                <MoneyInput unit="/ mo" {...register("debtPayments")} />
              </FieldShell>
              <FieldShell label={t("tools.afford.goal")} error={errors.immigrationSavingsGoal?.message as string | undefined}>
                <MoneyInput {...register("immigrationSavingsGoal")} />
              </FieldShell>
              <FieldShell label={t("tools.afford.months")} error={errors.goalMonths?.message as string | undefined}>
                <Input type="number" {...register("goalMonths")} />
              </FieldShell>
            </FormGrid>
            <Checkbox label={t("tools.afford.children")} {...register("hasChildren")} />
          </div>
        </details>
        <Button type="submit">{t("common.calculate")}</Button>
      </form>
      {result ? (
        <div ref={resultRef} className="grid gap-5">
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
          <MethodologyNote>
            <p>{t("tools.afford.methodology")}</p>
          </MethodologyNote>
        </div>
      ) : null}
    </Panel>
  );
}
