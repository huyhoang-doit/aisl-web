import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";

interface SetupProgressStepProps {
  cabinetId: string;
  totalLockers: number;
  onReset: () => void;
  onComplete: () => void;
}

// Giả lập trạng thái nhận Socket / MQTT từ BE
// Trong thực tế, bạn sẽ dùng Socket.io hoặc Server-Sent Events (SSE) để lắng nghe sự kiện
type SetupState = "INITIALIZING" | "IN_PROGRESS" | "COMPLETED" | "PARTIAL" | "ABORTED" | "ERROR";

interface LockerStatus {
  slotIndex: number;
  row: number;
  column: number;
  testResult: "OK" | "FAIL" | "PENDING";
  errorCode?: string;
}

export function SetupProgressStep({ totalLockers, onReset, onComplete }: SetupProgressStepProps) {
  const [state, setState] = useState<SetupState>("INITIALIZING");
  const [testedCount, setTestedCount] = useState(0);
  const [okCount, setOkCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [lockers, setLockers] = useState<LockerStatus[]>(
    Array.from({ length: totalLockers }).map((_, i) => ({
      slotIndex: i,
      row: Math.floor(i / (totalLockers / 4)) + 1, // Giả lập row/col (tùy thuộc thực tế layout truyền vào)
      column: (i % (totalLockers / 4)) + 1,
      testResult: "PENDING",
    }))
  );

  // Giả lập quá trình Setup đang diễn ra (Mocking WebSocket messages)
  useEffect(() => {
    let currentTest = 0;
    let currentOk = 0;
    let currentFail = 0;
    setState("IN_PROGRESS");

    const timer = setInterval(() => {
      if (currentTest >= totalLockers) {
        clearInterval(timer);
        // Xác định kết quả cuối cùng
        if (currentFail === 0 && currentOk === totalLockers) setState("COMPLETED");
        else if (currentOk === 0) setState("ABORTED");
        else setState("PARTIAL");
        return;
      }

      // Giả lập tỉ lệ rủi ro lỗi 10%
      const isOk = Math.random() > 0.1;

      setLockers((prev) =>
        prev.map((locker, index) => {
          if (index === currentTest) {
            return {
              ...locker,
              testResult: isOk ? "OK" : "FAIL",
              errorCode: isOk ? undefined : "MOTOR_FAILURE",
            };
          }
          return locker;
        })
      );

      setTestedCount(currentTest + 1);
      if (isOk) {
        setOkCount((prev) => prev + 1);
        currentOk++;
      } else {
        setFailCount((prev) => prev + 1);
        currentFail++;
      }

      currentTest++;
    }, 1500); // Mỗi locker test mất 1.5s

    return () => clearInterval(timer);
  }, [totalLockers]);

  const progressPercent = (testedCount / totalLockers) * 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2 mt-4">
        {state === "INITIALIZING" || state === "IN_PROGRESS" ? (
          <div className="flex justify-center items-center mb-4">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xs font-semibold">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>
        ) : state === "COMPLETED" ? (
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        ) : state === "PARTIAL" ? (
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        )}
        
        <h3 className="text-xl font-semibold">
          {state === "INITIALIZING" && "Đang khởi tạo kết nối..."}
          {state === "IN_PROGRESS" && "Đang kiểm tra phần cứng Cabinet..."}
          {state === "COMPLETED" && "Cài đặt hoàn tất thành công!"}
          {state === "PARTIAL" && "Hoàn tất nhưng có lỗi cục bộ"}
          {(state === "ABORTED" || state === "ERROR") && "Cài đặt thất bại"}
        </h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {state === "IN_PROGRESS" && "Raspberry Pi đang lần lượt mở từng ô tủ để kiểm tra động cơ servo và cảm biến khoá cửa."}
          {state === "COMPLETED" && "Cabinet đã sẵn sàng hoạt động với 100% khoá tủ đạt chuẩn."}
          {state === "PARTIAL" && `Hoàn tất kiểm tra nhưng phát hiện ${failCount} ngăn tủ bị lỗi cần bảo trì.`}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between text-sm mb-1 px-1">
          <span>Tiến độ kiểm tra</span>
          <span className="font-medium">{testedCount} / {totalLockers} Locker</span>
        </div>
        <Progress value={progressPercent} className={`h-2 ${state === "COMPLETED" ? 'bg-green-100' : ''}`} />
        
        <div className="flex gap-4 justify-center mt-6 text-sm">
           <div className="flex items-center text-green-600 dark:text-green-500">
             <CheckCircle2 className="h-4 w-4 mr-1.5" />
             <span className="font-medium">{okCount} OK</span>
           </div>
           <div className="flex items-center text-red-600 dark:text-red-500">
             <XCircle className="h-4 w-4 mr-1.5" />
             <span className="font-medium">{failCount} LỖI</span>
           </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Chi tiết theo danh sách</h4>
        <div className="flex flex-wrap gap-2 bg-muted/40 p-4 rounded-xl border max-h-[250px] overflow-y-auto">
          {lockers.map((locker) => (
            <div 
              key={locker.slotIndex} 
              className={`
                w-14 h-14 shrink-0 flex flex-col items-center justify-center rounded border shadow-sm transition-all
                ${locker.testResult === "OK" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900/50" : 
                  locker.testResult === "FAIL" ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/50" : 
                  "bg-background text-muted-foreground border-dashed"
                }
              `}
              title={locker.testResult === "FAIL" ? `Lỗi: ${locker.errorCode}` : ""}
            >
              <span className="text-xs font-semibold leading-none">{locker.slotIndex}</span>
              {locker.testResult === "OK" && <CheckCircle2 className="h-3.5 w-3.5 mt-1" />}
              {locker.testResult === "FAIL" && <XCircle className="h-3.5 w-3.5 mt-1" />}
            </div>
          ))}
        </div>
      </div>

      {(state === "COMPLETED" || state === "PARTIAL" || state === "ABORTED" || state === "ERROR") && (
        <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onReset}>Thiết lập tủ khác</Button>
          <Button onClick={onComplete}>Hoàn tất & Đóng</Button>
        </div>
      )}
    </div>
  );
}
