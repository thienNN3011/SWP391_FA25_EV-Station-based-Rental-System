"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, DollarSign, Clock, Car, Leaf, CreditCard } from "lucide-react"
import Link from "next/link"

interface FinalPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FinalPaymentModal({ isOpen, onClose }: FinalPaymentModalProps) {
  const rentalDetails = {
    baseRate: 25,
    duration: 3.4, // 3 hours 24 minutes
    mileage: 127,
    mileageRate: 0.15,
    subtotal: 104.05,
    tax: 8.32,
    total: 112.37,
    co2Saved: 28.5,
    fuelSavings: 18.75,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-secondary" />
            Final Payment Summary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rental Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Tesla Model 3<Badge variant="default">Completed</Badge>
              </CardTitle>
              <CardDescription>Booking #ECO-2024-001 • Downtown Station</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{rentalDetails.duration}h duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span>{rentalDetails.mileage} miles</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charges Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Charges Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  Base rate ({rentalDetails.duration}h × ${rentalDetails.baseRate}/h)
                </span>
                <span>${(rentalDetails.duration * rentalDetails.baseRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>
                  Mileage ({rentalDetails.mileage} mi × ${rentalDetails.mileageRate}/mi)
                </span>
                <span>${(rentalDetails.mileage * rentalDetails.mileageRate).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${rentalDetails.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax & Fees</span>
                <span>${rentalDetails.tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span className="text-lg text-secondary">${rentalDetails.total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-800">
                <Leaf className="h-5 w-5" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{rentalDetails.co2Saved} lbs</div>
                  <div className="text-green-700">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">${rentalDetails.fuelSavings}</div>
                  <div className="text-green-700">Fuel Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Visa ending in 4242</div>
                  </div>
                </div>
                <Badge variant="secondary">Charged</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Payment Processed Successfully</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your rental has been completed and payment has been charged to your card. A receipt has been sent to your
              email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                View History
              </Button>
            </Link>
            <Button onClick={onClose} className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
