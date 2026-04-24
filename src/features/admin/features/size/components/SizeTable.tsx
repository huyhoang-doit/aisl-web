import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2, ChevronDown, ChevronUp, Smartphone, LayoutGrid, MapPin, Search } from "lucide-react";
import type { Size } from "../types/size.types";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Pagination } from "@/shared/components/ui/pagination";

/* eslint-disable no-unused-vars */
interface SizeTableProps {
  sizes: Size[];
  onEdit: (size: Size) => void;
  onDelete: (size: Size) => void;
/* eslint-enable no-unused-vars */
  isLoading?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    // eslint-disable-next-line no-unused-vars
    onPageChange: (page: number) => void;
    // eslint-disable-next-line no-unused-vars
    onPageSizeChange: (pageSize: number) => void;
  };
  // eslint-disable-next-line no-unused-vars
  onSearch?: (term: string) => void;
}

export default function SizeTable({
  sizes,
  onEdit,
  onDelete,
  isLoading,
  pagination,
  onSearch,
}: SizeTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {onSearch && (
        <div className="px-4 pt-4 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên kích thước..."
              className="pl-8 h-9"
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}

      <div className="min-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">Tên loại kích thước</TableHead>
              <TableHead>Chiều rộng (cm)</TableHead>
              <TableHead>Chiều cao (cm)</TableHead>
              <TableHead>Chiều sâu (cm)</TableHead>
              <TableHead>Số lượng Locker</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <span>Đang tải dữ liệu...</span>
                    </div>
                 </TableCell>
               </TableRow>
            ) : sizes.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Chưa có kích thước nào
                 </TableCell>
               </TableRow>
            ) : (
              sizes.map((sizeItem) => (
                <React.Fragment key={sizeItem.id}>
                  <TableRow className="hover:bg-muted/30">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleRow(sizeItem.id)}
                      >
                        {expandedRows[sizeItem.id] ? (
                          <ChevronUp className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{sizeItem.name}</TableCell>
                    <TableCell>{sizeItem.width}</TableCell>
                    <TableCell>{sizeItem.height}</TableCell>
                    <TableCell>{sizeItem.depth}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-semibold">
                        {sizeItem.lockers?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => onEdit(sizeItem)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(sizeItem)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row Detail */}
                  {expandedRows[sizeItem.id] && (
                    <TableRow className="bg-muted/5 border-b border-border/50">
                      <TableCell colSpan={7} className="p-4 bg-muted/5">
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="mb-3 px-1 flex items-center gap-2">
                             <Smartphone className="h-4 w-4 text-primary" />
                             <h4 className="text-sm font-semibold">Danh sách các locker sử dụng kích thước này</h4>
                          </div>
                          
                          {(!sizeItem.lockers || sizeItem.lockers.length === 0) ? (
                            <div className="text-[13px] text-muted-foreground py-2 italic ml-6">
                               Chưa có locker nào gán kích thước này.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                              {sizeItem.lockers.map((locker) => (
                                <div key={locker.id} className="bg-background rounded-md border border-border p-3 shadow-sm flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-primary">{locker.lockerLabel}</span>
                                    <Badge variant="outline" className="text-[10px] py-0 h-4">Locker</Badge>
                                  </div>
                                  <div className="flex flex-col gap-1.5 mt-1">
                                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                                      <LayoutGrid className="h-3.5 w-3.5" />
                                      <span>{locker.cabinetName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                                      <MapPin className="h-3.5 w-3.5" />
                                      <span className="line-clamp-1">{locker.locationName}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && sizes.length > 0 && (
        <div className="p-4 border-t">
          <Pagination
            current={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
