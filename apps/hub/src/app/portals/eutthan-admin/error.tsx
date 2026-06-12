"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
      <button onClick={reset} className="rounded-lg bg-gov-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Try again</button>
    </div>
  );
}
