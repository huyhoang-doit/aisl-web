import { useState, useMemo } from "react";
import LockerCardItem from "../features/locker/components/LockerCardItem";
import CreateOrUpdateLockerModal, { type LockerFormData } from "../features/locker/modals/CreateOrUpdateLockerModal";
import LockerDetailModal from "../features/locker/modals/LockerDetailModal";
import { DataGrid, type Column, type FilterConfig, type QuickFilter } from "@/shared/components/DataGrid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import type { Locker } from "../features/locker/types/locker.types";

// Mock data - Thay thế bằng API call thực tế
const mockLockers: Locker[] = [
  {
    id: "1",
    cabinetId: "1",
    code: "L001",
    size: "small",
    status: "available",
    price: 50000,
    description: "Locker nhỏ, phù hợp cho đồ nhẹ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    cabinetId: "1",
    code: "L002",
    size: "medium",
    status: "occupied",
    price: 80000,
    description: "Locker vừa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    cabinetId: "1",
    code: "L003",
    size: "large",
    status: "available",
    price: 120000,
    description: "Locker lớn, phù hợp cho đồ cồng kềnh",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    cabinetId: "2",
    code: "L004",
    size: "medium",
    status: "reserved",
    price: 80000,
    description: "Locker đã được đặt trước",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    cabinetId: "2",
    code: "L005",
    size: "small",
    status: "maintenance",
    price: 50000,
    description: "Locker đang bảo trì",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ManageLockerPage = () => {
  const [lockers, setLockers] = useState<Locker[]>(mockLockers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  // const [sortConfig, setSortConfig] = useState<SortConfig | null>(null); // Reserved for future use
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter columns for DataGrid
  const filterColumns: Column<Locker>[] = [
    {
      key: "code",
      header: "Mã locker",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã",
    },
    {
      key: "size",
      header: "Kích thước",
      filterable: true,
      filterType: "select",
      filterOptions: ["Nhỏ", "Vừa", "Lớn"],
    },
    {
      key: "status",
      header: "Trạng thái",
      filterable: true,
      filterType: "select",
      filterOptions: ["Trống", "Đã thuê", "Bảo trì", "Đã đặt"],
    },
  ];

  // Quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Trống", label: "Trống" },
        { value: "Đã thuê", label: "Đã thuê" },
        { value: "Bảo trì", label: "Bảo trì" },
        { value: "Đã đặt", label: "Đã đặt" },
      ],
    },
    {
      key: "size",
      label: "Kích thước",
      placeholder: "Chọn kích thước",
      options: [
        { value: "Nhỏ", label: "Nhỏ" },
        { value: "Vừa", label: "Vừa" },
        { value: "Lớn", label: "Lớn" },
      ],
    },
  ];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...lockers];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (locker) =>
          locker.code.toLowerCase().includes(query) ||
          locker.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, Locker["status"]> = {
          "Trống": "available",
          "Đã thuê": "occupied",
          "Bảo trì": "maintenance",
          "Đã đặt": "reserved",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((locker) => locker.status === statusValue);
        }
      } else if (filter.key === "size") {
        const sizeMap: Record<string, Locker["size"]> = {
          "Nhỏ": "small",
          "Vừa": "medium",
          "Lớn": "large",
        };
        const sizeValue = sizeMap[filter.value];
        if (sizeValue) {
          result = result.filter((locker) => locker.size === sizeValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((locker) => {
          const fieldValue = String(locker[filter.key as keyof Locker] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    // Sorting can be added here in the future if needed
    return result;
  }, [lockers, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedLocker(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (locker: Locker) => {
    setSelectedLocker(locker);
    setModalMode("update");
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedLocker?.id) {
      setLockers(lockers.filter((l) => l.id !== selectedLocker.id));
      setIsDeleteDialogOpen(false);
      // Đóng modal detail sau khi xóa thành công
      setIsDetailModalOpen(false);
      setSelectedLocker(null);
      // Reset page if current page is empty
      const newTotalPages = Math.ceil((filteredAndSortedData.length - 1) / pageSize);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    }
  };

  // Xử lý submit form
  const handleSubmit = async (data: LockerFormData) => {
    if (modalMode === "create") {
      // Tạo locker mới - cần cabinetId từ user hoặc default
      const newLocker: Locker = {
        ...data,
        id: Date.now().toString(),
        cabinetId: "1", // TODO: Lấy từ context hoặc props
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLockers([...lockers, newLocker]);
      // TODO: Gọi API để tạo locker
      console.log("Creating locker:", newLocker);
    } else {
      // Cập nhật locker
      const updatedLocker: Locker = {
        ...data,
        id: selectedLocker!.id,
        cabinetId: selectedLocker!.cabinetId,
        createdAt: selectedLocker!.createdAt,
        updatedAt: new Date().toISOString(),
      };
      setLockers(
        lockers.map((l) =>
          l.id === selectedLocker?.id ? updatedLocker : l
        )
      );
      // Cập nhật selectedLocker để modal detail hiển thị dữ liệu mới
      if (isDetailModalOpen) {
        setSelectedLocker(updatedLocker);
      } else {
        setSelectedLocker(null);
      }
      // TODO: Gọi API để cập nhật locker
      console.log("Updating locker:", data);
    }
    setIsModalOpen(false);
    if (modalMode === "create") {
      setSelectedLocker(null);
    }
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (locker: Locker) => {
    setSelectedLocker(locker);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedLocker(null);
  };

  // Handler functions for DataGrid
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset về trang đầu khi search
  };

  const handleFilter = (newFilters: FilterConfig[]) => {
    setFilters(newFilters);
    setPage(1); // Reset về trang đầu khi filter
  };

  const handleQuickFilterChange = () => {
    setPage(1); // Reset về trang đầu khi quick filter thay đổi
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý locker</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các locker trong hệ thống
        </p>
      </div>

      <DataGrid
        data={paginatedData}
        keyExtractor={(row) => row.id}
        renderCard={(locker) => (
          <LockerCardItem
            locker={locker}
            onClick={() => handleViewDetails(locker)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có locker nào"
        isLoading={false}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo mã locker..."
        onSearch={handleSearch}
        // Filters
        filterable={true}
        filterColumns={filterColumns}
        onFilter={handleFilter}
        quickFilters={quickFilters}
        onQuickFilterChange={handleQuickFilterChange}
        onClearFilters={() => {
          setFilters([]);
          setSearchQuery("");
          setPage(1);
        }}
        // Pagination
        pagination={{
          page,
          pageSize,
          total: filteredAndSortedData.length,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          pageSizeOptions: [6, 12, 18, 24],
        }}
      />

      {/* Modal tạo/cập nhật */}
      <CreateOrUpdateLockerModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          // Khi đóng modal edit (hủy), cập nhật selectedLocker từ danh sách lockers
          // để đảm bảo modal detail hiển thị dữ liệu mới nhất
          if (!open && selectedLocker && isDetailModalOpen) {
            const updatedLocker = lockers.find((l) => l.id === selectedLocker.id);
            if (updatedLocker) {
              setSelectedLocker(updatedLocker);
            }
          }
        }}
        lockerData={selectedLocker}
        onSubmit={handleSubmit}
        mode={modalMode}
        cabinetId="1" // TODO: Lấy từ context hoặc state
      />

      {/* Modal chi tiết */}
      {selectedLocker && (
        <LockerDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          locker={selectedLocker}
          onEdit={(locker) => {
            // Không đóng modal detail, chỉ mở modal edit
            handleEdit(locker);
          }}
          onDelete={(locker) => {
            // Không đóng modal detail, chỉ mở dialog xóa
            handleDelete(locker);
          }}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          // Khi hủy dialog xóa, không làm gì cả - modal detail vẫn mở
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa locker</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa locker{" "}
              <strong>{selectedLocker?.code}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageLockerPage;
