"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Check } from "lucide-react"

interface SystemConfig {
  key: string
  value: string
  unit?: string
}

export default function SystemConfigAdmin() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/systemconfig/showallconfig")
        if (res.data.success) setConfigs(res.data.data || [])
        else setError(res.data.message || "Không thể tải dữ liệu")
      } catch (err: any) {
        console.error(err)
        setError("Lỗi khi kết nối server")
      } finally {
        setLoading(false)
      }
    }

    fetchConfigs()
  }, [])


  const handleUpdateConfig = async (key: string, value: string) => {
    try {
      const res = await api.post("/systemconfig/updateconfig", { key, value })
      if (res.data.success) {
        alert(`Cập nhật "${key}" thành công!`)
        setConfigs((prev) =>
          prev.map((c) => (c.key === key ? { ...c, value } : c))
        )
      } else {
        alert("Cập nhật thất bại: " + (res.data.message || ""))
      }
    } catch (err) {
      console.error(err)
      alert("Lỗi khi cập nhật cấu hình")
    }
  }

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6 space-y-6">
     
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h1 className="text-3xl font-semibold">Quản lý cấu hình hệ thống</h1>
      </div>
      <p className="text-muted-foreground">Thay đổi các thông số cấu hình của hệ thống</p>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cấu hình</CardTitle>
          <CardDescription>Key, Giá trị, Đơn vị</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((c) => (
                  <TableRow key={c.key}>
                    <TableCell className="font-medium">{c.key}</TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        defaultValue={c.value}
                        onChange={(e) => {
                          c.value = e.target.value
                        }}
                        placeholder="Nhập giá trị mới"
                      />
                    </TableCell>
                    <TableCell>{c.unit || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateConfig(c.key, c.value)}
                        className="flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Lưu
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
