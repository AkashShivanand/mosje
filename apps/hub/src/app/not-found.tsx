import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold text-ink">Page Not Found</h1>
      <p className="text-ink-muted">The page you requested does not exist.</p>
      <Link href="/" className="text-sm font-semibold text-primary hover:underline">Go to Home</Link>
    </main>
  );
}
