import {
  useEffect,
  useState,
  useMemo
} from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import {
  addIncomeSourceFunction,
  deleteIncomeSourceFunction,
  getIncomeSourcesFunction,
  updateIncomeSourceFunction
} from '../../components/functions/income-sources';
import { useAuth } from '../../miscellaneous/Providers';
import { IncomeSource } from '../../miscellaneous/Interfaces';
import { RANDOM_COLORS } from '../../miscellaneous/Constants';
import { formatDateWithSuffix } from '../../components/functions/formatDateWithSuffix';

// COMPONENTS
import IncomeList from './IncomeList';
import IncomeChart from './IncomeChart';
import AddIncomeDialog from './AddIncomeDialog';
import DeleteIncomeDialog from './DeleteIncomeDialog';
import IncomeSummaryCards from './IncomeSummaryCards';
import { capitalizeFirstLetter } from '../../components/functions/capitalizeFirstLetter';

type SortOrder =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "name-asc"
  | "name-desc";

export default function IncomeSources() {
  const { user } = useAuth();
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Edit State
  const [sourceToEdit, setSourceToEdit] = useState<IncomeSource | null>(null);
  
  // Delete Confirmation State
  const [sourceToDelete, setSourceToDelete] = useState<any | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter & Sort State
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  // Form State
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeType, setNewIncomeType] = useState<'salary' | 'business' | 'dividend' | 'freelance' | 'gift' | 'investment' | 'loan' | 'other' | 'rental'>('salary');
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [newIncomePurpose, setNewIncomePurpose] = useState<string>(format(new Date(), 'yyyy-MM'));
  
  useEffect(() => {
    if (!user?.id) return;
  
    const fetch = async () => {
      try {
        const data = await getIncomeSourcesFunction(user.id);
        setIncomeSources(data as IncomeSource[]);
      } catch {
        toast.error('Failed to load income sources.');
      }
    };
    fetch();
  }, [user?.id]);

  useEffect(() => {
    if (filterYear === "all") {
      setFilterMonth("all");
    }
  }, [filterYear]);

  // Extract unique years from data for filter
  const availableYears = useMemo(() => {
    const years = new Set(incomeSources.map(s => new Date(s.purposeMonth).getFullYear().toString()));
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [incomeSources]);

  // Filter and Sort Logic
  const filteredAndSortedSources = useMemo(() => {
    let result = [...incomeSources];

    // 1. Filter by Type
    if (filterType !== "all") {
      result = result.filter(source => source.type === filterType);
    }

    // 2. Filter by Year
    if (filterYear !== "all") {
      result = result.filter(source => {
        const d = new Date(source.purposeMonth);
        return d.getFullYear().toString() === filterYear;
      });
    }

    // 3. Filter by Month (only if Year is selected or valid)
    if (filterMonth !== "all") {
      result = result.filter(source => {
        const d = new Date(source.purposeMonth);
        return (d.getMonth() + 1).toString() === filterMonth;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [incomeSources, filterType, sortOrder, filterYear, filterMonth]);

  const chartData = useMemo(() => {
    const grouped = filteredAndSortedSources.reduce((acc, source) => {
      const type = source.type;

      if (!acc[type]) {
        acc[type] = 0;
      }

      acc[type] += source.amount;

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([type, amount]) => ({
      name: capitalizeFirstLetter(type),
      value: amount,
    }));
  }, [filteredAndSortedSources]);

  const filteredTotalIncome = useMemo(
    () => filteredAndSortedSources.reduce((sum, source) => sum + source.amount, 0),
    [filteredAndSortedSources]
  );

  const filteredTotalSpent = useMemo(
    () =>
      filteredAndSortedSources.reduce(
        (sum, source) => sum + Math.max(0, source.amount - source.balance),
        0
      ),
    [filteredAndSortedSources]
  );

  const filteredRemaining = useMemo(
    () => filteredTotalIncome - filteredTotalSpent,
    [filteredTotalIncome, filteredTotalSpent]
  );

  // Calculate Pagination based on filtered results
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedSources.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSources = filteredAndSortedSources.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortOrder, filterYear, filterMonth]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddLoading) return;

    if (!newIncomeName || !newIncomeAmount || !newIncomePurpose) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (sourceToEdit) {
      try {
        setIsAddLoading(true);

        const oldAmount = sourceToEdit.amount;
        const oldBalance = sourceToEdit.balance;

        // calculate already spent
        const spent = Math.max(0, oldAmount - oldBalance);

        const newAmountNumber = parseFloat(newIncomeAmount);

        // 🚨 Prevent reducing below spent
        if (newAmountNumber < spent) {
          toast.error(
            `New amount cannot be less than already spent (${spent}).`
          );
          return;
        }

        const newBalance = newAmountNumber - spent;
        const payload = {
          id: sourceToEdit.id,
          name: newIncomeName,
          type: newIncomeType,
          amount: newAmountNumber,
          balance: newBalance,
          purposeMonth: newIncomePurpose
        };

        const result = await updateIncomeSourceFunction(sourceToEdit.id, payload);

        if (result) {
          toast.success("Income updated successfully.");

          setIncomeSources(prev => prev.map(src => src.id === sourceToEdit.id ? { ...src, ...payload } as IncomeSource : src));

          resetAllFormFields();
          setSourceToEdit(null);
          setIsAddOpen(false);
        }

      } catch (err: any) {
        toast.error(err.message || "Failed to update income.");
      } finally {
        setIsAddLoading(false);
      }
    } else {
      const color = RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
      try {
        setIsAddLoading(true);
        const result = await addIncomeSourceFunction({
          user_id: user.id,
          name: newIncomeName,
          type: newIncomeType,
          amount: parseFloat(newIncomeAmount),
          balance: parseFloat(newIncomeAmount),
          color,
          purposeMonth: newIncomePurpose
        });

        if (result) {
          toast.success('Income source added successfully.');
          setIncomeSources(prev => [...prev, result as IncomeSource]);
          resetAllFormFields();
          resetAllFilter();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to add income source.');
      } finally {
        setIsAddLoading(false);
      }
    }
  };

  const resetAllFormFields = () => {
    setIsAddOpen(false);
    setNewIncomeName("");
    setNewIncomeType('salary');
    setNewIncomeAmount("");
    setSourceToEdit(null);
    setSourceToDelete(null);
    setNewIncomePurpose(format(new Date(), 'yyyy-MM'));
  }

  const resetAllFilter = () => {
    setFilterType("all");
    setSortOrder("newest");
    setFilterYear("all");
    setFilterMonth("all");
    setCurrentPage(1);
  }

  const deleteIncomeSource = async () => {
    if (!sourceToDelete) return;

    setIsDeleteLoading(true);
    try {
      const success = await deleteIncomeSourceFunction(sourceToDelete);

      if (success) {
        toast.success('Income source deleted successfully.');

        setIncomeSources(prev => {
          const updated = prev.filter(
            (source: any) => source.id !== sourceToDelete
          );

          const newTotalPages = Math.ceil(updated.length / itemsPerPage);
          if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(1, newTotalPages));
          }

          return updated;
        });

        setSourceToDelete(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete income source.');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div variants={item}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Income Sources</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your income streams and track their utilization.</p>
          <p className="text-slate-500 dark:text-slate-400">All details are as of {formatDateWithSuffix(new Date())}</p>
        </motion.div>

        <motion.div variants={item}>
          <AddIncomeDialog
            isEditing={!!sourceToEdit}
            isOpen={isAddOpen}
            setIsOpen={setIsAddOpen}
            isLoading={isAddLoading}
            handleSubmit={handleAddIncome}
            newIncomeName={newIncomeName}
            setNewIncomeName={setNewIncomeName}
            newIncomeType={newIncomeType}
            setNewIncomeType={setNewIncomeType}
            newIncomeAmount={newIncomeAmount}
            setNewIncomeAmount={setNewIncomeAmount}
            newIncomePurpose={newIncomePurpose}
            setNewIncomePurpose={setNewIncomePurpose}
            trigger={
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                <Plus className="h-4 w-4" />Add Income Source
              </Button>
            }
          />
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteIncomeDialog
        open={!!sourceToDelete}
        loading={isDeleteLoading}
        onClose={() => setSourceToDelete(null)}
        onConfirm={deleteIncomeSource}
      />

      {/* Summary Cards */}
      <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
        <IncomeSummaryCards
          totalIncome={filteredTotalIncome}
          totalSpent={filteredTotalSpent}
          remaining={filteredRemaining}
          count={filteredAndSortedSources.length}
          currency={user?.currency ?? "MYR"}
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Income Distribution Chart */}
        <motion.div
          variants={item}
          className="md:col-span-1"
        >
          <IncomeChart data={chartData} />
        </motion.div>

        {/* Income Sources List */}
        <motion.div
          variants={item}
          className="md:col-span-2"
        >
          <IncomeList
            sources={currentSources}
            currency={user?.currency ?? "MYR"}
            onEdit={(source) => {
              setSourceToEdit(source);

              setNewIncomeName(source.name);
              setNewIncomeType(source.type);
              setNewIncomeAmount(source.amount.toString());
              setNewIncomePurpose(source.purposeMonth);

              setIsAddOpen(true);
            }}
            onDelete={setSourceToDelete}
            filterType={filterType}
            setFilterType={setFilterType}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            availableYears={availableYears}
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
