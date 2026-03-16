import Link from "next/link";
import { notFound } from "next/navigation";

import { updateGrinder } from "@/app/actions";
import { GrinderForm } from "@/components/grinder-form";
import { getGrinder } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export default async function EditGrinderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const grinder = await getGrinder(Number(id));

  if (!grinder) {
    notFound();
  }

  const action = updateGrinder.bind(null, grinder.id);

  return (
    <main className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Edit grinder</p>
        <h2 className="mt-3 text-3xl font-bold">{grinder.name}</h2>
        <div className="mt-6">
          <GrinderForm
            action={action}
            initialData={grinder}
            pendingLabel="Updating grinder..."
            submitLabel="Update grinder"
          />
        </div>
      </section>
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <h3 className="text-2xl font-bold">Timestamps</h3>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-[var(--muted)]">Created</dt>
            <dd>{formatDateTime(grinder.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--muted)]">Last updated</dt>
            <dd>{formatDateTime(grinder.updatedAt)}</dd>
          </div>
        </dl>
        <Link className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]" href="/grinders/new">
          Back to grinders
        </Link>
      </section>
    </main>
  );
}

