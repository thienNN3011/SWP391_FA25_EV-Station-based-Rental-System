"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PenTool, RotateCcw, CheckCircle, Upload } from "lucide-react"

interface ESignatureProps {
  onComplete: () => void
}

export function ESignature({ onComplete }: ESignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(false)

  // --- Canvas Functions ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
      ctx.stroke()
      setHasSignature(true)
    }
  }

  const stopDrawing = () => setIsDrawing(false)

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasSignature(false)
    }
  }

  // --- Upload Photos ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const urls = files.map((file) => URL.createObjectURL(file))
    setUploadedPhotos((prev) => [...prev, ...urls])
  }

  // --- Submit ---
  const handleSubmit = () => {
    if (!hasSignature) {
      alert("Vui lòng ký tên trước khi tiếp tục.")
      return
    }
    if (uploadedPhotos.length < 6) {
      alert("Cần upload đủ 6 ảnh xe trước khi tiếp tục.")
      return
    }

    setIsSaved(true)
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  const canProceed = hasSignature && uploadedPhotos.length >= 6

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-secondary" />
          E-Signature & Upload Photos
        </CardTitle>
        <CardDescription>
          Vui lòng ký hợp đồng và upload đủ 6 ảnh xe trước khi nhận xe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSaved ? (
          <>
            {/* Ký tên */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Chữ ký điện tử</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="w-full h-32 cursor-crosshair bg-white rounded"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ký tên trực tiếp bằng chuột hoặc cảm ứng
                </p>
              </div>
              <Button
                variant="outline"
                onClick={clearSignature}
                disabled={!hasSignature}
                className="w-full"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Xóa chữ ký
              </Button>
            </div>

            {/* Upload ảnh */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload ảnh xe (6 ảnh)</label>
              <Input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <p className="text-xs text-gray-500">Đã upload: {uploadedPhotos.length}/6</p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {uploadedPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`uploaded-${idx}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Nút Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!canProceed}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Upload className="mr-2 h-4 w-4" />
              Hoàn tất bước này
            </Button>

            {!canProceed && (
              <p className="text-xs text-red-500 text-center">
                Bạn cần ký hợp đồng và upload đủ 6 ảnh trước khi tiếp tục.
              </p>
            )}
          </>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
            <p className="text-green-700 font-medium mt-2">
              Dữ liệu đã được lưu thành công!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
