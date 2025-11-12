import axios from "axios"

export const api = axios.create({ //baseUrl
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/EVRental",
  headers: {
    "Content-Type": "application/json",
  },
})


api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      
        window.location.href = "/login"
      }
    }

   
    console.error("API Error:", error.response || error.message)

  
    return Promise.reject(error)
  }
)
