export default function Loading() {
  return (
    <div role="status" className="flex min-h-[50vh] items-center justify-center">
      <span className="sr-only">Loading portals...</span>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gov-blue border-t-transparent" aria-hidden />
    </div>
  );
}
