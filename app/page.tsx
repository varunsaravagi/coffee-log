import Link from "next/link";

import { BeanCard } from "@/components/bean-card";
import { getRecentBeans } from "@/lib/queries";

export default async function HomePage() {
  const recentBeans = await getRecentBeans();

  return (
    <main className="space-y-5">
      <section className="rounded-[2rem] panel px-5 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link className="primary-button text-center" href="/beans/new">
            Add new bean
          </Link>
          <Link className="secondary-button text-center font-semibold" href="/search">
            Search beans
          </Link>
          <Link className="secondary-button text-center font-semibold" href="/grinders">
            Add grinder
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Logged so far</h2>
        {recentBeans.length ? (
          <div className="grid gap-4">{recentBeans.map((bean) => <BeanCard key={bean.id} bean={bean} />)}</div>
        ) : (
          <div className="rounded-[2rem] panel px-6 py-10 text-center text-[var(--muted)]">
            No beans logged yet. Start by adding the bag you are currently brewing.
          </div>
        )}
      </section>
    </main>
  );
}
