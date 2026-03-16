import Link from "next/link";

import type { ChangeLog } from "@/lib/schema";
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils";

const fieldLabels: Record<string, string> = {
  brand: "Brand",
  beanName: "Bean name",
  logDate: "Log date",
  roastDate: "Roast date",
  flavorProfile: "Flavor profile",
  bagQuantityGrams: "Bag quantity",
  price: "Price",
  photoPath: "Photo",
  name: "Grinder name",
  grinderName: "Grinder",
  settingValue: "Grind setting",
  notes: "Notes",
};

function formatChangeValue(fieldName: string, value: string | null) {
  if (value === null || value === "") {
    return "Empty";
  }

  if (fieldName === "price") {
    return formatMoney(Number(value));
  }

  if (fieldName === "logDate" || fieldName === "roastDate") {
    return formatDate(value);
  }

  if (fieldName === "bagQuantityGrams") {
    return `${value}g`;
  }

  if (fieldName === "photoPath") {
    return "Updated photo";
  }

  return value;
}

function entryTitle(entry: ChangeLog) {
  if (entry.entityType === "bean") {
    return "Bean updated";
  }

  if (entry.entityType === "grind_setting") {
    return "Grind setting updated";
  }

  return "Grinder updated";
}

export function ChangeLogList({ entries }: { entries: ChangeLog[] }) {
  if (!entries.length) {
    return (
      <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-5 text-sm text-[var(--muted)]">
        No updates logged yet for this bean.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <article className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4" key={entry.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-bold">{entryTitle(entry)}</h4>
              <p className="text-sm text-[var(--muted)]">{formatDateTime(entry.changedAt)}</p>
            </div>
            {entry.entityType === "grind_setting" && entry.grinderId ? (
              <Link
                className="text-sm font-semibold text-[var(--accent)]"
                href={`/grinders/${entry.grinderId}/edit`}
              >
                {entry.entityName ?? "View grinder"}
              </Link>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            <span className="font-semibold text-[var(--foreground)]">
              {fieldLabels[entry.fieldName] ?? entry.fieldName}
            </span>
            : {formatChangeValue(entry.fieldName, entry.previousValue)} {"->"}{" "}
            {formatChangeValue(entry.fieldName, entry.nextValue)}
          </p>
        </article>
      ))}
    </div>
  );
}

