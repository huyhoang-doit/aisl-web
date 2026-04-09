import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import { cabinetSetupService } from "../../services/cabinetSetup.service";
import { CABINET_STATUS } from "../../types/cabinetSetup.types";
import { useDiscoverySocket } from "../../hooks/useDiscoverySocket";

interface SetupProgressStepProps {
  cabinetId: string;
  macAddress: string;
  totalLockers: number;
  mqttBrokerHost: string;
  mqttBrokerPort: number;
  onReset: () => void;
  onComplete: () => void;
}

type SetupState = "INITIALIZING" | "IN_PROGRESS" | "COMPLETED" | "PARTIAL" | "ABORTED" | "ERROR";

interface LockerStatus {
  slotIndex: number;
  row: number;
  column: number;
  testResult: "OK" | "FAIL" | "PENDING";
  errorCode?: string;
}

export function SetupProgressStep({ cabinetId, macAddress, totalLockers, mqttBrokerHost, mqttBrokerPort, onReset, onComplete }: SetupProgressStepProps) {
  const [state, setState] = useState<SetupState>("INITIALIZING");
  const [testedCount, setTestedCount] = useState(0);
  const [okCount, setOkCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [lockers, setLockers] = useState<LockerStatus[]>(
    Array.from({ length: totalLockers }).map((_, i) => ({
      slotIndex: i,
      row: 0, 
      column: 0,
      testResult: "PENDING",
    }))
  );

  // WebSocket Integration
  const { setupProgress, setupResult, isConnected } = useDiscoverySocket(macAddress);

  // 1. Handle Setup Progress Events (Real-time)
  useEffect(() => {
    if (!setupProgress || setupProgress.cabinetId !== cabinetId) return;

    // Defer state updates to avoid cascading render warning
    setTimeout(() => {
      if (state !== "IN_PROGRESS") {
        setState("IN_PROGRESS");
      }
  
      setLockers(prev => {
        const idx = prev.findIndex(l => l.slotIndex === setupProgress.slotIndex);
        if (idx !== -1 && prev[idx].testResult !== "PENDING") return prev;
  
        const updated = [...prev];
        const newLocker: LockerStatus = {
          slotIndex: setupProgress.slotIndex,
          row: setupProgress.row,
          column: setupProgress.column,
          testResult: setupProgress.testResult === "OK" ? "OK" : "FAIL",
          errorCode: setupProgress.testResult === "FAIL" ? "HARDWARE_FAILURE" : undefined
        };
  
        if (idx !== -1) {
          updated[idx] = newLocker;
        } else {
          updated.push(newLocker);
        }
        return updated;
      });
  
      if (setupProgress.progress) {
        setTestedCount(setupProgress.progress.tested);
        setOkCount(setupProgress.progress.okCount);
        setFailCount(setupProgress.progress.failCount);
      }
    }, 0);
  }, [setupProgress, cabinetId, state]);

  // 2. Handle Setup Result Event (Final)
  useEffect(() => {
    if (!setupResult || setupResult.cabinetId !== cabinetId) return;
    
    const finalStatus = setupResult.status === "COMPLETED" ? "COMPLETED" : 
                       setupResult.status === "PARTIAL" ? "PARTIAL" : "ERROR";
    
    setTimeout(() => {
      if (state !== finalStatus) {
        setState(finalStatus);
      }
    }, 0);
  }, [setupResult, cabinetId, state]);

  // 3. Polling logic (Fallback & Initial Snapshot)
  useEffect(() => {
    let pollInterval: any;
    
    const fetchStatus = async () => {
      try {
        const cabResponse = await cabinetSetupService.getCabinet(cabinetId);
        const cabData = cabResponse.data;
        
        const lockersResponse = await cabinetSetupService.getCabinetLockers(cabinetId, { page: 1, limit: 100 });
        const remoteLockers = lockersResponse.data.lockers;

        const updatedLockers: LockerStatus[] = remoteLockers.map(rl => ({
          slotIndex: rl.slotIndex,
          row: rl.row,
          column: rl.column,
          testResult: rl.status === "AVAILABLE" ? "OK" : rl.isActive === false ? "FAIL" : "PENDING",
          errorCode: rl.hwState === "ERROR" ? "HARDWARE_FAILURE" : undefined
        }));

        setLockers(updatedLockers);
        
        const ok = updatedLockers.filter(l => l.testResult === "OK").length;
        const fail = updatedLockers.filter(l => l.testResult === "FAIL").length;
        const tested = updatedLockers.filter(l => l.testResult !== "PENDING").length;

        setOkCount(ok);
        setFailCount(fail);
        setTestedCount(tested);

        if (cabData.status === CABINET_STATUS.SETTING_UP) {
          if (state !== "IN_PROGRESS" && state !== "COMPLETED") setState("IN_PROGRESS");
        } else if (cabData.status === CABINET_STATUS.ACTIVE) {
          if (state !== "COMPLETED") {
            setState("COMPLETED");
            if (pollInterval) clearInterval(pollInterval);
          }
        } else if (cabData.status === CABINET_STATUS.PARTIAL_ERROR) {
          if (state !== "PARTIAL") {
            setState("PARTIAL");
            if (pollInterval) clearInterval(pollInterval);
          }
        } else if (cabData.status === CABINET_STATUS.OFFLINE && tested > 0) {
          if (state !== "ERROR") {
            setState("ERROR");
            if (pollInterval) clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 5000); 

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [cabinetId, state]);

  const progressPercent = (testedCount / totalLockers) * 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center px-4 -mb-4">
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] text-muted-foreground uppercase font-medium">
            {isConnected ? 'Real-time Link Active' : 'Polling Fallback Active'}
          </span>
        </div>
      </div>

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
          {state === "COMPLETED" && (
            <>
              Cabinet đã sẵn sàng hoạt động với 100% khoá tủ đạt chuẩn.
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10 text-xs font-medium text-primary">
                Broker MQTT: {mqttBrokerHost}:{mqttBrokerPort}
              </div>
            </>
          )}
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
