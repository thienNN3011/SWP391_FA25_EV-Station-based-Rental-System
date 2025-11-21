import { api } from './api'

export interface ApiResponse<T> { code: number; success: boolean; message: string; data: T }
export interface CustomerResponse {
  userId: number; username: string; fullName: string; email: string; phone: string;
  idCard: string; driveLicense: string; role: string; status: string;
  idCardPhoto?: string; driveLicensePhoto?: string; createdDate?: string;
}
export interface VehicleResponse {
  vehicleId: number; modelId: number; modelName: string; brand: string;
  stationId: number; stationName: string; color: string; status: string; plateNumber: string;
}

export interface StationResponse {
  stationId?: number
  stationName: string
  address: string
  openingHours: string
  status?: string
}

export interface VehicleModelResponse {
  modelId: number
  modelName: string
  brand: string
  description?: string
  pricePerHour?: number
  pricePerDay?: number
  availableCount?: number
}

export interface VehicleModelDetailResponse {
  modelId: number
  modelName: string
  brand: string
  description?: string
  pricePerHour?: number
  pricePerDay?: number
  specifications?: string
  features?: string[]
  availableVehicles?: Array<{
    vehicleId: number
    plateNumber: string
    color: string
    status: string
  }>
}


export async function getPendingAccounts() {
  const res = await api.get<ApiResponse<CustomerResponse[]>>('/showpendingaccount')
  return res.data.data
}
export async function getPendingAccountDetail(username: string) {
  const res = await api.post<ApiResponse<CustomerResponse>>('/showdetailofpendingaccount', { username })
  return res.data.data
}
export async function changeAccountStatus(username: string, status: 'ACTIVE'|'REJECTED') {
  const res = await api.patch<ApiResponse<boolean>>('/changeaccountstatus', { username, status })
  return res.data.data
}

export async function getAllRenters() {
  const res = await api.get<ApiResponse<CustomerResponse[]>>('/showallrenters')
  return res.data.data
}

export async function getAllStaffs() {
  const res = await api.get<ApiResponse<CustomerResponse[]>>('/showallstaffs')
  return res.data.data
}

export interface CustomerCreatePayload {
  username: string
  fullName: string
  email: string
  phone: string
  idCard: string
  driveLicense: string
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN'
  password: string
  stationId: string
}

export interface CustomerUpdatePayload extends Partial<CustomerCreatePayload> {
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED'
}

export async function createCustomer(payload: CustomerCreatePayload): Promise<CustomerResponse> {
  const res = await api.post<ApiResponse<CustomerResponse>>('/users/create', payload)
  return res.data.data
}

export async function updateCustomer(userId: number, payload: CustomerUpdatePayload): Promise<CustomerResponse> {
  const res = await api.put<ApiResponse<CustomerResponse>>(`/users/update/${userId}`, payload)
  return res.data.data
}

export async function deleteCustomer(userId: number): Promise<void> {
  const res = await api.delete<ApiResponse<void>>(`/users/delete/${userId}`)
  return res.data.data
}

export interface VehicleCreatePayload { modelId: number; stationId: number; color: string; plateNumber: string }
export interface VehicleUpdatePayload extends VehicleCreatePayload { status?: 'AVAILABLE'|'BOOKED'|'IN_USE'|'MAINTENANCE'|'INACTIVE' }

export async function getAllVehicles() {
  const res = await api.get<ApiResponse<VehicleResponse[]>>('/vehicles/showall')
  return res.data.data
}
export async function getVehicleById(id: number): Promise<VehicleResponse> {
  const res = await api.get<ApiResponse<VehicleResponse>>(`/vehicles/showbyid/${id}`)
  return res.data.data
}

export async function createVehicle(payload: VehicleCreatePayload): Promise<VehicleResponse> {
  const res = await api.post<ApiResponse<VehicleResponse>>('/vehicles/create', payload)
  return res.data.data
}

export async function updateVehicle(id: number, payload: VehicleUpdatePayload): Promise<VehicleResponse> {
  const res = await api.put<ApiResponse<VehicleResponse>>(`/vehicles/update/${id}`, payload)
  return res.data.data
}

export async function deleteVehicle(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<void>>(`/vehicles/delete/${id}`)
  return res.data.data
}

export interface StationCreatePayload {
  stationName: string
  address: string
  openingHours: string
}
export interface StationUpdatePayload extends StationCreatePayload {
  status?: 'OPEN'|'CLOSED'
}

export async function getAllStations(): Promise<StationResponse[]> {
  const res = await api.get<ApiResponse<StationResponse[]>>('/stations/showall')
  return res.data.data
}
export async function getStationById(id: number): Promise<StationResponse> {
  const res = await api.get<ApiResponse<StationResponse>>(`/stations/showbyid/${id}`)
  return res.data.data
}
export async function createStation(payload: StationCreatePayload): Promise<StationResponse> {
  const res = await api.post<ApiResponse<StationResponse>>('/stations/create', payload)
  return res.data.data
}

export async function updateStation(id: number, payload: StationUpdatePayload): Promise<StationResponse> {
  const res = await api.put<ApiResponse<StationResponse>>(`/stations/update/${id}`, payload)
  return res.data.data
}

export async function deleteStation(id: number): Promise<void> {
  const res = await api.delete<ApiResponse<void>>(`/stations/delete/${id}`)
  return res.data.data
}

// === Vehicle Model APIs ===
export async function getActiveStations(): Promise<StationResponse[]> {
  const res = await api.get<ApiResponse<StationResponse[]>>('/station/showall')
  return res.data.data
}

export async function getVehicleModelsByStation(stationName: string): Promise<VehicleModelResponse[]> {
  const res = await api.post<ApiResponse<VehicleModelResponse[]>>('/vehiclemodel', { stationName })
  return res.data.data
}

export async function getVehicleModelDetail(modelId: number, stationName: string): Promise<VehicleModelDetailResponse> {
  const res = await api.post<ApiResponse<VehicleModelDetailResponse>>('/vehiclemodel/getvehicelmodeldetail', { modelId, stationName })
  return res.data.data
}