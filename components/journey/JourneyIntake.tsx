"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {Check} from "lucide-react";
import {useTranslations} from "next-intl";
import {useForm, useWatch, type Control} from "react-hook-form";
import {z} from "zod";
import {usePathname, useRouter} from "@/i18n/navigation";
import {GOAL_KEYS, PRIORITY_KEYS, STATUS_KEYS, type GoalKey, type PriorityKey, type StatusKey} from "@/lib/journey/recommend";
import {cn} from "@/lib/utils";
import {Wizard} from "@/components/wizard";
import type {WizardStepDef} from "@/components/wizard";

const intakeSchema = z.object({
  goal: z.enum(GOAL_KEYS),
  status: z.enum(STATUS_KEYS),
  priority: z.enum(PRIORITY_KEYS)
});

type IntakeValues = z.infer<typeof intakeSchema>;

type IntakeProps = {
  initial?: Partial<IntakeValues>;
};

function OptionCard({
  name,
  value,
  control,
  label,
  onChange
}: {
  name: keyof IntakeValues;
  value: string;
  control: Control<IntakeValues>;
  label: string;
  onChange: (value: string) => void;
}) {
  const current = useWatch({control, name});
  const checked = current === value;

  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
        checked
          ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-100"
          : "border-ink-200 bg-white hover:border-brand-200 hover:bg-brand-50/40"
      )}
    >
      <input
        checked={checked}
        className="sr-only"
        name={name}
        onChange={() => onChange(value)}
        type="radio"
        value={value}
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
          checked ? "border-brand-600 bg-brand-600 text-white" : "border-ink-300 bg-white"
        )}
      >
        {checked ? <Check className="h-3 w-3" /> : null}
      </span>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
    </label>
  );
}

function RadioGroupStep({
  control,
  name,
  options,
  setValue
}: {
  control: Control<IntakeValues>;
  name: keyof IntakeValues;
  options: {value: string; label: string}[];
  setValue: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <OptionCard
          control={control}
          key={option.value}
          label={option.label}
          name={name}
          onChange={setValue}
          value={option.value}
        />
      ))}
    </div>
  );
}

export function JourneyIntake({initial}: IntakeProps) {
  const t = useTranslations("journey.intake");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<IntakeValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      goal: (initial?.goal as GoalKey) ?? undefined,
      status: (initial?.status as StatusKey) ?? undefined,
      priority: (initial?.priority as PriorityKey) ?? undefined
    },
    mode: "onChange"
  });

  const {control, setValue} = form;

  const goalOptions = GOAL_KEYS.map((value) => ({value, label: t(`q1.options.${value}`)}));
  const statusOptions = STATUS_KEYS.map((value) => ({value, label: t(`q2.options.${value}`)}));
  const priorityOptions = PRIORITY_KEYS.map((value) => ({value, label: t(`q3.options.${value}`)}));

  const steps: WizardStepDef<IntakeValues>[] = [
    {
      id: "goal",
      title: t("q1.label"),
      fieldNames: ["goal"],
      render: (
        <RadioGroupStep
          control={control}
          name="goal"
          options={goalOptions}
          setValue={(value) => setValue("goal", value as GoalKey, {shouldValidate: true})}
        />
      )
    },
    {
      id: "status",
      title: t("q2.label"),
      fieldNames: ["status"],
      render: (
        <RadioGroupStep
          control={control}
          name="status"
          options={statusOptions}
          setValue={(value) => setValue("status", value as StatusKey, {shouldValidate: true})}
        />
      )
    },
    {
      id: "priority",
      title: t("q3.label"),
      fieldNames: ["priority"],
      render: (
        <RadioGroupStep
          control={control}
          name="priority"
          options={priorityOptions}
          setValue={(value) => setValue("priority", value as PriorityKey, {shouldValidate: true})}
        />
      )
    }
  ];

  function onSubmit(values: IntakeValues) {
    const params = new URLSearchParams({
      goal: values.goal,
      status: values.status,
      priority: values.priority
    });
    router.push(`${pathname}/results?${params.toString()}`);
  }

  return <Wizard form={form} onSubmit={onSubmit} steps={steps} submitLabel={t("submit")} />;
}
