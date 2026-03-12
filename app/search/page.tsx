import { BeanCard } from "@/components/bean-card";
import { searchBeans } from "@/lib/queries";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; beanName?: string; grinderName?: string }>;
}) {
  const params = await searchParams;
  const results = await searchBeans({
    brand: params.brand?.trim() || undefined,
    beanName: params.beanName?.trim() || undefined,
    grinderName: params.grinderName?.trim() || undefined,
  });

  return (
    <main className="space-y-5">
      <section className="rounded-[2rem] panel px-5 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Search history</p>
        <h2 className="mt-3 text-3xl font-bold">Find a bean and reuse the setting that matched it.</h2>
        <form className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <label className="label" htmlFor="brand">
              Brand
            </label>
            <input className="field" defaultValue={params.brand} id="brand" name="brand" placeholder="Sey" />
          </div>
          <div>
            <label className="label" htmlFor="beanName">
              Bean name
            </label>
            <input
              className="field"
              defaultValue={params.beanName}
              id="beanName"
              name="beanName"
              placeholder="El Paraiso"
            />
          </div>
          <div>
            <label className="label" htmlFor="grinderName">
              Grinder
            </label>
            <input
              className="field"
              defaultValue={params.grinderName}
              id="grinderName"
              name="grinderName"
              placeholder="Lagom"
            />
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-3">
            <button className="primary-button" type="submit">
              Search
            </button>
            <a className="secondary-button" href="/search">
              Clear filters
            </a>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Results</h3>
          <span className="text-sm font-semibold text-[var(--muted)]">{results.length} beans</span>
        </div>
        {results.length ? (
          <div className="grid gap-4">{results.map((bean) => <BeanCard key={bean.id} bean={bean} />)}</div>
        ) : (
          <div className="rounded-[2rem] panel px-6 py-10 text-center text-[var(--muted)]">
            No beans matched these filters yet.
          </div>
        )}
      </section>
    </main>
  );
}
