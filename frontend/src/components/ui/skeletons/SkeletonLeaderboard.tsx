export default function SkeletonLeaderboard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-[24px] border border-outline bg-surface-high/80 p-4 shadow-card motion-safe:animate-pulse space-y-3"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl bg-surface-low p-3"
        >
          <div className="h-8 w-8 rounded-full bg-surface-high"></div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-surface-high"></div>
            <div className="h-4 w-32 rounded bg-surface-high"></div>
          </div>
          <div className="h-4 w-16 rounded bg-surface-high"></div>
        </div>
      ))}
    </div>
  );
}
