import Link from "next/link";

import { getGrinders } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export default async function GrindersPage() {
  const grinders = await getGrinders();

  return (
    <main className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Grinders</p>
        <h2 className="mt-3 text-3xl font-bold">Manage saved grinders</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Add a grinder once, edit it later, and reuse it in grind-setting logs.
        </p>
        <div className="mt-6">
          <Link className="primary-button inline-flex" href="/grinders/new">
            Add grinder
          </Link>
        </div>
      </section>
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold">Saved grinders</h3>
          <span className="rounded-full bg-[#efe3d5] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            {grinders.length} saved
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {grinders.length ? (
            grinders.map((grinder) => (
              <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4" key={grinder.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{grinder.name}</p>
                    <p className="text-sm text-[var(--muted)]">Updated {formatDateTime(grinder.updatedAt)}</p>
                  </div>
                  <Link className="text-sm font-semibold text-[var(--accent)]" href={`/grinders/${grinder.id}/edit`}>
                    Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-5 text-sm text-[var(--muted)]">
              No grinders saved yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

