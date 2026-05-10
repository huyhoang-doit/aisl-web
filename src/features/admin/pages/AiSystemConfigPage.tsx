import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemSettingsApi } from "../api/system-settings.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Slider } from "@/shared/components/ui/slider";
import { toast } from "sonner";
import {
  Loader2,
  Cpu,
  Sliders,
  ShieldCheck,
  Eye,
  RefreshCw,
  Save,
  Info,
  Sparkles,
  Zap,
  AlertTriangle
} from "lucide-react";

// Default settings in case the API settings are empty
const DEFAULT_SETTINGS = {
  CONFIDENCE_THRESHOLD: 0.25,
  COSINE_THRESHOLD: 0.50,
  QUALITY_THRESHOLD: 0.50,
  SPOOF_THRESHOLD: 0.60,
};

const AiSystemConfigPage = () => {
  const queryClient = useQueryClient();
  const [settingsState, setSettingsState] = useState<Record<string, number>>({
    CONFIDENCE_THRESHOLD: DEFAULT_SETTINGS.CONFIDENCE_THRESHOLD,
    COSINE_THRESHOLD: DEFAULT_SETTINGS.COSINE_THRESHOLD,
    QUALITY_THRESHOLD: DEFAULT_SETTINGS.QUALITY_THRESHOLD,
    SPOOF_THRESHOLD: DEFAULT_SETTINGS.SPOOF_THRESHOLD,
  });

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["system-settings", "ai-config"],
    queryFn: async () => {
      const response = await systemSettingsApi.getAiSystemConfig();
      const responseData = response?.data || {};
      const innerData = responseData.data || responseData;
      const config = innerData.config || innerData.settings || innerData;

      return {
        CONFIDENCE_THRESHOLD: Number(config?.CONFIDENCE_THRESHOLD ?? DEFAULT_SETTINGS.CONFIDENCE_THRESHOLD),
        COSINE_THRESHOLD: Number(config?.COSINE_THRESHOLD ?? DEFAULT_SETTINGS.COSINE_THRESHOLD),
        QUALITY_THRESHOLD: Number(config?.QUALITY_THRESHOLD ?? DEFAULT_SETTINGS.QUALITY_THRESHOLD),
        SPOOF_THRESHOLD: Number(config?.SPOOF_THRESHOLD ?? DEFAULT_SETTINGS.SPOOF_THRESHOLD),
      };
    },
  });

  // Sync state when data is loaded
  useEffect(() => {
    if (data) {
      setSettingsState(data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (newSettings: Record<string, number>) => {
      return systemSettingsApi.updateAiSystemConfig({
        settings: newSettings,
      });
    },
    onSuccess: () => {
      toast.success("Cập nhật cấu hình AI thành công!");
      queryClient.invalidateQueries({ queryKey: ["system-settings", "ai-config"] });
    },
    onError: (err: any) => {
      const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật cấu hình hệ thống AI";
      toast.error(errMsg);
    }
  });

  const handleSliderChange = (key: string, value: number[]) => {
    setSettingsState((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setSettingsState((prev) => ({
        ...prev,
        [key]: numValue,
      }));
    }
  };

  const handleSave = () => {
    updateMutation.mutate(settingsState);
  };

  const handleReset = () => {
    setSettingsState(DEFAULT_SETTINGS);
    toast.info("Đã đặt cấu hình về mặc định. Nhấn 'Lưu cấu hình' để xác nhận.");
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Đang tải cấu hình AI...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Cấu hình hệ thống AI</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Điều chỉnh các thông số và ngưỡng nhận diện khuôn mặt, chống giả mạo của mô hình AI Lockerly.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex-1 md:flex-none gap-2 hover:bg-muted"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 md:flex-none gap-2 hover:bg-muted"
          >
            Mặc định
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 md:flex-none gap-2 shadow-md shadow-primary/20"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu cấu hình
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Không kết nối được dịch vụ AI của hệ thống</p>
            <p className="text-muted-foreground leading-relaxed">
              Hiện tại hệ thống không thể tải cấu hình trực tiếp từ máy chủ AI. Dưới đây là các thông số mặc định khuyến nghị, bạn vẫn có thể điều chỉnh và nhấn <strong>"Lưu cấu hình"</strong> để cập nhật trực tiếp.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Controls Section */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent border-b pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <CardTitle>Tham số Nhận Diện</CardTitle>
              </div>
              <CardDescription>
                Kéo thanh trượt hoặc nhập trực tiếp giá trị số thập phân từ 0.0 đến 1.0.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">

              {/* Confidence Threshold */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      CONFIDENCE_THRESHOLD
                    </label>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Ngưỡng tin cậy phát hiện khuôn mặt tối thiểu của mô hình học máy YOLO.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={settingsState.CONFIDENCE_THRESHOLD ?? 0.25}
                      onChange={(e) => handleInputChange("CONFIDENCE_THRESHOLD", e.target.value)}
                      className="w-20 text-right font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium">0.0</span>
                  <Slider
                    value={[settingsState.CONFIDENCE_THRESHOLD ?? 0.25]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => handleSliderChange("CONFIDENCE_THRESHOLD", val)}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground font-medium">1.0</span>
                </div>
              </div>

              {/* Cosine Threshold */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                      <Eye className="w-4 h-4 text-primary" />
                      COSINE_THRESHOLD
                    </label>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Ngưỡng so khớp vector khuôn mặt để xác thực danh tính người dùng.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={settingsState.COSINE_THRESHOLD}
                      onChange={(e) => handleInputChange("COSINE_THRESHOLD", e.target.value)}
                      className="w-20 text-right font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium">0.0</span>
                  <Slider
                    value={[settingsState.COSINE_THRESHOLD]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => handleSliderChange("COSINE_THRESHOLD", val)}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground font-medium">1.0</span>
                </div>
              </div>

              {/* Quality Threshold */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      QUALITY_THRESHOLD
                    </label>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Độ sắc nét và tiêu chuẩn khuôn mặt tối thiểu để chấp nhận xử lý.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={settingsState.QUALITY_THRESHOLD}
                      onChange={(e) => handleInputChange("QUALITY_THRESHOLD", e.target.value)}
                      className="w-20 text-right font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium">0.0</span>
                  <Slider
                    value={[settingsState.QUALITY_THRESHOLD]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => handleSliderChange("QUALITY_THRESHOLD", val)}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground font-medium">1.0</span>
                </div>
              </div>

              {/* Spoof Threshold */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="text-base font-semibold flex items-center gap-2 text-foreground">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      SPOOF_THRESHOLD
                    </label>
                    <p className="text-xs text-muted-foreground max-w-md">
                      Mức độ kiểm duyệt chống giả mạo khuôn mặt (Liveness Detection).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={settingsState.SPOOF_THRESHOLD}
                      onChange={(e) => handleInputChange("SPOOF_THRESHOLD", e.target.value)}
                      className="w-20 text-right font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-medium">0.0</span>
                  <Slider
                    value={[settingsState.SPOOF_THRESHOLD]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => handleSliderChange("SPOOF_THRESHOLD", val)}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground font-medium">1.0</span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Informative Side Cards */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Info className="h-4 w-4" />
                <span>Giải thích Tham số</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground">
              <div className="space-y-1">
                <p className="font-bold text-foreground">1. CONFIDENCE_THRESHOLD (0.25)</p>
                <p>Độ tin cậy phát hiện khuôn mặt. Giá trị càng cao bộ dò khuôn mặt (YOLO) sẽ lọc bỏ các hình dạng không phải mặt chính xác hơn, tránh nhận dạng nhầm các vật thể xung quanh.</p>
              </div>
              <div className="space-y-1 border-t pt-3">
                <p className="font-bold text-foreground">2. COSINE_THRESHOLD (0.50)</p>
                <p>Ngưỡng so khớp vector. Giá trị càng cao (ví dụ &gt; 0.60) yêu cầu khuôn mặt phải cực kỳ khớp với ảnh đã đăng ký mới được mở tủ, giảm thiểu việc nhận diện nhầm nhưng đòi hỏi ánh sáng tốt.</p>
              </div>
              <div className="space-y-1 border-t pt-3">
                <p className="font-bold text-foreground">3. QUALITY_THRESHOLD (0.50)</p>
                <p>Chất lượng khuôn mặt đầu vào. Lọc ảnh mờ, rung lắc, thiếu sáng để đảm bảo chất lượng ảnh quét đạt tiêu chuẩn xử lý khuôn mặt tốt nhất.</p>
              </div>
              <div className="space-y-1 border-t pt-3">
                <p className="font-bold text-foreground">4. SPOOF_THRESHOLD (0.60)</p>
                <p>Bộ lọc chống giả mạo (Liveness). Đảm bảo người dùng thực sự đứng trước tủ, ngăn chặn triệt để hành vi dùng ảnh in, ảnh điện thoại để đánh lừa camera.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/40 dark:bg-amber-950/10 border-amber-200/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-600 font-semibold">
                <Zap className="h-4 w-4" />
                <span>Lưu ý Vận Hành</span>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-muted-foreground leading-relaxed">
              <p>• Việc tăng các ngưỡng trên sẽ giúp nâng cao **mức độ bảo mật** của hệ thống tủ Lockerly.</p>
              <p>• Tuy nhiên, nếu đặt các ngưỡng quá sát mức tối đa (1.0), người dùng có thể gặp khó khăn trong việc nhận diện hàng ngày dưới điều kiện ánh sáng ngoài trời.</p>
              <p className="font-semibold text-amber-600">⚠ Nên giữ các thông số khuyến nghị mặc định nếu không có yêu cầu đặc biệt từ đội ngũ kỹ thuật.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiSystemConfigPage;
