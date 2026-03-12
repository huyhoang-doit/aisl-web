export interface CourierRequest {
  id?: string
  name: string
  email: string
  phone: string
  address?: string
  status: "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" | "BLACKLISTED"
  requestDate?: string
  reviewedDate?: string
  reviewedBy?: string
  rejectionReason?: string
  documents?: string[]
  createdAt?: string
  updatedAt?: string
}
