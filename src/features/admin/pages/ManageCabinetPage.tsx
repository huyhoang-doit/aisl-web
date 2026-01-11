import { useState, useMemo } from "react";
import CabinetCardItem from "../features/cabinet/components/CabinetCardItem";
import CreateOrUpdateCabinetModal, { type CabinetFormData } from "../features/cabinet/modals/CreateOrUpdateCabinetModal";
import CabinetDetailModal from "../features/cabinet/modals/CabinetDetailModal";
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
import type { Cabinet } from "../features/cabinet/types/cabinet.types";

// Mock data - Thay thế bằng API call thực tế
const mockCabinets: Cabinet[] = [
  {
    id: "1",
    locationId: "1",
    name: "Cabinet A1",
    code: "CAB-A1",
    description: "Cabinet đầu tiên tại địa điểm này",
    totalLockers: 20,
    availableLockers: 15,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    locationId: "1",
    name: "Cabinet A2",
    code: "CAB-A2",
    description: "Cabinet thứ hai tại địa điểm này",
    totalLockers: 20,
    availableLockers: 8,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    locationId: "2",
    name: "Cabinet B1",
    code: "CAB-B1",
    description: "Cabinet đang bảo trì",
    totalLockers: 15,
    availableLockers: 0,
    status: "maintenance",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    locationId: "2",
    name: "Cabinet B2",
    code: "CAB-B2",
    description: "Cabinet không hoạt động",
    totalLockers: 18,
    availableLockers: 18,
    status: "inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ManageCabinetPage = () => {
  const [cabinets, setCabinets] = useState<Cabinet[]>(mockCabinets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  // const [sortConfig, setSortConfig] = useState<SortConfig | null>(null); // Reserved for future use
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter columns for DataGrid
  const filterColumns: Column<Cabinet>[] = [
    {
      key: "name",
      header: "Tên cabinet",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
    },
    {
      key: "code",
      header: "Mã cabinet",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo mã",
    },
    {
      key: "status",
      header: "Trạng thái",
      filterable: true,
      filterType: "select",
      filterOptions: ["Hoạt động", "Không hoạt động", "Bảo trì"],
    },
  ];

  // Quick filters
  const quickFilters: QuickFilter[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      options: [
        { value: "Hoạt động", label: "Hoạt động" },
        { value: "Không hoạt động", label: "Không hoạt động" },
        { value: "Bảo trì", label: "Bảo trì" },
      ],
    },
  ];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...cabinets];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cabinet) =>
          cabinet.name.toLowerCase().includes(query) ||
          cabinet.code.toLowerCase().includes(query) ||
          cabinet.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, Cabinet["status"]> = {
          "Hoạt động": "active",
          "Không hoạt động": "inactive",
          "Bảo trì": "maintenance",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((cabinet) => cabinet.status === statusValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((cabinet) => {
          const fieldValue = String(cabinet[filter.key as keyof Cabinet] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    // Sorting can be added here in the future if needed
    return result;
  }, [cabinets, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedCabinet(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setModalMode("update");
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedCabinet?.id) {
      setCabinets(cabinets.filter((c) => c.id !== selectedCabinet.id));
      setIsDeleteDialogOpen(false);
      setSelectedCabinet(null);
      // Reset page if current page is empty
      const newTotalPages = Math.ceil((filteredAndSortedData.length - 1) / pageSize);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    }
  };

  // Xử lý submit form
  const handleSubmit = async (data: CabinetFormData) => {
    if (modalMode === "create") {
      // Tạo cabinet mới - cần locationId từ user hoặc default
      const newCabinet: Cabinet = {
        ...data,
        id: Date.now().toString(),
        locationId: "1", // TODO: Lấy từ context hoặc props
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCabinets([...cabinets, newCabinet]);
      // TODO: Gọi API để tạo cabinet
      console.log("Creating cabinet:", newCabinet);
    } else {
      // Cập nhật cabinet
      setCabinets(
        cabinets.map((c) =>
          c.id === selectedCabinet?.id
            ? { ...data, id: c.id, locationId: c.locationId, createdAt: c.createdAt, updatedAt: new Date().toISOString() }
            : c
        )
      );
      // TODO: Gọi API để cập nhật cabinet
      console.log("Updating cabinet:", data);
    }
    setIsModalOpen(false);
    setSelectedCabinet(null);
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (cabinet: Cabinet) => {
    setSelectedCabinet(cabinet);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedCabinet(null);
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
        <h1 className="text-2xl font-bold tracking-tight">Quản lý cabinet</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các cụm cabinet chứa nhiều locker trong hệ thống
        </p>
      </div>

      <DataGrid
        data={paginatedData}
        keyExtractor={(row) => row.id}
        renderCard={(cabinet) => (
          <CabinetCardItem
            cabinet={cabinet}
            onClick={() => handleViewDetails(cabinet)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có cabinet nào"
        isLoading={false}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, mã cabinet..."
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
      <CreateOrUpdateCabinetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        cabinetData={selectedCabinet}
        onSubmit={handleSubmit}
        mode={modalMode}
        locationId="1" // TODO: Lấy từ context hoặc state
      />

      {/* Modal chi tiết */}
      {selectedCabinet && (
        <CabinetDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          cabinet={selectedCabinet}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa cabinet</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cabinet{" "}
              <strong>{selectedCabinet?.name}</strong> ({selectedCabinet?.code})? 
              Hành động này không thể hoàn tác. Tất cả các locker trong cabinet này cũng sẽ bị xóa.
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

export default ManageCabinetPage;
