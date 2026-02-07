export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface Plan {
  id: string;
  name: string;
  maxLockers: number;
  price: number;
  description?: string;
  status: PlanStatus;
  createdAt?: string;
  updatedAt?: string;
}
