import {
  Card,
  CardContent,
  CardHeader
} from '../../components/ui/card';

export default function IncomeSummaryCardsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <Card
          key={item}
          className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            {/* Title Skeleton */}
            <div className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />

            {/* Icon Skeleton */}
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </CardHeader>

          <CardContent>
            {/* Amount Skeleton */}
            <div className="h-7 w-32 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse mb-2" />

            {/* Subtext Skeleton */}
            <div className="h-3 w-28 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
