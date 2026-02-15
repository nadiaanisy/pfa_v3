import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '../../components/ui/alert-dialog';

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteExpenseDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!open && !loading) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this transaction. If it was linked to an income source, the amount will be credited back to that source.
              This action cannot be undone.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
