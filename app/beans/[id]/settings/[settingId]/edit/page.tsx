import Link from "next/link";
import { notFound } from "next/navigation";

import { updateGrindSetting } from "@/app/actions";
import { GrindSettingForm } from "@/components/grind-setting-form";
import { getBeanBag, getGrinders, getGrindSetting } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export default async function EditGrindSettingPage({
  params,
}: {
  params: Promise<{ id: string; settingId: string }>;
}) {
  const { id, settingId } = await params;
  const [bean, grinders, setting] = await Promise.all([
    getBeanBag(Number(id)),
    getGrinders(),
    getGrindSetting(Number(settingId)),
  ]);

  if (!bean || !setting || setting.beanBagId !== bean.id) {
    notFound();
  }

  const action = updateGrindSetting.bind(null, setting.id);

  return (
    <main className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">Edit grind setting</p>
        <h2 className="mt-3 text-3xl font-bold">{bean.beanName}</h2>
        <div className="mt-6">
          <GrindSettingForm
            action={action}
            beanBagId={bean.id}
            grinders={grinders}
            initialData={setting}
            pendingLabel="Updating setting..."
            submitLabel="Update grind setting"
          />
        </div>
      </section>
      <section className="rounded-[2rem] panel px-5 py-6 md:px-8">
        <h3 className="text-2xl font-bold">Timestamps</h3>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-[var(--muted)]">Created</dt>
            <dd>{formatDateTime(setting.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--muted)]">Last updated</dt>
            <dd>{formatDateTime(setting.updatedAt)}</dd>
          </div>
        </dl>
        <Link className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)]" href={`/beans/${bean.id}`}>
          Back to bean
        </Link>
      </section>
    </main>
  );
}

