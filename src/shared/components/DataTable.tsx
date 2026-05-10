/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (_row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select" | "date" | "number";
  filterOptions?: string[];
  filterPlaceholder?: string;
}

export interface ActionButton<T> {
  label?: string;
  icon?: React.ReactNode;
  onClick: (_row: T) => void;
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
  className?: string;
  /** Chỉ hiển thị action khi return true (theo từng dòng) */
  visible?: (_row: T) => boolean;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  key: string;
  value: string;
  type: "text" | "select" | "date" | "number";
}

export interface QuickFilter {
  allSelectedLabel?: string;
  key: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  allStringValue?: string;
  /** Ẩn option "Tất cả", dùng với defaultValue khi mặc định đã đủ */
  hideAllOption?: boolean;
  /** Giá trị hiển thị khi chưa chọn (dùng khi hideAllOption) */
  defaultValue?: string;
}

const EMPTY_QUICK_FILTERS: QuickFilter[] = [];

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  customActions?: ActionButton<T>[];
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T) => string);
  isLoading?: boolean;
  loadingMessage?: string;
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
  // Quick Filters (hiển thị ngay trên toolbar)
  quickFilters?: QuickFilter[];
  onQuickFilterChange?: (key: string, value: string) => void;
  onClearFilters?: () => void;
  hasExternalFilters?: boolean;
  extraFiltersComponent?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onEdit,
  onDelete,
  onCreate,
  customActions = [],
  emptyMessage = "Không có dữ liệu",
  className,
  headerClassName,
  rowClassName,
  isLoading = false,
  loadingMessage = "Đang tải...",
  // Sorting
  sortable = false,
  defaultSort,
  onSort,
  // Filtering
  filterable = false,
  onFilter,
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
  // Quick Filters (default stable ref to avoid useEffect loop when not passed)
  quickFilters = EMPTY_QUICK_FILTERS,
  onQuickFilterChange,
  onClearFilters,
  hasExternalFilters = false,
  extraFiltersComponent
}: DataTableProps<T>) {
  console.log("🚀 ~ DataTable ~ data:", data)
  const [sortConfig, setSortConfig] = React.useState<SortConfig | null>(
    defaultSort || null
  );
  const [filters, setFilters] = React.useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [quickFilterValues, setQuickFilterValues] = React.useState<
    Record<string, string>
  >({});

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    const newSort: SortConfig = {
      key: columnKey,
      direction:
        sortConfig?.key === columnKey && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    };

    setSortConfig(newSort);
    onSort?.(newSort);
  };

  // Handle filter change
  const handleFilterChange = (
    key: string,
    value: string,
    type: FilterConfig["type"]
  ) => {
    // "__all__" is a special value to clear the filter
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
    const qf = quickFilters.find((q) => q.key === key);
    const isDefaultValue = !isClear && !!qf?.defaultValue && value === qf.defaultValue;

    const newValues = { ...quickFilterValues };
    if (isClear) {
      delete newValues[key];
    } else {
      newValues[key] = value;
    }
    setQuickFilterValues(newValues);

    const newFilters = filters.filter((f) => f.key !== key);
    if (!isClear && value && !isDefaultValue) {
      newFilters.push({
        key,
        value,
        type: "select",
      });
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
    onQuickFilterChange?.(key, isClear || isDefaultValue ? "" : value);
  };

  // Sync quick filter values with filters: không có filter = "Tất cả" hoặc defaultValue
  React.useEffect(() => {
    const updated: Record<string, string> = {};
    quickFilters.forEach((qf) => {
      const filter = filters.find((f) => f.key === qf.key);
      updated[qf.key] = filter?.value ?? qf.defaultValue ?? "__all__";
    });
    setQuickFilterValues(updated);
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

  const getRowClassName = (row: T): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(row);
    }
    return rowClassName || "";
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
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
                  <SelectTrigger className="w-[180px] text-muted-foreground">
                    <SelectValue
                      placeholder={quickFilter.placeholder || quickFilter.label}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!quickFilter.hideAllOption && (
                      <SelectItem value="__all__">{quickFilter.allStringValue || "Tất cả"}</SelectItem>
                    )}
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
          {filterable && (
            <div className="relative">
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
            </div>
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
          {(filters.length > 0 || hasExternalFilters) && (
            <Button
              onClick={() => {
                setFilters([]);
                setShowFilters(false);
                setSearchQuery("");
                onFilter?.([]);
                onSearch?.("");
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
      {filterable && showFilters && (
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
            {columns
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
                const column = columns.find((col) => col.key === filter.key);
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

      {/* Table */}
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader className={headerClassName}>
            <TableRow>
              {selectable && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Chọn tất cả"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "font-semibold",
                    column.headerClassName,
                    sortable &&
                    column.sortable !== false &&
                    "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() =>
                    sortable &&
                    column.sortable !== false &&
                    handleSort(column.key)
                  }
                >
                  <div className="flex items-center">
                    {column.header}
                    {sortable &&
                      column.sortable !== false &&
                      getSortIcon(column.key)}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete || customActions.length > 0) && (
                <TableHead className="w-[120px] text-right font-semibold">
                  Thao tác
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (onEdit || onDelete || customActions.length > 0 ? 1 : 0)
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (onEdit || onDelete || customActions.length > 0 ? 1 : 0)
                  }
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowKey = keyExtractor(row);
                const isSelected = isRowSelected(row);
                return (
                  <TableRow
                    key={rowKey}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      isSelected && "bg-muted/30",
                      getRowClassName(row)
                    )}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(row, checked as boolean)
                          }
                          aria-label={`Chọn ${rowKey}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={cn("align-middle", column.className)}
                      >
                        {column.accessor
                          ? column.accessor(row)
                          : (row[column.key] as React.ReactNode)}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete || customActions.length > 0) && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {customActions
                            .filter((action) => !action.visible || action.visible(row))
                            .map((action, index) => (
                              <Button
                                key={index}
                                variant={action.variant || "ghost"}
                                size="icon"
                                onClick={() => action.onClick(row)}
                                className={cn("h-8 w-8", action.className)}
                                title={action.label}
                              >
                                {action.icon || action.label}
                              </Button>
                            ))}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(row)}
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(row)}
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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
