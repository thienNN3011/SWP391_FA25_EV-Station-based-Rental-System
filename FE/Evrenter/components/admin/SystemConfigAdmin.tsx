"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings, Check, Clock, Percent, RefreshCw, Ban, Timer } from "lucide-react"

interface SystemConfig {
  key: string
  value: string
  unit?: string
}

export default function SystemConfigAdmin() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [editedValues, setEditedValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState("")

  const configInfo: Record<string, { label: string; icon: any; description: string; color: string }> = {
    OVERTIME_EXTRA_RATE: {
      label: "Phụ thu thêm giờ",
      icon: Percent,
      description: "Phần trăm phụ thu khi khách trả xe trễ",
      color: "text-red-500",
    },
    QR_EXPIRE: {
      label: "Thời hạn thanh toán",
      icon: Timer,
      description: "Thời gian tối đa để khách thanh toán đặt cọc",
      color: "text-blue-500",
    },
    CHECK_IN_EXPIRE: {
      label: "Thời hạn nhận xe",
      icon: Clock,
      description: "Thời gian tối đa khách có thể đến nhận xe sau giờ hẹn",
      color: "text-amber-500",
    },
    REFUND: {
      label: "Hoàn tiền khi hủy",
      icon: RefreshCw,
      description: "Phần trăm tiền cọc được hoàn khi khách hủy đơn",
      color: "text-green-500",
    },
    CANCEL_BOOKING_REFUND_EXPIRE: {
      label: "Thời hạn hủy hoàn tiền",
      icon: Ban,
      description: "Thời gian tối đa để hủy đơn và được hoàn tiền",
      color: "text-purple-500",
    },
  }

  const translateUnit = (unit?: string) => {
    const map: Record<string, string> = {
      PERCENT: "%",
      MINUTE: "phút",
    }
    return unit ? map[unit] || unit : ""
  }


  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get("/systemconfig/showallconfig")
        if (res.data.success) {
          setConfigs(res.data.data || [])
          const initialValues: Record<string, string> = {}
          res.data.data?.forEach((c: SystemConfig) => {
            initialValues[c.key] = c.value
          })
          setEditedValues(initialValues)
        } else {
          setError(res.data.message || "Không thể tải dữ liệu")
        }
      } catch (err: any) {
        console.error(err)
        setError("Lỗi khi kết nối server")
      } finally {
        setLoading(false)
      }
    }

    fetchConfigs()
  }, [])

  const handleUpdateConfig = async (key: string) => {
    const value = editedValues[key]
    setSaving(key)
    try {
      const res = await api.post("/systemconfig/updateconfig", { key, value })
      if (res.data.success) {
        setConfigs((prev) =>
          prev.map((c) => (c.key === key ? { ...c, value } : c))
        )
      } else {
        alert("Cập nhật thất bại: " + (res.data.message || ""))
      }
    } catch (err) {
      console.error(err)
      alert("Lỗi khi cập nhật cấu hình")
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Cấu hình hệ thống</h1>
          <p className="text-sm text-muted-foreground">Quản lý các thông số vận hành của hệ thống</p>
        </div>
      </div>

      {/* Config Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {configs.map((c) => {
            const info = configInfo[c.key] || {
              label: c.key,
              icon: Settings,
              description: "",
              color: "text-gray-500",
            }
            const Icon = info.icon
            const hasChanged = editedValues[c.key] !== c.value

            return (
              <Card key={c.key} className="relative overflow-hidden hover:shadow-md transition-shadow">
                <div className={`absolute top-0 left-0 w-1 h-full ${info.color.replace("text-", "bg-")}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${info.color}`} />
                    <CardTitle className="text-base">{info.label}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{info.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={editedValues[c.key] || ""}
                      onChange={(e) => setEditedValues((prev) => ({ ...prev, [c.key]: e.target.value }))}
                      className="text-lg font-semibold"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {translateUnit(c.unit)}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleUpdateConfig(c.key)}
                    disabled={!hasChanged || saving === c.key}
                    className="w-full gap-2"
                    variant={hasChanged ? "default" : "outline"}
                  >
                    {saving === c.key ? (
                      "Đang lưu..."
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {hasChanged ? "Lưu thay đổi" : "Đã lưu"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
