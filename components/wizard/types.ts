import type {ReactNode} from "react";
import type {FieldValues, Path, UseFormReturn} from "react-hook-form";

export type WizardStepDef<TValues extends FieldValues> = {
  id: string;
  title: string;
  description?: string;
  fieldNames: Path<TValues>[];
  render: ReactNode;
};

export type WizardProps<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>;
  steps: WizardStepDef<TValues>[];
  onSubmit: (values: TValues) => void | Promise<void>;
  submitLabel?: string;
  reviewTitle?: string;
  reviewRender?: (values: TValues) => ReactNode;
};
