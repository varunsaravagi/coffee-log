import { BeanBagForm } from "@/components/bean-bag-form";

export default function NewBeanPage() {
  return (
    <main className="rounded-[2rem] panel px-5 py-6 md:px-8">
      <div className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--muted)]">New bean bag</p>
        <h2 className="mt-3 text-3xl font-bold">Capture the bag details while it’s in your hand.</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          This form is designed for phone entry. Add the core details now, then dial in grind settings on the bag page.
        </p>
      </div>
      <BeanBagForm />
    </main>
  );
}

