/* eslint-disable no-unused-vars */
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import {
  Plus,
  Search,
  Download,
  Filter,
  X,
} from "lucide-react";
import { Pagination } from "@/shared/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type {
  Column,
  ActionButton,
  SortConfig,
  FilterConfig,
  QuickFilter,
} from "./DataTable";

// Re-export types for convenience
export type {
  Column,
  ActionButton,
  SortConfig,
  FilterConfig,
  QuickFilter,
};

export interface DataGridProps<T> {
  data: T[];
  columns?: Column<T>[]; // Optional for grid - we use renderCard instead
  keyExtractor: (row: T) => string | number;
  renderCard: (row: T) => React.ReactNode; // Function to render each card
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  customActions?: ActionButton<T>[];
  emptyMessage?: string;
  className?: string;
  cardClassName?: string | ((row: T) => string);
  isLoading?: boolean;
  loadingMessage?: string;
  // Grid layout
  gridCols?: {
    default?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  // Sorting
  sortable?: boolean;
  defaultSort?: SortConfig;
  onSort?: (_sort: SortConfig | null) => void;
  // Filtering
  filterable?: boolean;
  onFilter?: (_filters: FilterConfig[]) => void;
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (_page: number) => void;
    onPageSizeChange?: (_size: number) => void;
    pageSizeOptions?: number[];
  };
  // Selection
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (_selected: T[]) => void;
  // Export
  exportable?: boolean;
  exportFormats?: ("csv" | "excel" | "pdf")[];
  onExport?: (_format: string) => void;
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (_query: string) => void;
  // Quick Filters
  quickFilters?: QuickFilter[];
  onQuickFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  // Columns for filtering (if different from display)
  filterColumns?: Column<T>[];
}

