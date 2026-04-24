import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Info, Loader2, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { KioskScreenLayout } from "../components/KioskScreenLayout";
import { useKioskStore } from "../store/kiosk.store";
import { locationService } from "@/features/admin/features/location/services/location.service";
import { lockerService } from "@/features/admin/features/locker/services/locker.service";
import type { LeastUsedLocker } from "@/features/admin/features/locker/services/locker.service";
import { sizeService } from "@/features/admin/features/size/services/size.service";
import type { Cabinet } from "@/features/admin/features/cabinet/types/cabinet.types";
import type { Size } from "@/features/admin/features/size/types/size.types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { axiosInstance } from "@/shared/lib/api/axios-instance";

const STEPS = ["Cụm tủ", "Kích thước", "Ngăn tủ", "Loại hàng", "Xác nhận"];

/**
 * Trang Thuê Tủ tại Kiosk.
 * Flow: Chọn Cụm tủ -> Chọn Kích thước -> Chọn Ngăn tủ (gợi ý) -> Chọn Loại sản phẩm -> Xác nhận.
 */
const KioskRentPage = () => {
  const navigate = useNavigate();
  const { locationId } = useKioskStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [lockers, setLockers] = useState<LeastUsedLocker[]>([]);
  
  // Selection state
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<"FOOD" | "OTHER">("OTHER");

  // Load cabinets for current location
  useEffect(() => {
    if (!locationId) return;
    setLoading(true);
    locationService.getCabinetLocation(locationId, { limit: 100 })
      .then(res => setCabinets(res.data.cabinets))
      .catch(() => toast.error("Không thể tải danh sách cụm tủ"))
      .finally(() => setLoading(false));
  }, [locationId]);

  // Load sizes
  useEffect(() => {
    sizeService.getAll({ limit: 100 })
      .then(res => setSizes(res.data.sizes))
      .catch(() => {});
  }, []);

  // Load available lockers when cabinet + size selected
  useEffect(() => {
    if (currentStep === 2 && selectedCabinetId) {
      setLoading(true);
      lockerService.getLeastUsed(selectedCabinetId)
        .then(res => {
          const filtered = res.data.lockers.filter(l => 
            l.status === "AVAILABLE" && (!selectedSizeId || l.sizeTypeId === selectedSizeId)
          );
          setLockers(filtered);
          // Auto select first available if any
          if (filtered.length > 0 && !selectedLockerId) {
            setSelectedLockerId(filtered[0].id);
          }
        })
        .catch(() => toast.error("Không thể tải danh sách ngăn tủ"))
        .finally(() => setLoading(false));
    }
  }, [currentStep, selectedCabinetId, selectedSizeId, selectedLockerId]);

  const canContinue = useMemo(() => {
    if (currentStep === 0) return !!selectedCabinetId;
    if (currentStep === 1) return !!selectedSizeId;
    if (currentStep === 2) return !!selectedLockerId;
    if (currentStep === 3) return true;
    return true;
  }, [currentStep, selectedCabinetId, selectedSizeId, selectedLockerId]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleConfirmRent();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/kiosk/home");
    }
  };

  const handleConfirmRent = async () => {
    if (!selectedLockerId) return;
    setLoading(true);
    try {
      // Gọi API thuê tủ (Flexible rent)
      await axiosInstance.post("/lockers/rent", {
        lockerId: selectedLockerId,
        cabinetId: selectedCabinetId,
        itemType: selectedItemType,
        skipPhysicalOpen: false
      });
      
      toast.success("Đăng ký thuê tủ thành công!");
      navigate("/kiosk/home"); // Về home hoặc trang success
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi đăng ký thuê tủ");
    } finally {
      setLoading(false);
    }
  };

  // UI Render Helpers
  const renderStepHeader = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        {STEPS.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              <div className={cn(
                "size-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300",
                isCurrent ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg" :
                isActive ? "bg-primary/20 text-primary border-primary/50" : "bg-muted text-muted-foreground border-transparent"
              )}>
                {isActive && index < currentStep ? <Check className="size-6" /> : index + 1}
              </div>
              <span className={cn("text-xs font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderCabinetStep = () => (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-bold mb-2">Chọn Cụm tủ</h2>
      {cabinets.map((cab) => (
        <Card 
          key={cab.id} 
          className={cn(
            "cursor-pointer transition-all border-2",
            selectedCabinetId === cab.id ? "border-primary bg-primary/5" : "border-transparent"
          )}
          onClick={() => setSelectedCabinetId(cab.id)}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Package className="size-8" />
            </div>
            <div>
              <p className="text-xl font-semibold">{cab.name}</p>
              <p className="text-sm text-muted-foreground">{cab.address}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      {!loading && cabinets.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">Không tìm thấy cụm tủ nào tại vị trí này.</p>
      )}
    </div>
  );

  const renderSizeStep = () => (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-bold mb-2">Hướng dẫn chọn size</h2>
      {sizes.map((size) => (
        <Card 
          key={size.id} 
          className={cn(
            "cursor-pointer transition-all border-2",
            selectedSizeId === size.id ? "border-primary bg-primary/5" : "border-transparent"
          )}
          onClick={() => setSelectedSizeId(size.id)}
        >
          <CardContent className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                 {size.name.charAt(0)}
               </div>
               <div>
                  <p className="text-xl font-semibold">{size.name}</p>
                  <p className="text-sm text-muted-foreground">{size.width}x{size.height}x{size.depth} (cm)</p>
               </div>
            </div>
            {selectedSizeId === size.id && <Check className="text-primary size-6" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLockerStep = () => (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-bold mb-2">Chọn Ngăn tủ</h2>
      <div className="grid grid-cols-3 gap-3">
        {lockers.map((locker) => (
          <Button
            key={locker.id}
            variant={selectedLockerId === locker.id ? "default" : "outline"}
            className={cn(
              "min-h-[80px] text-xl font-bold rounded-xl border-2",
              selectedLockerId === locker.id ? "border-primary shadow-md" : "border-muted-foreground/20"
            )}
            onClick={() => setSelectedLockerId(locker.id)}
          >
            {locker.lockerLabel}
          </Button>
        ))}
      </div>
      {lockers.length === 0 && (
        <div className="text-center p-8 bg-muted/50 rounded-2xl">
          <Info className="size-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Rất tiếc, hiện không có ngăn tủ nào phù hợp còn trống.</p>
        </div>
      )}
    </div>
  );

  const renderItemTypeStep = () => (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Loại hàng gửi</h2>
      <div className="grid grid-cols-1 gap-4">
        {[
          { id: "OTHER", label: "Hàng thông thường", desc: "Quần áo, sách vở, đồ dùng gia đình..." },
          { id: "FOOD", label: "Thực phẩm", desc: "Đồ khô, đồ ăn có đóng hộp..." }
        ].map(type => (
          <Card 
            key={type.id}
            className={cn(
              "cursor-pointer transition-all border-2",
              selectedItemType === type.id ? "border-primary bg-primary/5" : "border-transparent"
            )}
            onClick={() => setSelectedItemType(type.id as any)}
          >
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-1">{type.label}</p>
              <p className="text-sm text-muted-foreground">{type.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConfirmStep = () => {
    const cabinet = cabinets.find(c => c.id === selectedCabinetId);
    const size = sizes.find(s => s.id === selectedSizeId);
    const locker = lockers.find(l => l.id === selectedLockerId);
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Xác nhận thông tin</h2>
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="text-muted-foreground">Cụm tủ:</span>
              <span className="font-semibold">{cabinet?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-muted-foreground">Kích thước:</span>
              <span className="font-semibold">{size?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-muted-foreground">Số ngăn:</span>
              <span className="font-bold text-primary">{locker?.lockerLabel}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-muted-foreground">Loại hàng:</span>
              <span className="font-semibold">{selectedItemType === "FOOD" ? "Thực phẩm" : "Thông thường"}</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground bg-muted p-4 rounded-xl italic">
          * Phí thuê sẽ bắt đầu được tính ngay khi bạn nhấn xác nhận và bỏ đồ vào tủ.
        </p>
      </div>
    );
  };

  return (
    <KioskScreenLayout>
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="self-start min-h-[56px] text-lg mb-6 hover:bg-transparent -ml-4"
        onClick={handleBack}
      >
        <ArrowLeft className="size-6 mr-2" /> Quay lại
      </Button>

      {renderStepHeader()}

      <div className="flex-1 overflow-y-auto py-2">
        {loading && currentStep !== 2 && (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="size-10 text-primary animate-spin" />
          </div>
        )}
        {!loading && (
          <>
            {currentStep === 0 && renderCabinetStep()}
            {currentStep === 1 && renderSizeStep()}
            {currentStep === 2 && renderLockerStep()}
            {currentStep === 3 && renderItemTypeStep()}
            {currentStep === 4 && renderConfirmStep()}
          </>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-4 border-t sticky bottom-0 bg-gradient-background">
        <Button
          size="lg"
          className="w-full min-h-[72px] text-2xl font-bold rounded-2xl shadow-xl shadow-primary/20"
          disabled={!canContinue || loading}
          onClick={handleNext}
        >
          {loading ? <Loader2 className="size-6 animate-spin" /> : 
           currentStep === STEPS.length - 1 ? "Xác nhận & Thuê" : "Tiếp tục"}
        </Button>
      </div>
    </KioskScreenLayout>
  );
};

export default KioskRentPage;
