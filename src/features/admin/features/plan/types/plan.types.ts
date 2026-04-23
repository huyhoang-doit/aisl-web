import type { Pricing } from "../../pricing/types/pricing.types";

export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface Plan {
  id: string;
  name: string;
  maxLockers: number;
  price: number;
  fixedLocker: number;
  discountLockerRental: number;
  discountFixedLockerRental: number;
  description?: string;
  status: PlanStatus;
  isFreeDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
  pricings?: Pricing[];
  pricingIds?: string[];
}
