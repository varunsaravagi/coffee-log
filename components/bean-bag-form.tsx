"use client";

import { useActionState } from "react";

import { createBeanBag, type FormState } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: FormState = {};

export function BeanBagForm() {
  const [state, formAction] = useActionState(createBeanBag, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="brand">
            Brand
          </label>
          <input className="field" id="brand" name="brand" placeholder="Sey, Onyx, local roaster..." />
        </div>
        <div>
          <label className="label" htmlFor="beanName">
            Bean name
          </label>
          <input className="field" id="beanName" name="beanName" placeholder="Colombia El Paraiso" />
        </div>
        <div>
          <label className="label" htmlFor="logDate">
            Log date
          </label>
          <input
            className="field"
            defaultValue={new Date().toISOString().slice(0, 10)}
            id="logDate"
            name="logDate"
            type="date"
          />
        </div>
        <div>
          <label className="label" htmlFor="roastDate">
            Roast date
          </label>
          <input className="field" id="roastDate" name="roastDate" type="date" />
        </div>
        <div>
          <label className="label" htmlFor="bagQuantityGrams">
            Bag quantity (g)
          </label>
          <input className="field" id="bagQuantityGrams" min="1" name="bagQuantityGrams" type="number" />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="flavorProfile">
            Flavor profile
          </label>
          <input
            className="field"
            id="flavorProfile"
            name="flavorProfile"
            placeholder="Berry jam, cocoa nibs, candied orange"
          />
        </div>
        <div>
          <label className="label" htmlFor="price">
            Price (USD)
          </label>
          <input className="field" id="price" min="0.01" name="price" step="0.01" type="number" />
        </div>
        <div>
          <label className="label" htmlFor="photo">
            Bean bag photo
          </label>
          <input
            accept="image/*"
            capture="environment"
            className="field"
            id="photo"
            name="photo"
            type="file"
          />
        </div>
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <div className="sticky bottom-4">
        <SubmitButton label="Save bean bag" pendingLabel="Saving bean bag..." />
      </div>
    </form>
  );
}
