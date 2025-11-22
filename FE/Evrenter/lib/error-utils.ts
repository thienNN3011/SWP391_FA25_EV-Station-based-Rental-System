import { AxiosError } from "axios"

export interface ApiError {
  message: string
  code?: number
  field?: string
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
    
    // Handle different HTTP status codes
    if (axiosError.response) {
      const status = axiosError.response.status
      const data = axiosError.response.data
      
      switch (status) {
        case 400:
          // Validation errors
          if (data?.errors) {
            const firstError = Object.values(data.errors)[0]
            return Array.isArray(firstError) ? firstError[0] : String(firstError)
          }
          return data?.message || "Dữ liệu không hợp lệ"
          
        case 401:
          return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          
        case 403:
          return "Bạn không có quyền thực hiện thao tác này."
          
        case 404:
          return data?.message || "Không tìm thấy dữ liệu."
          
        case 409:
          return data?.message || "Dữ liệu đã tồn tại hoặc xung đột."
          
        case 500:
          return "Lỗi hệ thống. Vui lòng thử lại sau."
          
        case 503:
          return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau."
          
        default:
          return data?.message || `Lỗi ${status}: ${axiosError.message}`
      }
    } else if (axiosError.request) {
      // Network error
      return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
    }
  }
  
  // Generic error
  if (error instanceof Error) {
    return error.message
  }
  
  return "Có lỗi không xác định xảy ra."
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401
}

export function isValidationError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 400
}

