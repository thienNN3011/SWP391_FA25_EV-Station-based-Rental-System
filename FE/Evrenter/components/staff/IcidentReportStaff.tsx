"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// co file .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function IncidentReportStaff() {
  const [bookingId, setBookingId] = useState("")
  const [description, setDescription] = useState("")
  const [incidentImage, setIncidentImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ham chon anh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIncidentImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // upload ảnh
  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error } = await supabase.storage
        .from("uploads/incident") 
        .upload(filePath, file)

      if (error) {
        console.error("Lỗi upload ảnh:", error.message)
        toast({
          title: "Lỗi tải ảnh",
          description: "Không thể tải ảnh lên Supabase.",
          variant: "destructive",
        })
        return null
      }
//lấy url cho supbase
      const { data } = supabase.storage.from("uploads/incident").getPublicUrl(filePath)
      return data.publicUrl
    } catch (err) {
      console.error("Lỗi upload ảnh:", err)
      return null
    }
  }
// gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingId || !description) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ thông tin trước khi gửi.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      let imageUrl = ""
      if (incidentImage) {
        const uploadedUrl = await uploadImageToSupabase(incidentImage)
        if (!uploadedUrl) throw new Error("Không upload được ảnh")
        imageUrl = uploadedUrl
      }

      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:8080/EVRental/incidentreport/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          description,
          incidentImageUrl: imageUrl,
        }),
      })

      const result = await response.json()

      if (result.success) {
  alert("Báo cáo vi phạm đã được gửi thành công!") 
  setBookingId("")
  setDescription("")
  setIncidentImage(null)
  setPreviewUrl(null)
} else {
  alert(result.message || "Không thể gửi báo cáo.") 
}

    } catch (err) {
  console.error("Lỗi khi gửi báo cáo:", err)
  alert("Không thể kết nối đến máy chủ.") 
}finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Báo cáo vi phạm / sự cố
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bookingId">Mã thuê xe (Booking ID)</Label>
              <Input
                id="bookingId"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Nhập mã thuê xe..."
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả sự cố</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Xe bị xước, móp đầu, hư đèn..."
              />
            </div>

            <div>
              <Label htmlFor="incidentImage">Hình ảnh minh chứng</Label>
              <Input id="incidentImage" type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded mt-2 border"
                />
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi báo cáo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
