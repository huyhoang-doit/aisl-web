import type { Pricing } from "../../pricing/types/pricing.types";

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
  isFreeDefault?: boolean;
  pricings?: Pricing[];
  pricingIds?: string[];
}
