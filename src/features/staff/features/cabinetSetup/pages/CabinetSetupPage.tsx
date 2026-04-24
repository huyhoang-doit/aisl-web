import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SetupCabinetFormValues } from "../schemas/cabinetSetup.schema";
import { setupCabinetSchema } from "../schemas/cabinetSetup.schema";
import { BasicInfoStep } from "../components/steps/BasicInfoStep";
import { CabinetSelectionStep } from "../components/steps/CabinetSelectionStep";
import { CabinetDetailCarousel } from "../components/steps/CabinetDetailCarousel";
import { ReviewStep } from "../components/steps/ReviewStep";
import { SetupProgressStep } from "../components/steps/SetupProgressStep";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { toast } from "sonner";
import { Check, ChevronRight, Wifi, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cabinetSetupService } from "../services/cabinetSetup.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { SlaveDetail } from "../types/cabinetSetup.types";
import { useDiscoverySocket } from "../hooks/useDiscoverySocket";
import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[Boundary] Error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function ErrorFallback({error}: {error: Error | null}) {
  return (
    <div className="p-10 border-2 border-dashed border-destructive/30 rounded-3xl bg-destructive/5 flex flex-col items-center text-center gap-4">
      <div className="p-4 bg-destructive/10 rounded-full text-destructive">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-destructive">Đã xảy ra lỗi hiển thị</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{error?.message || "Không xác định"}</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
        Thử tải lại trang
      </Button>
    </div>
  );
}

const STEPS = [
  { id: "connection", title: "Kết nối & Quét" },
  { id: "selection", title: "Chọn Cụm tủ" },
  { id: "details", title: "Cấu hình Layout" },
  { id: "review", title: "Xác nhận" },
];

