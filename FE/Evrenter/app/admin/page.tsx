"use client"
import AppAdmin from "@/components/admin/AppAdmin"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!user) router.replace('/')
    else if (user.role !== 'ADMIN' && user.role !== 'STAFF') router.replace('/')
  }, [user, router])
  if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) return null
  return <AppAdmin />
}

