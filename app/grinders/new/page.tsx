import { GrinderForm } from "@/components/grinder-form";
import { getGrinders } from "@/lib/queries";

export default async function NewGrinderPage() {
  const grinders = await getGrinders();

  return (
    <main className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">New grinder</p>
        <h2 className="mt-3 text-3xl font-bold">Add a grinder once, then reuse it in brew logs.</h2>
        <div className="mt-6">
          <GrinderForm />
        </div>
      </section>
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <h3 className="text-2xl font-bold">Saved grinders</h3>
        <div className="mt-5 space-y-3">
          {grinders.length ? (
            grinders.map((grinder) => (
              <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4" key={grinder.id}>
                <p className="text-lg font-bold">{grinder.name}</p>
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