export function DataGrid<T extends Record<string, any>>({
  data,
  columns = [],
  keyExtractor,
  renderCard,
  onEdit: _onEdit,
  onDelete: _onDelete,
  onCreate,
  customActions: _customActions = [],
  emptyMessage = "Không có dữ liệu",
  className,
  cardClassName,
  isLoading = false,
  loadingMessage = "Đang tải...",
  gridCols = { default: 1, md: 2, lg: 3 },
  // Sorting
  sortable: _sortable = false,
  defaultSort: _defaultSort,
  onSort: _onSort,
  // Filtering
  filterable = false,
  onFilter,
  filterColumns,
  // Pagination
  pagination,
  // Selection
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  // Export
  exportable = false,
  exportFormats = ["csv"],
  onExport,
  // Search
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  // Quick Filters
  quickFilters = [],
  onQuickFilterChange,
  onClearFilters,
}: DataGridProps<T>) {
  // Sort config - reserved for future use
  // const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(
  //   defaultSort || null
  // );
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [quickFilterValues, setQuickFilterValues] = React.useState<
    Record<string, string>
  >({});

  // Use filterColumns if provided, otherwise use columns
  const columnsForFilter = filterColumns || columns;

  // Handle filter change
  const handleFilterChange = (
    key: string,
    value: string,
    type: FilterConfig["type"]
  ) => {
    const isClear = value === "__all__";
    const newFilters = filters.filter((f) => f.key !== key);
    if (!isClear && value) {
      newFilters.push({ key, value, type });
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle quick filter change
  const handleQuickFilterChange = (key: string, value: string) => {
    const isClear = value === "__all__";
    const newValues = { ...quickFilterValues };
    if (isClear) {
      delete newValues[key];
    } else {
      newValues[key] = value;
    }
    setQuickFilterValues(newValues);

    const newFilters = filters.filter((f) => f.key !== key);
    if (!isClear && value) {
      newFilters.push({
        key,
        value,
        type: "select",
      });
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
    onQuickFilterChange?.(key, isClear ? "" : value);
  };

  // Sync quick filter values with filters when filters change externally
  React.useEffect(() => {
    const newQuickFilterValues: Record<string, string> = {};
    quickFilters.forEach((qf) => {
      const filter = filters.find((f) => f.key === qf.key);
      if (filter) {
        newQuickFilterValues[qf.key] = filter.value;
      }
    });
    setQuickFilterValues(() => {
      const updated: Record<string, string> = {};
      quickFilters.forEach((qf) => {
        if (newQuickFilterValues[qf.key]) {
          updated[qf.key] = newQuickFilterValues[qf.key];
        }
      });
      return updated;
    });
  }, [filters, quickFilters]);

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, row]);
    } else {
      onSelectionChange?.(
        selectedRows.filter((r) => keyExtractor(r) !== keyExtractor(row))
      );
    }
  };

  const isRowSelected = (row: T) => {
    return selectedRows.some((r) => keyExtractor(r) === keyExtractor(row));
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  // Handle export
  const handleExport = (format: string) => {
    onExport?.(format);
  };

  const getCardClassName = (row: T): string => {
    if (typeof cardClassName === "function") {
      return cardClassName(row);
    }
    return cardClassName || "";
  };

  // Grid column classes - Using specific Tailwind classes
  const getGridClass = (cols?: number) => {
    if (!cols) return "";
    const gridMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };
    return gridMap[cols] || `grid-cols-${cols}`;
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar: Search, Filters, Export, Create */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {/* Quick Filters */}
          {quickFilters.length > 0 &&
            quickFilters.map((quickFilter) => {
              const currentValue =
                quickFilterValues[quickFilter.key] || undefined;
              return (
                <Select
                  key={quickFilter.key}
                  value={currentValue}
                  onValueChange={(value) =>
                    handleQuickFilterChange(quickFilter.key, value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={quickFilter.placeholder || quickFilter.label}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả</SelectItem>
                    {quickFilter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })}

          {filterable && (
            // <div className="relative">
            //   <Button
            //     variant="outline"
            //     size="default"
            //     onClick={() => setShowFilters(!showFilters)}
            //     className="gap-2"
            //   >
            //     <Filter className="h-4 w-4" />
            //     Lọc
            //     {filters.length > 0 && (
            //       <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
            //         {filters.length}
            //       </span>
            //     )}
            //   </Button>
            // </div>
            <></>
          )}

          {exportable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Xuất dữ liệu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exportFormats.map((format) => (
                  <DropdownMenuItem
                    key={format}
                    onClick={() => handleExport(format)}
                  >
                    Xuất {format.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <Button
              onClick={() => {
                setFilters([]);
                setShowFilters(false);
                onFilter?.([]);
                onClearFilters?.();
              }}
              size="default"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Bỏ lọc
            </Button>
          )}

          {onCreate && (
            <Button onClick={onCreate} size="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm mới
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {filterable && showFilters && columnsForFilter.length > 0 && (
        <div className="rounded-md border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Bộ lọc</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFilters([]);
                setShowFilters(false);
                onFilter?.([]);
              }}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {columnsForFilter
              .filter((col) => col.filterable !== false)
              .map((column) => {
                const filter = filters.find((f) => f.key === column.key);
                const filterType = column.filterType || "text";

                if (filterType === "select" && column.filterOptions) {
                  return (
                    <div key={column.key} className="space-y-2">
                      <label className="text-sm font-medium">
                        {column.header}
                      </label>
                      <Select
                        value={filter?.value || undefined}
                        onValueChange={(value) =>
                          handleFilterChange(column.key, value, "select")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              column.filterPlaceholder ||
                              `Chọn ${column.header}`
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__all__">Tất cả</SelectItem>
                          {column.filterOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }

                return (
                  <div key={column.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {column.header}
                    </label>
                    <Input
                      type={
                        filterType === "date"
                          ? "date"
                          : filterType === "number"
                          ? "number"
                          : "text"
                      }
                      placeholder={
                        column.filterPlaceholder || `Lọc theo ${column.header}`
                      }
                      value={filter?.value || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          column.key,
                          e.target.value,
                          filterType
                        )
                      }
                    />
                  </div>
                );
              })}
          </div>
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const column = columnsForFilter.find(
                  (col) => col.key === filter.key
                );
                return (
                  <div
                    key={filter.key}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
                  >
                    <span className="font-medium">{column?.header}:</span>
                    <span>{filter.value}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleFilterChange(filter.key, "", filter.type)
                      }
                      className="h-4 w-4 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selection Bar */}
      {selectable && selectedRows.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            Đã chọn <strong>{selectedRows.length}</strong> mục
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Chọn tất cả"
            />
            <span className="text-sm">Chọn tất cả</span>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="rounded-md border border-border bg-card p-24 text-center text-muted-foreground">
          {loadingMessage}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-24 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-4",
              getGridClass(gridCols.default),
              gridCols.md && `md:${getGridClass(gridCols.md)}`,
              gridCols.lg && `lg:${getGridClass(gridCols.lg)}`,
              gridCols.xl && `xl:${getGridClass(gridCols.xl || gridCols.lg)}`
            )}
          >
            {data.map((row) => {
              const rowKey = keyExtractor(row);
              const isSelected = isRowSelected(row);
              return (
                <div
                  key={rowKey}
                  className={cn(
                    "relative",
                    selectable && "group",
                    getCardClassName(row)
                  )}
                >
                  {selectable && (
                    <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(row, checked as boolean)
                        }
                        aria-label={`Chọn ${rowKey}`}
                      />
                    </div>
                  )}
                  {renderCard(row)}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedRows.length > 0 && (
              <span>{selectedRows.length} mục đã chọn</span>
            )}
          </div>
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            pageSizeOptions={pagination.pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
}
