"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button w-full sm:w-auto" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

