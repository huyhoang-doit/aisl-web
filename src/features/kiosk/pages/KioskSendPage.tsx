import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Phone, User, MapPin, Loader2, Search, Package } from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useDispatchSocket } from "../hooks/useDispatchSocket";
import { useAuthStore } from "@/features/auth/store/auth.store";

const STEPS = ["Cụm tủ đích", "Kích thước", "Ngăn tủ đích", "Người nhận", "Xác nhận & Gửi"];

const KioskSendPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { locationId } = useKioskStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFindingCourier, setIsFindingCourier] = useState(false);
  
  // Data state
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [lockers, setLockers] = useState<LeastUsedLocker[]>([]);
  
  // Selection state
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  
  // Recipient info
  const [recipient, setRecipient] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  const [isOpeningLocker, setIsOpeningLocker] = useState(false);
  const [lockerOpened, setLockerOpened] = useState(false);
  
  // Socket logic - chỉ active khi đang tìm tài xế
  const { courierInfo } = useDispatchSocket(isFindingCourier ? user?.id : undefined);

  // Auto-redirect or handle success when courier found
  const handleAutoOpen = useCallback(async (orderId: string) => {
    setIsOpeningLocker(true);
    try {
      const res = await axiosInstance.get(`/orders/me/${orderId}`);
      const orderDetails = res.data.orderDetails || [];
      const dropDetail = orderDetails.find((d: any) => d.accessCode?.type === "LOGISTIC_DROP");
      const otp = dropDetail?.accessCode?.otp;

      if (otp) {
        toast.info("Tài xế đã nhận đơn. Đang tự động mở tủ...");
        await axiosInstance.post("/access-codes/validate", { otp });
        setLockerOpened(true);
        toast.success("Tủ đã mở! Vui lòng bỏ hàng vào.");
      } else {
        toast.success(`Đã tìm thấy tài xế: ${courierInfo?.courierName}`);
      }
    } catch (err) {
      console.error("Auto open failed", err);
      toast.error("Không thể tự động mở tủ. Vui lòng mở bằng mã thủ công.");
    } finally {
      setIsOpeningLocker(true); // Keep it true to prevent re-triggering
      setIsOpeningLocker(false);
    }
  }, [courierInfo?.courierName]);

  // Auto-redirect or handle success when courier found
  useEffect(() => {
    if (courierInfo && !lockerOpened) {
      handleAutoOpen(courierInfo.orderId);
    }
  }, [courierInfo, handleAutoOpen, lockerOpened]);

  // Redirect after success
  useEffect(() => {
    if (lockerOpened || (courierInfo && !isOpeningLocker)) {
      const timer = setTimeout(() => {
        navigate("/kiosk/home");
      }, lockerOpened ? 10000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [lockerOpened, courierInfo, isOpeningLocker, navigate]);

  // Load cabinets for current site
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

  // Load available lockers for destination
  useEffect(() => {
    if (currentStep === 2 && selectedCabinetId) {
      setLoading(true);
      lockerService.getLeastUsed(selectedCabinetId)
        .then(res => {
          const filtered = res.data.lockers.filter(l => 
            l.status === "AVAILABLE" && (!selectedSizeId || l.sizeTypeId === selectedSizeId)
          );
          setLockers(filtered);
          if (filtered.length > 0 && !selectedLockerId) {
            setSelectedLockerId(filtered[0].id);
          }
        })
        .catch(() => toast.error("Không thể tải danh sách ngăn tủ đích"))
        .finally(() => setLoading(false));
    }
  }, [currentStep, selectedCabinetId, selectedSizeId, selectedLockerId]);

  const canContinue = useMemo(() => {
    if (currentStep === 0) return !!selectedCabinetId;
    if (currentStep === 1) return !!selectedSizeId;
    if (currentStep === 2) return !!selectedLockerId;
    if (currentStep === 3) return !!recipient.name && recipient.phone.length >= 10 && !!recipient.address;
    return true;
  }, [currentStep, selectedCabinetId, selectedSizeId, selectedLockerId, recipient]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleConfirmSend();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/kiosk/home");
    }
  };

  const handleConfirmSend = async () => {
    setLoading(true);
    try {
      // Find current site location info
      const siteLoc = await locationService.getById(locationId!);
      
      const payload = {
        recipientPhone: recipient.phone,
        recipientName: recipient.name,
        itemType: "OTHER",
        lockerId: selectedLockerId,
        senderAddress: siteLoc.data.address,
        receiverAddress: recipient.address,
        note: recipient.note,
        logisticsType: "LOCKER_TO_LOCKER"
      };

      await axiosInstance.post("/logistics/send", payload);
      
      setIsFindingCourier(true);
      toast.success("Đã tạo yêu cầu gửi hàng!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi khi gửi hàng");
    } finally {
      setLoading(false);
    }
  };

  if (isFindingCourier) {
    return (
      <KioskScreenLayout className="items-center justify-center py-12">
        <div className="text-center space-y-8 max-w-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
            <div className="relative size-32 rounded-full bg-primary flex items-center justify-center text-primary-foreground mx-auto shadow-2xl">
              <Search className="size-16 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
             <h1 className="text-3xl font-bold">{lockerOpened ? "Tủ đã mở!" : isOpeningLocker ? "Đang mở tủ..." : "Đang tìm tài xế"}</h1>
             <p className="text-xl text-muted-foreground">
               {lockerOpened ? "Hệ thống đã tự động mở tủ. Vui lòng bỏ hàng vào và đóng tủ lại." : 
                isOpeningLocker ? "Vui lòng đợi giây lát, hệ thống đang kích hoạt khóa tủ..." :
                "Vui lòng đợi trong giây lát, chúng tôi đang kết nối với tài xế gần nhất..."}
             </p>
          </div>

          {(courierInfo || lockerOpened) && (
            <div className={cn(
              "border-2 rounded-3xl p-6 animate-in slide-in-from-bottom duration-500",
              lockerOpened ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
            )}>
               {lockerOpened ? (
                 <Package className="size-12 text-blue-600 mx-auto mb-4" />
               ) : (
                 <Check className="size-12 text-green-600 mx-auto mb-4" />
               )}
               <p className={cn("text-2xl font-bold", lockerOpened ? "text-blue-800" : "text-green-800")}>
                 {lockerOpened ? "Sẵn sàng nhận hàng" : "Đã nhận đơn!"}
               </p>
               {courierInfo && (
                 <div className="mt-4 text-left space-y-2">
                   <p className="text-lg"><strong>Tài xế:</strong> {courierInfo.courierName}</p>
                   <p className="text-lg"><strong>SĐT:</strong> {courierInfo.courierPhone}</p>
                   <p className="text-lg"><strong>Mã đơn:</strong> {courierInfo.orderCode}</p>
                 </div>
               )}
            </div>
          )}

          {!courierInfo && (
             <Button variant="ghost" size="lg" className="text-lg" onClick={() => setIsFindingCourier(false)}>
                Hủy yêu cầu
             </Button>
          )}
        </div>
      </KioskScreenLayout>
    );
  }

  return (
    <KioskScreenLayout>
      <Button 
        variant="ghost" 
        className="self-start min-h-[56px] text-lg mb-6 hover:bg-transparent -ml-4"
        onClick={handleBack}
      >
        <ArrowLeft className="size-6 mr-2" /> Quay lại
      </Button>

      {/* Basic Step Header */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((step, index) => {
            const isActive = index <= currentStep;
            return (
              <div key={step} className={cn(
                "size-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                index === currentStep ? "bg-primary text-primary-foreground border-primary" :
                isActive ? "bg-primary/20 text-primary border-primary/50" : "bg-muted text-muted-foreground border-transparent"
              )}>
                {isActive && index < currentStep ? <Check className="size-4" /> : index + 1}
              </div>
            );
          })}
        </div>
        <div className="w-full h-1 bg-muted rounded-full">
           <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
         {loading && currentStep !== 2 && (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
         )}
         
         {!loading && (
           <>
             {currentStep === 0 && (
               <div className="space-y-4">
                 <h2 className="text-2xl font-bold">Chọn Cụm tủ Đích</h2>
                 <div className="grid grid-cols-1 gap-3">
                   {cabinets.map(cab => (
                     <Card 
                       key={cab.id} 
                       className={cn("cursor-pointer border-2", selectedCabinetId === cab.id ? "border-primary bg-primary/5" : "border-transparent")}
                       onClick={() => setSelectedCabinetId(cab.id)}
                     >
                       <CardContent className="p-5 flex items-center gap-4">
                         <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <MapPin className="size-7" />
                         </div>
                         <p className="text-lg font-semibold">{cab.name}</p>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               </div>
             )}

             {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Kích thước ngăn tủ</h2>
                  {sizes.map(size => (
                    <Card key={size.id} className={cn("cursor-pointer border-2", selectedSizeId === size.id ? "border-primary bg-primary/5" : "border-transparent")} onClick={() => setSelectedSizeId(size.id)}>
                      <CardContent className="p-5 flex justify-between items-center">
                         <span className="text-lg font-medium">{size.name}</span>
                         <span className="text-sm text-muted-foreground">{size.width}x{size.height}cm</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
             )}

             {currentStep === 2 && (
                <div className="space-y-4">
                   <h2 className="text-2xl font-bold">Chọn Ngăn tủ</h2>
                   <div className="grid grid-cols-4 gap-2">
                     {lockers.map(l => (
                       <Button key={l.id} variant={selectedLockerId === l.id ? "default" : "outline"} className="h-16 text-lg font-bold" onClick={() => setSelectedLockerId(l.id)}>
                         {l.lockerLabel}
                       </Button>
                     ))}
                   </div>
                </div>
             )}

             {currentStep === 3 && (
                <div className="space-y-6">
                   <h2 className="text-2xl font-bold">Thông tin người nhận</h2>
                   <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-lg flex items-center gap-2"><User className="size-5" /> Họ tên</Label>
                        <Input id="name" value={recipient.name} onChange={e => setRecipient({...recipient, name: e.target.value})} placeholder="Nhập tên người nhận" className="h-14 text-lg" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-lg flex items-center gap-2"><Phone className="size-5" /> Số điện thoại</Label>
                        <Input id="phone" value={recipient.phone} onChange={e => setRecipient({...recipient, phone: e.target.value})} placeholder="0xxx xxx xxx" className="h-14 text-lg" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address" className="text-lg flex items-center gap-2"><MapPin className="size-5" /> Địa chỉ cụ thể</Label>
                        <Input id="address" value={recipient.address} onChange={e => setRecipient({...recipient, address: e.target.value})} placeholder="Số nhà, tên đường..." className="h-14 text-lg" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="note" className="text-lg">Ghi chú</Label>
                        <Textarea id="note" value={recipient.note} onChange={e => setRecipient({...recipient, note: e.target.value})} placeholder="Lưu ý cho tài xế..." className="text-lg" />
                      </div>
                   </div>
                </div>
             )}

             {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   <h2 className="text-2xl font-bold text-center">Kiểm tra lại thông tin</h2>
                   <Card className="bg-muted/30 border-dashed border-2">
                     <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 text-lg pb-3 border-b">
                           <span className="text-muted-foreground">Tới cụm tủ:</span>
                           <span className="font-bold text-right">{cabinets.find(c => c.id === selectedCabinetId)?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 text-lg pb-3 border-b">
                           <span className="text-muted-foreground">Người nhận:</span>
                           <span className="font-bold text-right">{recipient.name}</span>
                        </div>
                        <div className="grid grid-cols-2 text-lg pb-3 border-b">
                           <span className="text-muted-foreground">Điện thoại:</span>
                           <span className="font-bold text-right">{recipient.phone}</span>
                        </div>
                        <div className="grid grid-cols-2 text-lg">
                           <span className="text-muted-foreground">Địa chỉ:</span>
                           <span className="font-medium text-right">{recipient.address}</span>
                        </div>
                     </CardContent>
                   </Card>
                </div>
             )}
           </>
         )}
      </div>

      <div className="mt-8 pt-4 border-t sticky bottom-0 bg-gradient-background">
        <Button
          size="lg"
          className="w-full min-h-[72px] text-2xl font-bold rounded-2xl shadow-lg"
          disabled={!canContinue || loading}
          onClick={handleNext}
        >
          {loading ? <Loader2 className="size-6 animate-spin" /> : 
           currentStep === STEPS.length - 1 ? "Xác nhận & Gửi ngay" : "Tiếp tục"}
        </Button>
      </div>
    </KioskScreenLayout>
  );
};

export default KioskSendPage;
