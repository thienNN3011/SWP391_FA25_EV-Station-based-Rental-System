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
  imageUrl?: { imageUrl: string; color: string }[];

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
export async function getAllVehicles() {
  const res = await api.get<ApiResponse<VehicleResponse[]>>('/vehicles/showall')
  return res.data.data
}
export async function getVehicleById(id: number): Promise<VehicleResponse> {
  const res = await api.get<ApiResponse<VehicleResponse>>(`/vehicles/showbyid/${id}`)
  return res.data.data
}

export interface VehicleCreatePayload { modelId: number; stationId: number; color: string; plateNumber: string }
export interface VehicleUpdatePayload extends VehicleCreatePayload { status?: 'AVAILABLE'|'BOOKED'|'IN_USE'|'MAINTENANCE'|'INACTIVE' }

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