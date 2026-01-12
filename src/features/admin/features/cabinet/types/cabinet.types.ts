export interface Cabinet {
    id: string;
    locationId: string;
    name: string;
    code: string;
    description?: string;
    totalLockers: number;
    availableLockers: number;
    status: "active" | "inactive" | "maintenance";
    createdAt?: string;
    updatedAt?: string;
  }