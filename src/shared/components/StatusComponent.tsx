import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import {
  type StatusValue,
  type StatusVariant,
  STATUS_CONFIG,
  normalizeStatus,
} from "./statusConfig";

export interface StatusComponentProps {
  /** Giá trị từ API: string "ACTIVE" | "INACTIVE" | "BLOCKED" hoặc object { value, code } */
  status?: string | Record<string, unknown>;
  /** Override config (optional) */
  config?: Partial<Record<StatusValue, { label: string; variant: StatusVariant }>>;
  className?: string;
}

const StatusComponent: React.FC<StatusComponentProps> = ({ status, config, className }) => {
  const value = normalizeStatus(status);
  const resolved = { ...STATUS_CONFIG[value], ...config?.[value] };
  return (
    <Badge variant={resolved.variant} className={className}>
      {resolved.label}
    </Badge>
  );
};

export default StatusComponent;
