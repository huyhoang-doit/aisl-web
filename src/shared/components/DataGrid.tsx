/* eslint-disable no-unused-vars */
import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Plus, Search, Filter, X } from "lucide-react";
import { Pagination } from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Column, FilterConfig, QuickFilter } from "./DataTable";

export type { Column, FilterConfig, QuickFilter };

export interface DataGridProps<T> {
  data: T[];
  keyExtractor: (row: T) => string | number;
  renderCard: (row: T) => React.ReactNode;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  emptyMessage?: string;
  className?: string;
  cardClassName?: string | ((row: T) => string);
  isLoading?: boolean;
  loadingMessage?: string;
  gridCols?: {
    default?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Bật search + quick filters. onFilter/onClearFilters dùng chung với quickFilters. */
  filterable?: boolean;
  onFilter?: (_filters: FilterConfig[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (_page: number) => void;
    onPageSizeChange?: (_size: number) => void;
    pageSizeOptions?: number[];
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (_query: string) => void;
  quickFilters?: QuickFilter[];
  onQuickFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  /** Chỉ khi có filterColumns thì mới hiện nút "Lọc" và panel Bộ lọc. Nếu không truyền thì chỉ dùng quickFilters. */
  filterColumns?: Column<T>[];
  /** Component hiển thị bên ngoài nút "Lọc" và panel Bộ lọc. Khi có filterColumns thì component này sẽ được hiển thị bên ngoài. */
  extraFiltersComponent?: React.ReactNode;
}

export function DataGrid<T extends Record<string, any>>({
  data,
  keyExtractor,
  renderCard,
  onEdit: _onEdit,
  onDelete: _onDelete,
  onCreate,
  emptyMessage = "Không có dữ liệu",
  className,
  cardClassName,
  isLoading = false,
  loadingMessage = "Đang tải...",
  gridCols = { default: 1, md: 2, lg: 3 },
  filterable = false,
  onFilter,
  filterColumns,
  pagination,
  searchable = false,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  quickFilters = [],
  onQuickFilterChange,
  onClearFilters,
  extraFiltersComponent,
}: DataGridProps<T>) {
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [quickFilterValues, setQuickFilterValues] = React.useState<
    Record<string, string>
  >({});

  const hasFilterPanel = Boolean(filterColumns?.length);
  const columnsForFilter = filterColumns ?? [];

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

  // Sync quick filter values với filters: không có filter = hiển thị "Tất cả" (__all__)
  React.useEffect(() => {
    const updated: Record<string, string> = {};
    quickFilters.forEach((qf) => {
      const filter = filters.find((f) => f.key === qf.key);
      updated[qf.key] = filter?.value ?? "__all__";
    });
    setQuickFilterValues(updated);
  }, [filters, quickFilters]);

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

          {extraFiltersComponent}

          {filterable && hasFilterPanel && (
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Lọc
              {filters.length > 0 && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                  {filters.length}
                </span>
              )}
            </Button>
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

      {/* Filter Panel - chỉ khi có filterColumns */}
      {filterable && hasFilterPanel && showFilters && (
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
                onClearFilters?.();
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
            {data.map((row) => (
              <div
                key={keyExtractor(row)}
                className={cn("relative", getCardClassName(row))}
              >
                {renderCard(row)}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-end">
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
