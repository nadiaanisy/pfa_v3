import {
  Loader2,
  DollarSign,
  Calendar,
  Info
} from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { EXPENSES_TYPES, INCOME_TYPES } from '../../miscellaneous/Constants';
import { Textarea } from '../../components/ui/textarea';

interface Props {
  incomeList: any[];
  currency: string;
  isEditing?: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  newTitle: string;
  setNewTitle: (v: string) => void;
  newAmount: string;
  setNewAmount: (v: string) => void;
  newCategory: string;
  setNewCategory: (v: string) => void;
  newIncomeSource: any;
  setNewIncomeSource: (v: any) => void;
  newDate: string;
  setNewDate: (v: string) => void;
  newNotes: string;
  setNewNotes: (v: string) => void;
  trigger: React.ReactNode;
}

export default function AddIncomeDialog({
  incomeList,
  currency,
  isEditing = false,
  isOpen,
  setIsOpen,
  isLoading,
  handleSubmit,
  newTitle,
  setNewTitle,
  newAmount,
  setNewAmount,
  newCategory,
  setNewCategory,
  newIncomeSource,
  setNewIncomeSource,
  newDate,
  setNewDate,
  newNotes,
  setNewNotes,
  trigger
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px] bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Edit your existing transaction details.' : 'Record a new transaction.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title" 
              type="text"
              placeholder="e.g. Grocery shopping"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  className="pl-9 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  min="0"
                  step="0.01"
                  value={newAmount}
                  required
                  onChange={(e) => {
                    const val = e.target.value;
                      if (val === '') {
                        setNewAmount('');
                        return;
                      }
                      if (/^\d*(\.\d{0,2})?$/.test(val)) {
                        setNewAmount(val);
                      }
                    }
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input 
                className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                id="date" 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto">
                  {EXPENSES_TYPES.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="source" className="flex items-center gap-1">Paid from <span className="text-red-500">*</span></Label>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-black dark:text-white" />
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={4}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 rounded-md px-3 py-1.5 text-xs shadow-lg"
                  >
                    <p>Selecting a source will deduct this amount from its tracked balance.</p>
                  </TooltipContent>
                </UITooltip>
              </div>
              <Select value={newIncomeSource} onValueChange={setNewIncomeSource}>
                <SelectTrigger className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Select Income Source" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto">
                  {incomeList.map(source => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                      <span className='text-gray-500 text-xs ml-2'>
                        (Balance: {new Intl.NumberFormat('en-MY', {
                          style: 'currency',
                          currency: currency,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(source.balance)})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes" 
              placeholder="Add details (optional)..." 
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Update Expense" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
