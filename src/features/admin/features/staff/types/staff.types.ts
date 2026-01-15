export interface Staff {
  id?: string
  name: string
  email: string
  phone: string
  role: string
  status?: "active" | "inactive" | "locked"
  department?: string
  position?: string
  createdAt?: string
  updatedAt?: string
}
