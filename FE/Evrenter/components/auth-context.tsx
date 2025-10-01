"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface User {
  username: string
  token: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  const setUser = (newUser: User) => {
    setUserState(newUser)
    // Có thể lưu token vào localStorage nếu muốn giữ đăng nhập lâu dài
    localStorage.setItem("token", newUser.token)
    localStorage.setItem("username", newUser.username)
  }

  const logout = () => {
    setUserState(null)
    localStorage.removeItem("token")
    localStorage.removeItem("username")
  }

  const value = { user, setUser, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
