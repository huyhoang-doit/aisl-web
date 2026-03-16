import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { 
  SetupCabinetFormValues 
} from "../schemas/cabinetSetup.schema";
import { BasicInfoStep } from "../components/steps/BasicInfoStep";
import { LayoutStep } from "../components/steps/LayoutStep";
import { MqttSettingsStep } from "../components/steps/MqttSettingsStep";
import { ReviewStep } from "../components/steps/ReviewStep";
import { SetupProgressStep } from "../components/steps/SetupProgressStep";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { toast } from "sonner";
import { Check, ChevronRight, ServerCog } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cabinetSetupService } from "../services/cabinetSetup.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

import { setupCabinetSchema } from "../schemas/cabinetSetup.schema";

const STEPS = [
  { id: "basic", title: "Thông tin cơ bản" },
  { id: "layout", title: "Bố trí tủ (Locker Layout)" },
  { id: "mqtt", title: "Kết nối mạng MQTT" },
  { id: "review", title: "Kiểm tra & Xác nhận" },
];

export default function CabinetSetupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupResult, setSetupResult] = useState<{ cabinetId: string; totalLockers: number } | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const paramLocationId = searchParams.get("locationId") || "";
  const paramCabinetId = searchParams.get("cabinetId") || "";

  const form = useForm<SetupCabinetFormValues>({
    resolver: zodResolver(setupCabinetSchema),
    mode: "onChange",
    defaultValues: {
      locationId: paramLocationId,
      cabinetId: paramCabinetId,
      macAddress: "",
      totalRows: 4,
      totalColumns: 6,
      heartbeatInterval: 60,
      openDoorTimeout: 5,
      mqttBrokerHost: "",
      mqttBrokerPort: 1883,
      mqttUsername: "",
      mqttPassword: "",
      deviceAttachmentIds: [],
    },
  });

  const isStepValid = async () => {
    let fieldsToValidate: (keyof SetupCabinetFormValues)[] = [];
    if (currentStep === 0) fieldsToValidate = ["locationId", "cabinetId", "macAddress"];
    if (currentStep === 1) fieldsToValidate = ["totalRows", "totalColumns", "heartbeatInterval", "openDoorTimeout"];
    if (currentStep === 2) fieldsToValidate = ["mqttBrokerHost", "mqttBrokerPort"];
    
    const isValid = await form.trigger(fieldsToValidate);
    return isValid;
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
      
      const response = await cabinetSetupService.setupCabinet(payload);

      toast.success("Đã gửi lệnh thiết lập xuống Raspberry Pi");
      setSetupResult({ 
        cabinetId: response.cabinetId, 
        totalLockers: values.totalRows * values.totalColumns,
      });
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi khi gửi lệnh thiết lập cabinet");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (setupResult) {
    return (
      <div className="container max-w-4xl py-10 space-y-8">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Tiến độ thiết lập tủ</h2>
           <p className="text-muted-foreground mt-2">Theo dõi kết quả trả về từ RPi Cabinet {setupResult.cabinetId}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <SetupProgressStep 
            cabinetId={setupResult.cabinetId} 
            totalLockers={setupResult.totalLockers}
            onReset={() => {
              setSetupResult(null);
              setCurrentStep(0);
              form.reset();
            }}
            onComplete={() => {
              // Lưu vào localStorage để Kiosk Web App nhận diện
              localStorage.setItem("kiosk_cabinet_id", setupResult.cabinetId);
              toast.success("Đã lưu định danh thiết bị Kiosk!");
              
              navigate('/staff/list-lockers');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
               <ServerCog className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Thiết lập kết nối Tủ (Cabinet)</h2>
              <p className="text-muted-foreground mt-1">Cấu hình tham số và ghép nối Raspberry Pi vào hệ thống</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Steps */}
        <div className="md:col-span-4">
          <div className="sticky top-6 rounded-xl border bg-card p-6 shadow-sm">
            <nav aria-label="Progress" className="hidden md:block">
              <ol role="list" className="overflow-hidden">
                {STEPS.map((step, index) => (
                  <li key={step.id} className={`relative ${index !== STEPS.length - 1 ? 'pb-10' : ''}`}>
                    {index !== STEPS.length - 1 && (
                      <div 
                        className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex items-start group">
                      <span className="h-9 flex items-center">
                        <span 
                          className={`
                            relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300
                            ${index < currentStep ? 'bg-primary border-primary text-primary-foreground' : 
                              index === currentStep ? 'border-primary text-primary ring-4 ring-primary/20 bg-background' : 
                              'border-muted bg-background text-muted-foreground'}
                          `}
                        >
                          {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                        </span>
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col justify-center translate-y-2">
                        <span className={`text-sm font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </span>
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
            {/* Mobile Progress Bar */}
            <div className="md:hidden space-y-2">
               <p className="text-sm font-medium">Bước {currentStep + 1} của {STEPS.length}</p>
               <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}></div>
               </div>
               <p className="text-xs font-medium text-primary mt-1">{STEPS[currentStep].title}</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="md:col-span-8">
          <div className="rounded-2xl border bg-card shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit as any)} className="p-8">
                <div className="min-h-[350px]">
                  {currentStep === 0 && <BasicInfoStep form={form} />}
                  {currentStep === 1 && <LayoutStep form={form} />}
                  {currentStep === 2 && <MqttSettingsStep form={form} />}
                  {currentStep === 3 && <ReviewStep form={form} />}
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
                    <Button type="submit" disabled={isSubmitting} onClick={form.handleSubmit(onSubmit as any)}>
                      {isSubmitting ? (
                        <>
                           <Check className="mr-2 h-4 w-4 animate-spin" /> Chờ xử lý...
                        </>
                      ) : (
                        "Khởi chạy Setup Cabinet"
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
