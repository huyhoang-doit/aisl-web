export interface Location {
    id: string;
    name: string;
    address: string;
    description?: string;
    status: "active" | "inactive";
    createdAt?: string;
    updatedAt?: string;
  }