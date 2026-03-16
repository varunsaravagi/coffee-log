"use client";

import { useActionState } from "react";

import { createGrinder, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Grinder } from "@/lib/schema";

const initialState: FormState = {};

type GrinderFormProps = {
  action?: (state: FormState, formData: FormData) => Promise<FormState>;
  initialData?: Grinder;
  submitLabel?: string;
  pendingLabel?: string;
};

export function GrinderForm({
  action = createGrinder,
  initialData,
  submitLabel = "Save grinder",
  pendingLabel = "Saving grinder...",
}: GrinderFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Grinder name
        </label>
        <input
          className="field"
          defaultValue={initialData?.name ?? ""}
          id="name"
          name="name"
          placeholder="Lagom Mini"
        />
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
    </form>
  );
}
