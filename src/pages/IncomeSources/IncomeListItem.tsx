import {
  DollarSign,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { IncomeSource } from '../../miscellaneous/Interfaces';
import { formatCurrency } from '../../components/functions/formatCurrency';
import { capitalizeFirstLetter } from '../../components/functions/capitalizeFirstLetter';

// COMPONENTS
import ProgressBar from './ProgressBar';

interface Props {
  source: IncomeSource;
  currency: string;
  onEdit: (source: IncomeSource) => void;
  onDelete: (id: string) => void;
}

export default function IncomeListItem({
  source,
  currency,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{source.name}</h4>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>{capitalizeFirstLetter(source.type)}</span>
              <span>•</span>
              <span>{new Date(source.purposeMonth).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(source.amount, currency)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formatCurrency(source.balance, currency)} remaining
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 shadow-none"
            >
              {/* <DropdownMenuItem 
                onClick={() => openSpendDialog(source.id)}
                className="cursor-pointer"
              >
                <Minus className="mr-2 h-4 w-4" /> Record Expense
              </DropdownMenuItem> */}
              <DropdownMenuItem 
                onClick={() => onEdit(source)}
                className="cursor-pointer"
              >
                <DollarSign className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                onClick={() => onDelete(source.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProgressBar value={source.balance} max={source.amount} />
    </div>
  );
}
