import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { PieChartIcon } from 'lucide-react';
import { CHARTS_COLORS } from '../../miscellaneous/Constants';

interface Props {
  data: { name: string; value: number }[];
}

export default function IncomeChart({ data }: Props) {
  return (
    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-purple-500" />
          Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-slate-200 dark:text-slate-800"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHARTS_COLORS[index % CHARTS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}