import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import { getStatusEntry } from "./statusConfig";

export interface StatusComponentProps {
  /** Giá trị từ API: string (vd "PENDING", "ACTIVE") hoặc object { value, code } */
  status?: string | Record<string, unknown>;
  /** Override className cho Badge */
  className?: string;
}

/**
 * Badge trạng thái dùng chung: chỉ cần truyền props status,
 * màu và label lấy từ statusConfig. Thêm trạng thái mới thì thêm vào config.
 */
const StatusComponent: React.FC<StatusComponentProps> = ({ status, className }) => {
  const { label, variant } = getStatusEntry(status);
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

export default StatusComponent;
