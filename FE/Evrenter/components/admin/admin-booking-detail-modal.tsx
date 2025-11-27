"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminBookingDetail } from "@/hooks/use-bookings"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  User,
  CreditCard,
  Phone,
  Mail,
  FileText,
  Calendar,
  Gauge,
  ArrowDownCircle,
  ArrowUpCircle,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

interface AdminBookingDetailModalProps {
  bookingId: number | null
  onClose: () => void
}

const STATUS_LABELS: Record<string, string> = {
  BOOKING: "Đã hoàn tất cọc",
  UNCONFIRMED: "Chưa xác nhận",
  RENTING: "Đang thuê",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  NO_SHOW: "Không đến",
}

const STATUS_COLORS: Record<string, string> = {
  BOOKING: "bg-yellow-400 text-black",
  RENTING: "bg-blue-500 text-white",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-500 text-white",
  NO_SHOW: "bg-red-500 text-white",
  UNCONFIRMED: "bg-red-500 text-white",
}

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: "Đặt cọc",
  FINAL_PAYMENT: "Thanh toán cuối",
  REFUND_DEPOSIT: "Hoàn cọc",
}

const PAYMENT_TYPE_ICONS: Record<string, typeof ArrowDownCircle> = {
  DEPOSIT: ArrowDownCircle,
  FINAL_PAYMENT: ArrowDownCircle,
  REFUND_DEPOSIT: ArrowUpCircle,
}

