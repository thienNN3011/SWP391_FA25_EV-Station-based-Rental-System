"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Zap, DollarSign } from "lucide-react"
import Link from "next/link"

export function BookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [bookingType, setBookingType] = useState<"reserve" | "rent-now">("rent-now")
  const [isBooked, setIsBooked] = useState(false)

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooked(true)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/90"
      >
        <Zap className="mr-2 h-4 w-4" />
        Quick Book
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              Book Your Vehicle
            </DialogTitle>
          </DialogHeader>

          {!isBooked ? (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant={bookingType === "rent-now" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBookingType("rent-now")}
                  className="flex-1"
                >
                  Rent Now
                </Button>
                <Button
                  variant={bookingType === "reserve" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBookingType("reserve")}
                  className="flex-1"
                >
                  Reserve
                </Button>
              </div>

              <Card className="border-secondary/20 bg-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tesla Model 3</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Downtown Station
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">95% Battery</Badge>
                      <span className="text-muted-foreground">280 mi range</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-secondary">$25</div>
                      <div className="text-xs text-muted-foreground">per hour</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <form onSubmit={handleBooking} className="space-y-4">
                {bookingType === "reserve" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input id="start-time" type="time" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input id="end-time" type="time" required />
                      </div>
                    </div>
                  </>
                )}

                {bookingType === "rent-now" && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span>Vehicle will be available immediately after booking confirmation</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Estimated Cost</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-secondary">
                      ${bookingType === "rent-now" ? "25.00" : "150.00"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bookingType === "rent-now" ? "first hour" : "6 hours"}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Confirm Booking
                </Button>
              </form>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Zap className="h-5 w-5" />
                  Booking Confirmed!
                </CardTitle>
                <CardDescription>Your electric vehicle is ready for pickup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-mono">#ECO-2024-001</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span>Tesla Model 3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span>Downtown Station</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="default">Confirmed</Badge>
                  </div>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary-foreground">
                    <strong>Next Step:</strong> Head to the pickup location and complete the pickup process.
                  </p>
                </div>

                <Link href="/pickup">
                  <Button onClick={() => setIsOpen(false)} className="w-full">
                    Continue to Pickup
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
