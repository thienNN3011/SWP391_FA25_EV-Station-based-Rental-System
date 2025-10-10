import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { jwtDecode } from 'jwt-decode'
import App from './App'
import './index.css'

function Root() {
  useEffect(() => {
    // Kiểm tra auth khi component mount
    const token = localStorage.getItem('token')
    
    if (!token) {
      // Không có token -> về trang login
      window.location.href = "http://localhost:3000"
      return
    }

    try {
      const decoded = jwtDecode(token)
      if (decoded.role !== "ADMIN") {
        // Không phải admin -> về trang chính
        window.location.href = "http://localhost:3000"
      }
    } catch {
      window.location.href = "http://localhost:3000"
    }
  }, [])

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)