const PAYMENT_TYPE_COLORS: Record<string, string> = {
  DEPOSIT: "text-green-600",
  FINAL_PAYMENT: "text-green-600",
  REFUND_DEPOSIT: "text-orange-600",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

function formatDateTime(dateTime: string | null) {
  if (!dateTime) return "—"
  return new Date(dateTime).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(dateTime: string | null) {
  if (!dateTime) return "—"
  return new Date(dateTime).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2">
      {copied ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
      <span className="sr-only">Copy {label}</span>
    </Button>
  )
}

export function AdminBookingDetailModal({ bookingId, onClose }: AdminBookingDetailModalProps) {
  const { data: booking, isLoading, error } = useAdminBookingDetail(bookingId)

  return (
    <Dialog open={!!bookingId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Chi tiết Booking #{bookingId}</span>
            {booking && (
              <Badge className={STATUS_COLORS[booking.status] || "bg-gray-500"}>
                {STATUS_LABELS[booking.status] || booking.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <LoadingSkeleton />}

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
            <AlertCircle className="size-5" />
            <span>Không thể tải thông tin booking</span>
          </div>
        )}

        {booking && (
          <Tabs defaultValue="booking" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="booking">
                <Car className="mr-2 size-4" />
                Booking
              </TabsTrigger>
              <TabsTrigger value="customer">
                <User className="mr-2 size-4" />
                Khách hàng
              </TabsTrigger>
              <TabsTrigger value="payments">
                <CreditCard className="mr-2 size-4" />
                Thanh toán
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Booking Info */}
            <TabsContent value="booking" className="mt-4 space-y-4">
              <BookingInfoTab booking={booking} />
            </TabsContent>

            {/* Tab 2: Customer Info */}
            <TabsContent value="customer" className="mt-4 space-y-4">
              <CustomerInfoTab customer={booking.customer} />
            </TabsContent>

            {/* Tab 3: Payment History */}
            <TabsContent value="payments" className="mt-4 space-y-4">
              <PaymentHistoryTab booking={booking} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BookingInfoTab({ booking }: { booking: any }) {
  const rentalDays = getRentalDays(booking.startTime, booking.endTime)

  return (
    <>
      {/* Vehicle & Station */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="size-4 text-primary" />
              Thông tin xe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Mẫu xe" value={`${booking.vehicle.brand} ${booking.vehicle.modelName}`} />
            <InfoRow label="Biển số" value={booking.vehicle.plateNumber} />
            <InfoRow label="Màu sắc" value={booking.vehicle.color} className="capitalize" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4 text-primary" />
              Trạm thuê
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Tên trạm" value={booking.station.stationName} />
            <InfoRow label="Địa chỉ" value={booking.station.address} />
            <InfoRow label="Giờ mở cửa" value={booking.station.openingHours} />
          </CardContent>
        </Card>
      </div>

      {/* Rental Period */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 text-primary" />
            Thời gian thuê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="font-medium text-muted-foreground">Dự kiến</p>
              <InfoRow label="Bắt đầu" value={formatDateTime(booking.startTime)} />
              <InfoRow label="Kết thúc" value={formatDateTime(booking.endTime)} />
            </div>
            {(booking.actualStartTime || booking.actualEndTime) && (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-muted-foreground">Thực tế</p>
                <InfoRow label="Bắt đầu" value={formatDateTime(booking.actualStartTime)} />
                <InfoRow label="Kết thúc" value={formatDateTime(booking.actualEndTime)} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Odometer */}
      {(booking.startOdo !== null || booking.endOdo !== null) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="size-4 text-primary" />
              Số km đồng hồ
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoRow label="Khi nhận xe" value={booking.startOdo ? `${booking.startOdo.toLocaleString()} km` : "—"} />
              <InfoRow label="Khi trả xe" value={booking.endOdo ? `${booking.endOdo.toLocaleString()} km` : "—"} />
              {booking.startOdo && booking.endOdo && (
                <InfoRow
                  label="Quãng đường"
                  value={`${(booking.endOdo - booking.startOdo).toLocaleString()} km`}
                  className="font-semibold text-primary"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="size-4 text-primary" />
            Chi phí
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <InfoRow label="Gói thuê" value={booking.tariff.type === "DAY" ? "Theo ngày" : "Theo giờ"} />
            <InfoRow label="Đơn giá" value={formatCurrency(booking.tariff.price)} />
            <InfoRow label="Số ngày thuê" value={`${rentalDays} ngày`} />
            <InfoRow label="Tiền cọc" value={formatCurrency(booking.tariff.depositAmount)} />
          </div>
          <Separator />
          <div className="space-y-2">
            <InfoRow label="Tạm tính(dự kiến)" value={formatCurrency(booking.expectedTotalAmount)} />
            {booking.penaltyAmount > 0 && (
              <InfoRow label="Phí phạt trả muộn" value={formatCurrency(booking.penaltyAmount)} className="text-red-600" />
            )}
            <InfoRow
              label="Tổng thanh toán cuối"
              value={formatCurrency(booking.totalAmount)}
              className="text-lg font-bold text-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Info for cancelled bookings */}
      {booking.status === "CANCELLED" && booking.bankName && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-orange-700">
              <CreditCard className="size-4" />
              Thông tin hoàn tiền
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <InfoRow label="Ngân hàng" value={booking.bankName} />
            <InfoRow label="Số tài khoản" value={booking.bankAccount} />
          </CardContent>
        </Card>
      )}

      {/* Booking metadata */}
      <div className="text-xs text-muted-foreground">
        <p>Ngày tạo booking: {formatDateTime(booking.createdDate)}</p>
      </div>
    </>
  )
}

function CustomerInfoTab({ customer }: { customer: any }) {
  return (
    <>
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4 text-primary" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Họ tên:</span>
              <span className="font-medium">{customer.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Username:</span>
              <span className="font-medium">{customer.username}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="size-4 text-primary" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">SĐT:</span>
            <span className="font-medium">{customer.phone}</span>
            <CopyButton text={customer.phone} label="phone" />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{customer.email}</span>
            <CopyButton text={customer.email} label="email" />
          </div>
        </CardContent>
      </Card>

      {/* ID Documents */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 text-primary" />
            Giấy tờ tùy thân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <InfoRow label="Số CMND/CCCD" value={customer.idCard || "—"} />
              {customer.idCardPhoto && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Ảnh CMND/CCCD:</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image
                      src={customer.idCardPhoto}
                      alt="CMND/CCCD"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-id.png"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <InfoRow label="Số GPLX" value={customer.driveLicense || "—"} />
              {customer.driveLicensePhoto && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Ảnh GPLX:</p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image
                      src={customer.driveLicensePhoto}
                      alt="GPLX"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-id.png"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="size-4 text-primary" />
            Thông tin tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <InfoRow label="Trạng thái" value={customer.status === "ACTIVE" ? "Hoạt động" : customer.status} />
          <InfoRow label="Ngày đăng ký" value={formatDate(customer.createdDate)} />
        </CardContent>
      </Card>
    </>
  )
}

function PaymentHistoryTab({ booking }: { booking: any }) {
  const payments = booking.paymentHistory || []

  return (
    <>
      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="size-4 text-primary" />
            Tổng quan thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-muted-foreground">Tiền cọc</p>
              <p className="text-lg font-semibold">{formatCurrency(booking.tariff.depositAmount)}</p>
            </div>
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-muted-foreground">Tổng booking</p>
              <p className="text-lg font-semibold">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <div className="rounded-md bg-muted p-3 text-center">
              <p className="text-muted-foreground">Số giao dịch</p>
              <p className="text-lg font-semibold">{payments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="size-4 text-primary" />
            Lịch sử giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">Chưa có giao dịch nào</p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment: any, index: number) => {
                const Icon = PAYMENT_TYPE_ICONS[payment.paymentType] || CreditCard
                const colorClass = PAYMENT_TYPE_COLORS[payment.paymentType] || "text-gray-600"

                return (
                  <div key={payment.paymentId} className="relative flex gap-4">
                    {/* Timeline line */}
                    {index !== payments.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-px bg-border" />
                    )}

                    {/* Icon */}
                    <div className={`z-10 flex size-10 items-center justify-center rounded-full bg-muted ${colorClass}`}>
                      <Icon className="size-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {PAYMENT_TYPE_LABELS[payment.paymentType] || payment.paymentType}
                        </p>
                        <p className={`font-semibold ${colorClass}`}>
                          {payment.paymentType === "REFUND_DEPOSIT" ? "-" : "+"}
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{formatDateTime(payment.transactionDate)}</p>
                        <p>
                          Phương thức: {payment.method || "—"} • Mã: {payment.referenceCode}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function InfoRow({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className={className}>{value}</span>
    </div>
  )
}

function getRentalDays(startTime: string, endTime: string) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const diffMs = end.getTime() - start.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  )
}

