import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../../components/ui/card';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function AppearanceTab () {
  return (
    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900/50">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-slate-900 dark:text-slate-100">Theme Preference</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select your preferred color theme.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* <Separator className="my-4 border-t-2 border-slate-300 dark:border-slate-700" />

        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Interface Density</h4>
          <div className="grid grid-cols-3 gap-4">
            {INTERFACE_DENSITY.map((density) => (
              <div
                key={density}
                className={`cursor-pointer rounded-lg border p-4 text-center
                  ${selectedDensity === density 
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  }`}
                onClick={() => setSelectedDensity(density)}
              >
                <div className="mb-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <div className="mb-2 h-2 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-sm font-medium">{density}</span>
              </div>
            ))}
          </div>
        </div> */}
      </CardContent>
    </Card>
  )
}