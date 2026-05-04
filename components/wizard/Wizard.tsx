"use client";

import {ArrowLeft, ArrowRight, Check, Loader2} from "lucide-react";
import {useTranslations} from "next-intl";
import {useEffect, useRef, useState} from "react";
import type {FieldValues} from "react-hook-form";
import {FormProvider} from "react-hook-form";
import {Button} from "../ui/Button";
import {cn} from "@/lib/utils";
import type {WizardProps} from "./types";

export function Wizard<TValues extends FieldValues>({
  form,
  steps,
  onSubmit,
  submitLabel,
  reviewTitle,
  reviewRender
}: WizardProps<TValues>) {
  const t = useTranslations("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const totalSteps = steps.length + (reviewRender ? 1 : 0);
  const isReviewStep = reviewRender ? stepIndex === steps.length : false;
  const isFinalStep = stepIndex === totalSteps - 1;
  const currentStep = !isReviewStep ? steps[stepIndex] : undefined;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex]);

  async function handleNext() {
    if (currentStep) {
      const valid = await form.trigger(currentStep.fieldNames);
      if (!valid) return;
    }
    if (isFinalStep) {
      const values = form.getValues();
      setSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setDirection("forward");
    setStepIndex((index) => Math.min(index + 1, totalSteps - 1));
  }

  function handleBack() {
    setDirection("back");
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  return (
    <FormProvider {...form}>
      <div className="grid gap-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-card md:p-8">
        <ol aria-label={t("progress")} className="flex items-center gap-2" role="list">
          {Array.from({length: totalSteps}).map((_, index) => {
            const isActive = index === stepIndex;
            const isComplete = index < stepIndex;
            return (
              <li
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  isComplete ? "bg-brand-600" : isActive ? "bg-brand-400" : "bg-ink-200"
                )}
                key={index}
              />
            );
          })}
        </ol>
        <p className="text-overline font-semibold uppercase text-brand-700">
          {t("progress")} {stepIndex + 1} / {totalSteps}
        </p>

        <div
          className={cn(
            "grid gap-5 motion-safe:animate-stepIn",
            direction === "back" && "motion-safe:animate-stepInBack"
          )}
          key={stepIndex}
        >
          {currentStep ? (
            <>
              <div>
                <h2
                  className="font-display text-heading-1 tracking-tight text-ink-900 outline-none"
                  ref={headingRef}
                  tabIndex={-1}
                >
                  {currentStep.title}
                </h2>
                {currentStep.description ? (
                  <p className="mt-1 text-body text-ink-600">{currentStep.description}</p>
                ) : null}
              </div>
              <div className="grid gap-4">{currentStep.render}</div>
            </>
          ) : null}

          {isReviewStep && reviewRender ? (
            <>
              <div>
                <h2
                  className="font-display text-heading-1 tracking-tight text-ink-900 outline-none"
                  ref={headingRef}
                  tabIndex={-1}
                >
                  {reviewTitle ?? t("reviewTitle")}
                </h2>
              </div>
              <div className="grid gap-4">{reviewRender(form.getValues())}</div>
            </>
          ) : null}
        </div>

        {/* Desktop nav */}
        <div className="hidden flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5 md:flex">
          <Button
            disabled={stepIndex === 0 || submitting}
            onClick={handleBack}
            type="button"
            variant="secondary"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {t("back")}
          </Button>
          <Button disabled={submitting} onClick={handleNext} type="button">
            {submitting ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : isFinalStep ? (
              <Check aria-hidden="true" className="h-4 w-4" />
            ) : null}
            {isFinalStep ? submitLabel ?? t("submit") : t("next")}
            {!isFinalStep && !submitting ? (
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            ) : null}
          </Button>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className="sticky bottom-0 z-30 -mx-4 mt-4 flex items-center justify-between gap-3 border-t border-ink-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] md:hidden"
        style={{transform: "translateZ(0)"}}
      >
        <Button
          className="flex-1"
          disabled={stepIndex === 0 || submitting}
          onClick={handleBack}
          type="button"
          variant="secondary"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {t("back")}
        </Button>
        <Button className="flex-1" disabled={submitting} onClick={handleNext} type="button">
          {submitting ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : isFinalStep ? (
            <Check aria-hidden="true" className="h-4 w-4" />
          ) : null}
          {isFinalStep ? submitLabel ?? t("submit") : t("next")}
          {!isFinalStep && !submitting ? (
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          ) : null}
        </Button>
      </div>
    </FormProvider>
  );
}
