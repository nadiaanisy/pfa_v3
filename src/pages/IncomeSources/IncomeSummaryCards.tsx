import {
  Wallet,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { formatCurrency } from '../../components/functions/formatCurrency';

interface Props {
  totalIncome: number;
  totalSpent: number;
  remaining: number;
  count: number;
  currency: string;
}

export default function IncomeSummaryCards({
  totalIncome,
  totalSpent,
  remaining,
  count,
  currency
}: Props) {

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</CardTitle>
          <Wallet className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalIncome, currency)}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            From {count} sources
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent/Allocated</CardTitle>
          <CreditCard className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalSpent, currency)}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {Math.round((totalSpent / (totalIncome || 1)) * 100)}% of total income
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(remaining, currency)}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Available for saving/goals
          </p>
        </CardContent>
      </Card>
    </>
  )

}