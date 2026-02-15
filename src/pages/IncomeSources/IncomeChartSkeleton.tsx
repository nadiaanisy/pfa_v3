import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/ui/card';

export default function IncomeChartSkeleton() {
  return (
    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* Icon Skeleton */}
          <div className="h-5 w-5 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
          
          {/* Title Skeleton */}
          <div className="h-5 w-28 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[250px] w-full flex flex-col items-center justify-center gap-6">
          
          {/* Donut Chart Skeleton */}
          <div className="relative">
            <div className="h-40 w-40 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="absolute inset-6 rounded-full bg-white dark:bg-slate-900" />
          </div>

          {/* Legend Skeleton */}
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-3 w-16 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            ))}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
