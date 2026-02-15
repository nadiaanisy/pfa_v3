import {
  Loader2,
  DollarSign
} from 'lucide-react';
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
import { INCOME_TYPES } from '../../miscellaneous/Constants';
import { useEffect } from 'react';

interface Props {
  isEditing?: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  newIncomeName: string;
  setNewIncomeName: (v: string) => void;
  newIncomeType: any;
  setNewIncomeType: (v: any) => void;
  newIncomeAmount: string;
  setNewIncomeAmount: (v: string) => void;
  newIncomePurpose: string;
  setNewIncomePurpose: (v: string) => void;
  trigger: React.ReactNode;
}

export default function AddIncomeDialog({
  isEditing = false,
  isOpen,
  setIsOpen,
  isLoading,
  handleSubmit,
  newIncomeName,
  setNewIncomeName,
  newIncomeType,
  setNewIncomeType,
  newIncomeAmount,
  setNewIncomeAmount,
  newIncomePurpose,
  setNewIncomePurpose,
  trigger,
}: Props) {
  const resetForm = () => {
    setNewIncomeName('');
    setNewIncomeType('');
    setNewIncomeAmount('');
    setNewIncomePurpose('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-[425px] bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Income Source' : 'Add Income Source'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Edit your existing income source details.' : 'Add a new income stream to your portfolio.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Source Name <span className="text-red-500">*</span></Label>
            <Input
              id="name" 
              type="text"
              placeholder="e.g. Full-time Job" 
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
              className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
            <Select
              value={newIncomeType}
              onValueChange={(value) => setNewIncomeType(value as 'salary' | 'business' | 'dividend' | 'freelance' | 'gift' | 'investment' | 'loan' | 'other' | 'rental')}
              >
              <SelectTrigger
                className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto">
                {INCOME_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  value={newIncomeAmount}
                  required
                  onChange={(e) => {
                    const val = e.target.value;
                      if (val === '') {
                        setNewIncomeAmount('');
                        return;
                      }
                      if (/^\d*(\.\d{0,2})?$/.test(val)) {
                        setNewIncomeAmount(val);
                      }
                    }
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Month/Year (Purpose) <span className="text-red-500">*</span></Label>
              <Input 
                id="month"
                type="month"
                value={newIncomePurpose}
                onChange={(e) => setNewIncomePurpose(e.target.value)}
                required
                className="text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
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
              {isEditing ? "Update Source" : "Add Source"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
