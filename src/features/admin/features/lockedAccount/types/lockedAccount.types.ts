export interface LockedAccount {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  lockedAt?: string
  lockedReason?: string
  lockedBy?: string
  unlockRequested?: boolean
  unlockRequestDate?: string
  createdAt?: string
  updatedAt?: string
}
