import {
  useEffect,
  useState,
  useMemo
} from 'react';
import {
  format,
//   parse
} from 'date-fns';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '../../components/ui/dialog';
import { 
  Plus,
  Wallet,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  Trash2,
  PieChart as PieChartIcon,
  CreditCard,
  Filter,
  ArrowUpDown,
  CalendarIcon,
//   Minus
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { motion } from 'motion/react';
import {
  INCOME_CHARTS_COLORS,
  INCOME_TYPES
} from '../../miscellaneous/Constants';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  addIncomeSourceFunction,
  getIncomeSourcesFunction
} from '../../components/functions/income-sources';
import { useAuth } from '../../miscellaneous/Providers';
import { IncomeSource } from '../../miscellaneous/Interfaces';
import { formatCurrency } from '../../components/functions/formatCurrency';
import { formatDateWithSuffix } from '../../components/functions/formatDateWithSuffix';
import { toast } from 'sonner';
import { set } from 'zod';


export default function IncomeSources() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  // const [spendDialogOpen, setSpendDialogOpen] = useState(false);
  // const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter & Sort State
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  // Form State
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeType, setNewIncomeType] = useState<'salary' | 'business' | 'dividend' | 'freelance' | 'gift' | 'investment' | 'loan' | 'other' | 'rental'>('salary');
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [newIncomePurpose, setNewIncomePurpose] = useState<string>(format(new Date(), 'yyyy-MM'));

  // const [spendAmount, setSpendAmount] = useState("");

  useEffect(() => {
    const fetchIncomeSources = async () => {
      const data = await getIncomeSourcesFunction(user.id);
      setIncomeSources(data as IncomeSource[]);
    };
    fetchIncomeSources();
  }, [user.id]);

  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const totalSpent = incomeSources.reduce((sum, source) => sum + source.amount - source.balance, 0);
  const chartData = incomeSources.map(source => ({
    name: source.name,
    value: source.amount
  }));

  // Extract unique years from data for filter
  const availableYears = useMemo(() => {
    const years = new Set(incomeSources.map(s => new Date(s.purposeMonth).getFullYear().toString()));
    years.add(new Date().getFullYear().toString()); // Always include current year
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
        // filterMonth is '0' to '11'
        return d.getMonth().toString() === filterMonth;
      });
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.purposeMonth).getTime() - new Date(a.purposeMonth).getTime();
        case "oldest":
          return new Date(a.purposeMonth).getTime() - new Date(b.purposeMonth).getTime();
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

  // Calculate Pagination based on filtered results
  const totalPages = Math.ceil(filteredAndSortedSources.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSources = filteredAndSortedSources.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filterType, sortOrder, filterYear, filterMonth]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const ProgressBar = ({ value, max }: { value: number, max: number }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
    let gradient = "from-red-500 to-pink-500";
    if (percentage > 50) gradient = "from-amber-500 to-orange-500";
    if (percentage > 80) gradient = "from-emerald-500 to-teal-500";
  
    return (
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 mt-2">
        <motion.div 
          className={`h-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    );
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newIncomeName || !newIncomeAmount || !newIncomePurpose) return;
    const colors = ['#A8D5BA', '#FFD4A3', '#B4A7D6', '#FFB4B4', '#A3C4F3'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    setIsLoading(true);
    try {
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
        setIsAddOpen(false);
        setNewIncomeName("");
        setNewIncomeType('salary');
        setNewIncomeAmount("");
        setNewIncomePurpose(format(new Date(), 'yyyy-MM'));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add income source.');
    } finally {
      setIsLoading(false);
    }
  }
  const deleteIncomeSource = async (id: string) => {};
//   const handleSpend = async (e: React.FormEvent) => {}
  
//   const openSpendDialog = (id: string) => {
//     setSelectedSourceId(id);
//     setSpendDialogOpen(true);
//   };

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
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                <Plus className="mr-2 h-4 w-4" /> Add Income Source
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="sm:max-w-[425px] bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
            >
              <DialogHeader>
                <DialogTitle>Add Income Source</DialogTitle>
                <DialogDescription>
                  Add a new income stream to your portfolio.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddIncome} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Source Name</Label>
                  <Input 
                    type="text"
                    id="name" 
                    placeholder="e.g. Full-time Job" 
                    value={newIncomeName}
                    onChange={(e) => setNewIncomeName(e.target.value)}
                    required
                    className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newIncomeType}
                    onValueChange={(value) => setNewIncomeType(value as 'salary' | 'business' | 'dividend' | 'freelance' | 'gift' | 'investment' | 'loan' | 'other' | 'rental')}
                    required
                  >
                    <SelectTrigger
                      className="pl-9 border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    >
                      {INCOME_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                      className="pl-9 border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      value={newIncomeAmount}
                      required
                      onChange={(e) => {
                        const val = e.target.value;
                          if (val === '') {
                            setNewIncomeAmount('');
                            return;
                          }
                          if (/^\d+(\.\d{0,2})?$/.test(val)) {
                            setNewIncomeAmount(val);
                          }
                        }
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month/Year (Purpose)</Label>
                  <Input 
                    id="month"
                    type="month"
                    value={newIncomePurpose}
                    onChange={(e) => setNewIncomePurpose(e.target.value)}
                    required
                    className="border-slate-300 bg-[#f3f3f5] dark:bg-[color-mix(in_oklab,var(--input)_30%,transparent)] text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
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
                    Add Source
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Spend Dialog */}
      {/* <Dialog open={spendDialogOpen} onOpenChange={setSpendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Expense</DialogTitle>
            <DialogDescription>
              Deduct an amount from this income source.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSpend} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="spendAmount">Amount Spent</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  id="spendAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-9" 
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSpendDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Record Expense</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog> */}

      {/* Summary Cards */}
      <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</CardTitle>
            <Wallet className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalIncome, user.currency)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              From {incomeSources.length} sources
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Spent/Allocated</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalSpent, user.currency)}</div>
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
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalIncome - totalSpent, user.currency)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Available for saving/goals
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Income Distribution Chart */}
        <motion.div
          variants={item}
          className="md:col-span-1"
        >
          <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-purple-500" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {incomeSources.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={INCOME_CHARTS_COLORS[index % INCOME_CHARTS_COLORS.length]} />
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
        </motion.div>

        {/* Income Sources List */}
        <motion.div
          variants={item}
          className="md:col-span-2"
        >
          <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm flex flex-col">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Detailed Sources & Usage</CardTitle>
                  <CardDescription>Track spending against each income source.</CardDescription>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={filterType}
                    onValueChange={setFilterType}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectItem value="all">All Types</SelectItem>
                      {INCOME_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <ArrowUpDown className="mr-2 h-3 w-3" />
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest">Highest Amount</SelectItem>
                      <SelectItem value="lowest">Lowest Amount</SelectItem>
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="h-8 w-[130px] text-xs" disabled={filterYear === "all"}>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="0">January</SelectItem>
                      <SelectItem value="1">February</SelectItem>
                      <SelectItem value="2">March</SelectItem>
                      <SelectItem value="3">April</SelectItem>
                      <SelectItem value="4">May</SelectItem>
                      <SelectItem value="5">June</SelectItem>
                      <SelectItem value="6">July</SelectItem>
                      <SelectItem value="7">August</SelectItem>
                      <SelectItem value="8">September</SelectItem>
                      <SelectItem value="9">October</SelectItem>
                      <SelectItem value="10">November</SelectItem>
                      <SelectItem value="11">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(filterType !== "all" || sortOrder !== "newest" || filterYear !== "all" || filterMonth !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setFilterType("all");
                      setSortOrder("newest");
                      setFilterYear("all");
                      setFilterMonth("all");
                    }}
                    className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentSources.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No income sources found.</p>
                    {(filterType !== "all" || filterYear !== "all") ? (
                       <Button variant="link" onClick={() => {
                         setFilterType("all");
                         setFilterYear("all");
                         setFilterMonth("all");
                       }}>Clear filters</Button>
                    ) : (
                       <Button variant="link" onClick={() => setIsAddOpen(true)}>Add your first income source</Button>
                    )}
                  </div>
                ) : (
                  currentSources.map((source) => (
                    <div 
                      key={source.id} 
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{source.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <span>{source.type}</span>
                              <span>•</span>
                              <span>{new Date(source.purposeMonth).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                             <div className="font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(source.amount, user.currency)}
                             </div>
                             <div className="text-xs text-slate-500 dark:text-slate-400">
                                {formatCurrency(source.amount - (source.amount - source.balance), user.currency)} remaining
                             </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 shadow-none"
                            >
                              {/* <DropdownMenuItem 
                                onClick={() => openSpendDialog(source.id)}
                                className="cursor-pointer"
                              >
                                <Minus className="mr-2 h-4 w-4" /> Record Expense
                              </DropdownMenuItem> */}
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                onClick={() => deleteIncomeSource(source.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* Progress Section */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Used: {formatCurrency(source.amount - source.balance, user.currency)}</span>
                          <span className="text-slate-500">{Math.round((source.balance / source.amount) * 100)}%</span>
                        </div>
                        <ProgressBar value={source.balance} max={source.amount} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#" 
                          isActive={currentPage === i + 1}
                          onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}