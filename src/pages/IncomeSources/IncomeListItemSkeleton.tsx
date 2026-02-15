export default function IncomeListItemSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          
          {/* Icon Skeleton */}
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />

          <div className="space-y-2">
            {/* Title Skeleton */}
            <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />

            {/* Subtitle Skeleton */}
            <div className="h-3 w-40 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right space-y-2">
            {/* Amount Skeleton */}
            <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />

            {/* Remaining Skeleton */}
            <div className="h-3 w-20 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>

          {/* Menu Button Skeleton */}
          <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>

      {/* Progress Bar Skeleton */}
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    </div>
  );
}
