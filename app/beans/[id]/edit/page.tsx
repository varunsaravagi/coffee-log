import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBeanBag } from "@/app/actions";
import { BeanBagForm } from "@/components/bean-bag-form";
import { getBeanBag } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export default async function EditBeanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bean = await getBeanBag(Number(id));

  if (!bean) {
    notFound();
  }

  const action = updateBeanBag.bind(null, bean.id);

  return (
    <main className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Edit bean</p>
          <h2 className="mt-3 text-3xl font-bold">{bean.beanName}</h2>
        </div>
        <BeanBagForm
          action={action}
          initialData={bean}
          pendingLabel="Updating bean..."
          submitLabel="Update bean"
        />
      </section>
      <section className="space-y-5">
        <div className="overflow-hidden rounded-[2rem] panel">
          {bean.photoPath ? (
            <div className="relative h-72 w-full">
              <Image alt={`${bean.brand} ${bean.beanName}`} className="object-cover" fill src={bean.photoPath} />
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center bg-[#e7d8c5] text-[var(--muted)]">
              No photo saved for this bag yet.
            </div>
          )}
        </div>
        <div className="rounded-[2rem] panel px-5 py-6">
          <h3 className="text-2xl font-bold">Timestamps</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-[var(--muted)]">Created</dt>
              <dd>{formatDateTime(bean.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[var(--muted)]">Last updated</dt>
              <dd>{formatDateTime(bean.updatedAt)}</dd>
            </div>
          </dl>
          <Link className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]" href={`/beans/${bean.id}`}>
            Back to bean
          </Link>
        </div>
      </section>
    </main>
  );
}

