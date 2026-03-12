"use client";

import { useActionState } from "react";

import { addGrindSetting, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Grinder } from "@/lib/schema";

const initialState: FormState = {};

export function GrindSettingForm({
  beanBagId,
  grinders,
}: {
  beanBagId: number;
  grinders: Grinder[];
}) {
  const [state, formAction] = useActionState(addGrindSetting, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="beanBagId" type="hidden" value={beanBagId} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="grinderId">
            Grinder
          </label>
          <select className="field" defaultValue="" id="grinderId" name="grinderId">
            <option value="" disabled>
              Select a grinder
            </option>
            {grinders.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>
                {grinder.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="settingValue">
            Grind setting
          </label>
          <input className="field" id="settingValue" name="settingValue" placeholder="6.5" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="notes">
          Notes
        </label>
        <textarea
          className="field min-h-28"
          id="notes"
          name="notes"
          placeholder="18g in, 1:2 ratio, slightly slow at this setting..."
        />
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label="Add grind setting" pendingLabel="Saving setting..." />
    </form>
  );
}