export default function CabinetSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [discoveredSlaves, setDiscoveredSlaves] = useState<SlaveDetail[]>([]);
  
  const [setupResult, setSetupResult] = useState<{ 
    macAddress: string;
    cabinetIds: string[];
    totalLockers: number;
    mqttBrokerHost: string;
    mqttBrokerPort: number;
  } | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const paramLocationId = searchParams.get("locationId") || "";

  const form = useForm<SetupCabinetFormValues>({
    resolver: zodResolver(setupCabinetSchema),
    mode: "onChange",
    defaultValues: {
      locationId: paramLocationId,
      macAddress: "",
      heartbeatInterval: 60,
      openDoorTimeout: 5,
      configurations: [],
      deviceAttachmentIds: [],
    },
  });

  const macAddress = useWatch({ control: form.control, name: "macAddress" });
  const { discoveryResult, isConnected, resetDiscovery } = useDiscoverySocket(macAddress);

  useEffect(() => {
    console.log(`[Page] WebSocket Status: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
  }, [isConnected]);

  useEffect(() => {
    if (isScanning && discoveryResult) {
      console.log("[Page] << Discovery result captured from WebSocket:", discoveryResult);
      setDiscoveredSlaves(discoveryResult.slaves);
      setHasScanned(true);
      setIsScanning(false);
      
      if (discoveryResult.slaves.length > 0) {
        toast.success(`Tìm thấy ${discoveryResult.slaves.length} Arduino controller!`);
      } else {
        toast.error("Không tìm thấy controller nào trên thiết bị này. Kiểm tra RS485.");
      }
    }
  }, [discoveryResult, isScanning]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "configurations",
  });

  const selectedCabinetIds = fields.map(f => f.cabinetId);

  const handleScan = async () => {
    const mac = form.getValues("macAddress");
    if (!mac || !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
      toast.error("Vui lòng nhập MAC Address hợp lệ");
      return;
    }

    resetDiscovery();
    setIsScanning(true);
    setHasScanned(false);
    setDiscoveredSlaves([]);

    try {
      // Trigger scan on backend (will return fast)
      console.log(`Triggering hardware discovery for MAC: ${mac}`);
      await cabinetSetupService.discoverCabinets(mac);
      toast.info("Đang quét phần cứng... Vui lòng chờ kết quả qua WebSocket.");
      
    } catch {
      toast.error("Lỗi khi gửi yêu cầu quét phần cứng");
      setIsScanning(false);
    }
  };

  const handleToggleCabinet = (cabinetId: string) => {
    const idx = selectedCabinetIds.indexOf(cabinetId);
    if (idx > -1) {
      remove(idx);
    } else {
      if (selectedCabinetIds.length >= discoveredSlaves.length && discoveredSlaves.length > 0) {
        toast.warning(`Chỉ có thể chọn tối đa ${discoveredSlaves.length} tủ (tương ứng số controller)`);
        return;
      }
      append({ cabinetId, totalRows: 4, totalColumns: 6 });
    }
  };

  const isStepValid = async () => {
    if (currentStep === 0) {
      const valid = await form.trigger(["locationId", "macAddress"]);
      if (!valid) return false;
      if (!hasScanned) {
        toast.warning("Vui lòng thực hiện Quét phần cứng trước");
        return false;
      }
      return true;
    }
    
    if (currentStep === 1) {
      if (selectedCabinetIds.length === 0) {
        toast.warning("Vui lòng chọn ít nhất 1 cụm tủ");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      return await form.trigger("configurations");
    }

    return true;
  };

  const nextStep = async () => {
    const valid = await isStepValid();
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: SetupCabinetFormValues) => {
    if (currentStep !== STEPS.length - 1) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        operatorId: user?.id || "unknown-operator",
      };
      
      const response = await cabinetSetupService.setupCabinet(payload as any);

      toast.success("Đã gửi lệnh thiết lập thành công");
      
      const totalLockers = values.configurations.reduce((sum, c) => sum + (c.totalRows * c.totalColumns), 0);
      
      setSetupResult({ 
        macAddress: values.macAddress,
        cabinetIds: selectedCabinetIds, 
        totalLockers,
        mqttBrokerHost: response.mqttBrokerHost || "",
        mqttBrokerPort: response.mqttBrokerPort || 1883,
      });
      
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi gửi lệnh thiết lập");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (setupResult) {
    return (
      <div className="container max-w-4xl py-10 space-y-8">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Tiến độ thiết lập</h2>
           <p className="text-muted-foreground mt-2">Đang cấu hình {setupResult.cabinetIds.length} tủ tại RPi {setupResult.macAddress}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <SetupProgressStep 
            cabinetId={setupResult.cabinetIds[0]} // Show first one for status
            macAddress={setupResult.macAddress}
            totalLockers={setupResult.totalLockers}
            onReset={() => {
              setSetupResult(null);
              setCurrentStep(0);
              form.reset();
            }}
            onComplete={() => {
              navigate('/admin/setup-cabinet');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-10 space-y-8">
      <div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
               <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Thiết lập kết nối Tủ (Cabinet)</h2>
              <p className="text-muted-foreground mt-1">Quy trình 4 bước: Kết nối &rarr; Chọn Tủ &rarr; Cấu hình &rarr; Hoàn tất</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <div className="sticky top-6 rounded-xl border bg-card p-4 shadow-sm">
            <nav aria-label="Progress" className="hidden md:block">
              <ol role="list" className="space-y-4">
                {STEPS.map((step, index) => (
                  <li key={step.id}>
                    <div className="relative flex items-center gap-3">
                      <span 
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all
                          ${index < currentStep ? 'bg-primary border-primary text-primary-foreground' : 
                            index === currentStep ? 'border-primary text-primary shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 
                            'border-muted text-muted-foreground'}
                        `}
                      >
                        {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                      </span>
                      <span className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <div className="md:col-span-9">
          <div className="rounded-2xl border bg-card shadow-sm min-h-[500px] flex flex-col">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <ErrorBoundary fallback={<ErrorFallback error={null} />}>
                    {currentStep === 0 && (
                      <BasicInfoStep 
                        form={form} 
                        isScanning={isScanning} 
                        onScan={handleScan} 
                        hasScanned={hasScanned} 
                      />
                    )}
                    {currentStep === 1 && (
                      <CabinetSelectionStep 
                        locationId={form.getValues("locationId")}
                        discoveredSlaves={discoveredSlaves}
                        selectedCabinets={selectedCabinetIds}
                        onToggleCabinet={handleToggleCabinet}
                      />
                    )}
                    {currentStep === 2 && (
                      <CabinetDetailCarousel 
                        form={form}
                        selectedCabinets={selectedCabinetIds}
                      />
                    )}
                    {currentStep === 3 && (
                      <ReviewStep form={form} />
                    )}
                  </ErrorBoundary>
                </div>

                <div className="pt-6 mt-8 border-t flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isSubmitting}
                  >
                    Quay lại
                  </Button>
                  
                  {currentStep < STEPS.length - 1 ? (
                    <Button type="button" onClick={nextStep}>
                      Tiếp tục
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} size="lg" className="px-8 font-bold">
                      {isSubmitting ? (
                        <>
                           <Check className="mr-2 h-4 w-4 animate-spin" /> Đang thiết lập...
                        </>
                      ) : (
                        "KHỞI CHẠY SETUP"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
