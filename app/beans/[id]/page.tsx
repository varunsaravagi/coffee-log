import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GrindSettingForm } from "@/components/grind-setting-form";
import { getBeanBag, getGrinders } from "@/lib/queries";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function BeanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [bean, grinders] = await Promise.all([getBeanBag(Number(id)), getGrinders()]);

  if (!bean) {
    notFound();
  }

  return (
    <main className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <section className="overflow-hidden rounded-[2rem] panel">
        {bean.photoPath ? (
          <div className="relative h-72 w-full">
            <Image
              alt={`${bean.brand} ${bean.beanName}`}
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={bean.photoPath}
            />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center bg-[#e7d8c5] text-[var(--muted)]">
            No photo saved for this bag yet.
          </div>
        )}
        <div className="space-y-5 px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)]">{bean.brand}</p>
              <h2 className="mt-2 text-3xl font-bold">{bean.beanName}</h2>
            </div>
            <Link className="secondary-button text-sm font-semibold" href="/search">
              Search all beans
            </Link>
          </div>
          <p className="text-base leading-7 text-[var(--muted)]">{bean.flavorProfile}</p>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Log date</dt>
              <dd className="mt-2 text-lg font-bold">{formatDate(bean.logDate)}</dd>
            </div>
            <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Roast date</dt>
              <dd className="mt-2 text-lg font-bold">{formatDate(bean.roastDate)}</dd>
            </div>
            <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Bag size</dt>
              <dd className="mt-2 text-lg font-bold">{bean.bagQuantityGrams}g</dd>
            </div>
            <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Price</dt>
              <dd className="mt-2 text-lg font-bold">{formatMoney(bean.price)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-[2rem] panel px-5 py-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Add a setting</p>
          <h3 className="mt-3 text-2xl font-bold">Save the grind that worked</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Store grinder-specific settings and brew notes so you can reuse them next time.
          </p>
          <div className="mt-5">
            {grinders.length ? (
              <GrindSettingForm beanBagId={bean.id} grinders={grinders} />
            ) : (
              <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-5 text-sm text-[var(--muted)]">
                Add a grinder first, then you can save grind settings for this bean.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] panel px-5 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">History</p>
              <h3 className="mt-2 text-2xl font-bold">Saved grind settings</h3>
            </div>
            <span className="rounded-full bg-[#efe3d5] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {bean.grindSettings.length} entries
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {bean.grindSettings.length ? (
              bean.grindSettings.map((setting) => (
                <article className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-4" key={setting.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold">{setting.grinderName}</h4>
                      <p className="text-sm text-[var(--muted)]">{formatDate(setting.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[var(--accent)]">
                      {setting.settingValue}
                    </span>
                  </div>
                  {setting.notes ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{setting.notes}</p>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] bg-[#f8f1e8] px-4 py-5 text-sm text-[var(--muted)]">
                No grind settings saved yet for this bag.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
