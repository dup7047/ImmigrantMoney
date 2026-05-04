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
  /**
   * Step index to restore on mount. Use with `onStepChange` so a parent can
   * remember where the user was if the wizard unmounts (e.g. after submit
   * → result panel, then click Edit → wizard remounts at the last step).
   */
  initialStep?: number;
  /** Called whenever the active step changes (after Next or Back). */
  onStepChange?: (index: number) => void;
};
