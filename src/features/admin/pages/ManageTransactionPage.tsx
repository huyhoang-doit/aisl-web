import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "../features/transaction/api/transaction.api";
import type {
  TransactionQueryParams,
  TransactionStatus,
  TransactionType,
} from "../features/transaction/types/transaction.types";
import { format } from "date-fns";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function ManageTransactionPage() {
  const [params, setParams] = useState<TransactionQueryParams>({
    page: 1,
    limit: 10,
    search: undefined,
    status: undefined,
    type: undefined,
    orderBy: "createdAt",
    orderDirection: "DESC",
    fromDate: undefined,
    toDate: undefined,
  });

  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionApi.getTransactions(params),
  });

  const handleSearch = () => {
    setParams((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Lịch sử giao dịch</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ Lọc & Tìm Kiếm</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Mã giao dịch</label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã giao dịch..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button variant="secondary" onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="w-full md:w-[200px] space-y-2">
            <label className="text-sm font-medium">Loại giao dịch</label>
            <Select
              value={params.type || "ALL"}
              onValueChange={(val) =>
                setParams((prev) => ({
                  ...prev,
                  type: val === "ALL" ? undefined : (val as TransactionType),
                  page: 1,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="TOPUP">Nạp tiền (TOPUP)</SelectItem>
                <SelectItem value="PAYMENT">Thanh toán (PAYMENT)</SelectItem>
                <SelectItem value="REFUND">Hoàn tiền (REFUND)</SelectItem>
                <SelectItem value="WITHDRAW">Rút tiền (WITHDRAW)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-[200px] space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <Select
              value={params.status || "ALL"}
              onValueChange={(val) =>
                setParams((prev) => ({
                  ...prev,
                  status: val === "ALL" ? undefined : (val as TransactionStatus),
                  page: 1,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="SUCCESS">Thành công</SelectItem>
                <SelectItem value="PENDING">Đang chờ xử lý</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Giao Dịch</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Số Tiền</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thời Gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-red-500">
                    Đã có lỗi xảy ra khi tải dữ liệu giao dịch.
                  </TableCell>
                </TableRow>
              ) : !data?.items?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Không tìm thấy giao dịch nào.
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.transactionCode || tx.id}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[120px]" title={tx.userId}>
                      {tx.userId}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {tx.type === "PAYMENT" || tx.type === "WITHDRAW" ? "-" : "+"}
                      {tx.amount.toLocaleString("vi-VN")} đ
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tx.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tx.status)} variant="secondary">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.createdAt ? format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm") : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Hiển thị trang {data.page} / {data.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: Math.max(1, (p.page || 1) - 1) }))}
                disabled={data.page <= 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                disabled={data.page >= data.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
