"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function RentalResponsePage() {
  const searchParams = useSearchParams()
  const action = searchParams.get("action")
  const token = searchParams.get("token")
  const [message, setMessage] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<boolean | null>(null)

  useEffect(() => {
  const handleAction = async () => {
    if (!action || !token) {
      setMessage("Liên kết không hợp lệ.");
      setSuccess(false);
      setLoading(false);
      return;
    }

    try {
      const url =
        action === "confirm"
          ? `http://localhost:8080/EVRental/bookings/confirm?token=${token}`
          : `http://localhost:8080/EVRental/bookings/reject?token=${token}`;

      const res = await axios.get(url, {
        headers: { Accept: "text/html" },
        responseType: "text",
      });

      // luôn hiển thị HTML trả về từ backend
      setHtmlContent(res.data);
      setSuccess(true);
      setMessage("Thao tác thành công.");
    } catch (err) {
      console.error(err);
      setHtmlContent("");
      setSuccess(false);
      setMessage("Token không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  handleAction();
}, [action, token]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[420px] text-center shadow-md">
        <CardHeader>
          <CardTitle>
            {loading
              ? "Đang xử lý..."
              : success
              ? action === "confirm"
                ? "Xác nhận hợp đồng"
                : "Từ chối hợp đồng"
              : "Lỗi xác nhận"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Loader2 className="animate-spin mx-auto text-sky-500 w-10 h-10" />
          ) : success ? (
            <CheckCircle className="mx-auto text-green-500 w-10 h-10" />
          ) : (
            <XCircle className="mx-auto text-red-500 w-10 h-10" />
          )}

          <p className="mt-4 text-sm text-gray-700">{message}</p>

          {success && htmlContent && (
            <div
              className="mt-4 text-left text-gray-700 border-t pt-3 text-sm"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
