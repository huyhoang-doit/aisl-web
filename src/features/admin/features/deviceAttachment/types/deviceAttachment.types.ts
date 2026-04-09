/**
 * Device Attachment types
 * Payload BE: cabinetId, cabinetConfigId, name, serialNumber, description, isActive
 */
export interface DeviceAttachment {
  id: string;
  cabinetId?: string;
  cabinetConfigId?: string;
  name: string;
  type?: string;
  serialNumber: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
