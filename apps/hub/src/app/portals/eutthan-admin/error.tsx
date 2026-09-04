"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-headline-5 text-ink">Something went wrong</h2>
      <button onClick={reset} className="rounded-lg bg-primary px-4 py-2 text-label-1 font-semibold text-white hover:opacity-90">Try again</button>
    </div>
  );
}
