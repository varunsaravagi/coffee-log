"use client";

import { useActionState } from "react";

import { createGrinder, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: FormState = {};

export function GrinderForm() {
  const [state, formAction] = useActionState(createGrinder, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Grinder name
        </label>
        <input className="field" id="name" name="name" placeholder="Lagom Mini" />
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label="Save grinder" pendingLabel="Saving grinder..." />
    </form>
  );
}

