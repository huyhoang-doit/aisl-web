import { useState, useMemo } from "react";
import LocationCardItem from "../features/location/components/LocationCardItem";
import CreateOrUpdateLocationModal, { type LocationFormData } from "../features/location/modals/CreateOrUpdateLocationModal";
import LocationDetailModal from "../features/location/modals/LocationDetailModal";
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
import type { Location } from "../features/location/types/location.types";
import { DataGrid, type Column, type FilterConfig, type QuickFilter } from "@/shared/components/DataGrid";

// Mock data - Thay thế bằng API call thực tế
const mockLocations: Location[] = [
  {
    id: "1",
    name: "Tòa nhà A - Tầng 1",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    description: "Địa điểm đặt tủ locker ở tầng 1 tòa nhà A",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Tòa nhà B - Tầng 2",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    description: "Địa điểm đặt tủ locker ở tầng 2 tòa nhà B",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Tòa nhà C - Tầng 3",
    address: "789 Đường DEF, Quận 5, TP.HCM",
    description: "Địa điểm đặt tủ locker ở tầng 3 tòa nhà C",
    status: "inactive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ManageLocationPage = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter columns for DataGrid
  const filterColumns: Column<Location>[] = [
    {
      key: "name",
      header: "Tên địa điểm",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo tên",
    },
    {
      key: "address",
      header: "Địa chỉ",
      filterable: true,
      filterType: "text",
      filterPlaceholder: "Tìm theo địa chỉ",
    },
    {
      key: "status",
      header: "Trạng thái",
      filterable: true,
      filterType: "select",
      filterOptions: ["Hoạt động", "Không hoạt động"],
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
      ],
    },
  ];

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...locations];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (location) =>
          location.name.toLowerCase().includes(query) ||
          location.address.toLowerCase().includes(query) ||
          location.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      if (filter.key === "status") {
        const statusMap: Record<string, Location["status"]> = {
          "Hoạt động": "active",
          "Không hoạt động": "inactive",
        };
        const statusValue = statusMap[filter.value];
        if (statusValue) {
          result = result.filter((location) => location.status === statusValue);
        }
      } else {
        const value = filter.value.toLowerCase();
        result = result.filter((location) => {
          const fieldValue = String(location[filter.key as keyof Location] || "").toLowerCase();
          return fieldValue.includes(value);
        });
      }
    });

    // Sorting can be added here in the future if needed
    return result;
  }, [locations, searchQuery, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, page, pageSize]);

  // Xử lý tạo mới
  const handleCreate = () => {
    setSelectedLocation(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setModalMode("update");
    setIsModalOpen(true);
  };

  // Xử lý xóa
  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setIsDeleteDialogOpen(true);
  };

  // Xác nhận xóa
  const confirmDelete = () => {
    if (selectedLocation?.id) {
      setLocations(locations.filter((l) => l.id !== selectedLocation.id));
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
      // Reset page if current page is empty
      const newTotalPages = Math.ceil((filteredAndSortedData.length - 1) / pageSize);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    }
  };

  // Xử lý submit form
  const handleSubmit = async (data: LocationFormData) => {
    if (modalMode === "create") {
      // Tạo location mới
      const newLocation: Location = {
        ...data,
        id: Date.now().toString(), // Thay bằng ID từ API
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLocations([...locations, newLocation]);
      // TODO: Gọi API để tạo location
      console.log("Creating location:", newLocation);
    } else {
      // Cập nhật location
      setLocations(
        locations.map((l) =>
          l.id === selectedLocation?.id
            ? { ...data, id: l.id, createdAt: l.createdAt, updatedAt: new Date().toISOString() }
            : l
        )
      );
      // TODO: Gọi API để cập nhật location
      console.log("Updating location:", data);
    }
  };

  // Xử lý xem chi tiết
  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  // Xử lý đóng detail modal và refresh data nếu cần
  const handleDetailModalClose = (open: boolean | Location) => {
    if (typeof open === "boolean") {
      setIsDetailModalOpen(open);
      if (!open) {
        setSelectedLocation(null);
      }
    } else {
      // Location was updated
      setLocations(
        locations.map((l) => (l.id === open.id ? open : l))
      );
      setIsDetailModalOpen(false);
      setSelectedLocation(null);
    }
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
        <h1 className="text-2xl font-bold tracking-tight">Quản lý địa điểm đặt tủ</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các địa điểm đặt các cụm cabinet trong hệ thống
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Tổng số địa điểm: <strong>{locations.length}</strong>
        </div>
        {/* <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm địa điểm mới
        </Button> */}
      </div>


      <DataGrid
        data={paginatedData}
        keyExtractor={(row) => row.id}
        renderCard={(location) => (
          <LocationCardItem
            location={location}
            onClick={() => handleViewDetails(location)}
          />
        )}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        emptyMessage="Chưa có địa điểm nào"
        isLoading={false}
        gridCols={{ default: 1, md: 2, lg: 3 }}
        // Search
        searchable={true}
        searchPlaceholder="Tìm kiếm theo tên, địa chỉ..."
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
      <CreateOrUpdateLocationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        locationData={selectedLocation}
        onSubmit={handleSubmit}
        mode={modalMode}
      />

      {/* Modal chi tiết */}
      {selectedLocation && (
        <LocationDetailModal
          open={isDetailModalOpen}
          onOpenChange={handleDetailModalClose}
          location={selectedLocation}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateLocation={(updatedLocation) => {
            setLocations(
              locations.map((l) =>
                l.id === updatedLocation.id ? updatedLocation : l
              )
            );
          }}
        />
      )}

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa địa điểm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa địa điểm{" "}
              <strong>{selectedLocation?.name}</strong>? Hành động này không thể hoàn tác.
              Tất cả các cabinet và locker trong địa điểm này cũng sẽ bị xóa.
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

export default ManageLocationPage;