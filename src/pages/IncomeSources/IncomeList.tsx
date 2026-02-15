import {
  ArrowUpDown,
  CalendarIcon,
  Filter 
 } from 'lucide-react';
 import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../components/ui/select';
import IncomeListItem from './IncomeListItem';
import { Button } from '../../components/ui/button';
import { INCOME_TYPES } from '../../miscellaneous/Constants';
import { IncomeSource } from '../../miscellaneous/Interfaces';

// COMPONENTS
import IncomeListItemSkeleton from './IncomeListItemSkeleton';
import PaginationControls from '../../components/PaginationControls';

type SortOrder =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest"
  | "name-asc"
  | "name-desc";

interface Props {
  sources: IncomeSource[];
  currency: string;
  onEdit: (source: IncomeSource) => void;
  onDelete: (id: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  filterYear: string;
  setFilterYear: (year: string) => void;
  filterMonth: string;
  setFilterMonth: (month: string) => void;
  availableYears: string[];
  isAddOpen: boolean;
  setIsAddOpen: (value: boolean) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  isLoading: boolean;
}

export default function IncomeList({
  sources,
  currency,
  onEdit,
  onDelete,
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
  availableYears,
  isAddOpen,
  setIsAddOpen,
  currentPage,
  totalPages,
  handlePageChange,
  isLoading 
}: Props) {
  return (
    <>
      <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm flex flex-col">
        <CardHeader>
          <div>
            <CardTitle>Detailed Sources & Usage</CardTitle>
            <CardDescription>Track spending against each income source.</CardDescription>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <Filter className="mr-2 h-3 w-3" />
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
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as SortOrder)}
              >
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
                  {availableYears.map((year) => (
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <IncomeListItemSkeleton key={index} />
              ))
            ) : sources.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No income sources found.</p>
                {(filterType !== "all" || filterYear !== "all") ? (
                  <Button
                    variant="link"
                    onClick={() => {
                      setFilterType("all");
                      setFilterYear("all");
                      setFilterMonth("all");
                      setSortOrder("newest");
                    }}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button variant="link" onClick={() => setIsAddOpen(true)}>
                    Add your first income source
                  </Button>
                )}
              </div>
            ) : (
              sources.map((source) => (
                <IncomeListItem
                  key={source.id}
                  source={source}
                  currency={currency}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </CardContent>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
          totalItems={sources.length}
        />
      </Card>
    </>
  );
}
