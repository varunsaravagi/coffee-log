import Image from "next/image";
import Link from "next/link";

import type { BeanBag, GrindSetting } from "@/lib/schema";
import { formatDate, formatMoney } from "@/lib/utils";

type BeanCardProps = {
  bean: BeanBag & { grindSettings: GrindSetting[] };
};

export function BeanCard({ bean }: BeanCardProps) {
  const latestGrind = bean.grindSettings[0];

  return (
    <Link className="block overflow-hidden rounded-[1.75rem] panel" href={`/beans/${bean.id}`}>
      <div className="grid gap-0 md:grid-cols-[180px_1fr]">
        <div className="bg-[#e7d8c5]">
          {bean.photoPath ? (
            <div className="relative min-h-48">
              <Image
                alt={`${bean.brand} ${bean.beanName}`}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 180px"
                src={bean.photoPath}
              />
            </div>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center px-6 text-center text-sm text-[var(--muted)]">
              No bean bag photo yet
            </div>
          )}
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--muted)]">{bean.brand}</p>
              <h3 className="mt-1 text-2xl font-bold">{bean.beanName}</h3>
            </div>
            <span className="rounded-full bg-[#efe3d5] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {bean.bagQuantityGrams}g
            </span>
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">{bean.flavorProfile}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span>Logged {formatDate(bean.logDate)}</span>
            <span>Roasted {formatDate(bean.roastDate)}</span>
            <span>{formatMoney(bean.price)}</span>
            {latestGrind ? (
              <span>
                {latestGrind.grinderName}: {latestGrind.settingValue}
              </span>
            ) : (
              <span>No grind setting saved yet</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
