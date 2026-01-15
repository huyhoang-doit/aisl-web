import { useState, useMemo } from "react";
import LockerAreaCardItem from "../lockerArea/components/LockerAreaCardItem";
import LockerAreaDetailModal from "../lockerArea/modals/LockerAreaDetailModal";
import { DataGrid, type Column, type FilterConfig, type QuickFilter } from "@/shared/components/DataGrid";
import type { LockerArea } from "../lockerArea/types/lockerArea.types";

// Mock data - Thay thế bằng API call thực tế
const mockLockerAreas: LockerArea[] = [
  {
    id: "1",
    cabinetId: "1",
    code: "LA001",
    size: "small",
    status: "occupied",
    price: 50000,
    description: "Locker area nhỏ, phù hợp cho đồ nhẹ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    cabinetId: "1",
    code: "LA002",
    size: "medium",
    status: "available",
    price: 80000,
    description: "Locker area vừa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    cabinetId: "1",
    code: "LA003",
    size: "large",
    status: "occupied",
    price: 120000,
    description: "Locker area lớn, phù hợp cho đồ cồng kềnh",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    cabinetId: "2",
    code: "LA004",
    size: "medium",
    status: "reserved",
    price: 80000,
    description: "Locker area đã được đặt trước",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    cabinetId: "2",
    code: "LA005",
    size: "small",
    status: "maintenance",
    price: 50000,
    description: "Locker area đang bảo trì",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    cabinetId: "2",
    code: "LA006",
    size: "large",
    status: "available",
    price: 120000,
    description: "Locker area lớn, sẵn sàng sử dụng",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ManageLockerAreaPage = () => {
  const [lockerAreas, setLockerAreas] = useState<LockerArea[]>(mockLockerAreas);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLockerArea, setSelectedLockerArea] = useState<LockerArea | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter columns for DataGrid
  const filterColumns: Column<LockerArea>[] = [
    {
      key: "code",
      header: "Mã locker area",
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
    let result = [...lockerAreas];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lockerArea) =>
          lockerArea.code.toLowerCase().includes(query) ||
          lockerArea.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, LockerArea["status"]> = {
          "Trống": "available",
          "Đã thuê": "occupied",
          "Bảo trì": "maintenance",
          "Đã đặt": "reserved",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((lockerArea) => lockerArea.status === statusValue);
        }
      } else if (filter.key === "size") {
        const sizeMap: Record<string, LockerArea["size"]> = {
          "Nhỏ": "small",
          "Vừa": "medium",
          "Lớn": "large",
        };
        const sizeValue = sizeMap[filter.value];
        if (sizeValue) {
          result = result.filter((lockerArea) => lockerArea.size === sizeValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((lockerArea) => {
          const fieldValue = String(lockerArea[filter.key as keyof LockerArea] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    return result;
  }, [lockerAreas, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý xem chi tiết
  const handleViewDetails = (lockerArea: LockerArea) => {
    setSelectedLockerArea(lockerArea);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedLockerArea(null);
  };

  // Xử lý cập nhật trạng thái
  const handleStatusUpdate = async (lockerId: string, newStatus: LockerArea["status"]) => {
    // TODO: Gọi API để cập nhật trạng thái
    setLockerAreas(
      lockerAreas.map((la) =>
        la.id === lockerId ? { ...la, status: newStatus, updatedAt: new Date().toISOString() } : la
      )
    );
    // Cập nhật selectedLockerArea nếu đang mở modal
    if (selectedLockerArea?.id === lockerId) {
      setSelectedLockerArea({
        ...selectedLockerArea,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
    console.log("Updating locker status:", lockerId, newStatus);
  };

  // Xử lý mở cửa khẩn cấp
  const handleEmergencyOpen = async (lockerId: string) => {
    // TODO: Gọi API để mở cửa locker
    console.log("Emergency opening locker:", lockerId);
    // Có thể thêm logic ghi log hoặc thông báo
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
        <h1 className="text-2xl font-bold tracking-tight">Quản lý lockers</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các locker trong khu vực của bạn
        </p>
      </div>

      <DataGrid
        data={paginatedData}
        keyExtractor={(row) => row.id}
        renderCard={(lockerArea) => (
          <LockerAreaCardItem
            lockerArea={lockerArea}
            onClick={() => handleViewDetails(lockerArea)}
          />
        )}
        emptyMessage="Chưa có locker area nào"
        isLoading={false}
        gridCols={{ default: 1, md: 2, lg: 3, xl: 4 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo mã locker area..."
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

      {/* Modal chi tiết */}
      {selectedLockerArea && (
        <LockerAreaDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          lockerArea={selectedLockerArea}
          onStatusUpdate={handleStatusUpdate}
          onEmergencyOpen={handleEmergencyOpen}
        />
      )}
    </div>
  );
};

export default ManageLockerAreaPage;
