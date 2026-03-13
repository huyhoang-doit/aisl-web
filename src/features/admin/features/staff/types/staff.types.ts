export interface Staff {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED"
  department?: string
  position?: string
  createdAt?: string
  updatedAt?: string
}
