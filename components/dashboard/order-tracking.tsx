"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

interface BookingStatus {
  id: string
  customerName: string
  location: string
  tankSize: string
  waterType: string
  scheduledDate: string
  scheduledTime: string
  status: string
  estimatedDelivery: string
  driverName: string
  driverPhone: string
  vehicleNumber: string
}

interface TimelineItem {
  id: number
  status: string
  title: string
  description: string
  date: string
  completed: boolean
}

const mockBookingData: BookingStatus = {
  id: 'WT-2023-001234',
  customerName: 'Rajesh Kumar',
  location: 'Sector 45, Delhi',
  tankSize: '1000 Liters',
  waterType: 'Mineral Water',
  scheduledDate: '2023-06-15',
  scheduledTime: 'afternoon',
  status: 'in-transit',
  estimatedDelivery: '2023-06-15T14:30:00',
  driverName: 'Amit Sharma',
  driverPhone: '+91 7011365481',
  vehicleNumber: 'DL01AB1234',
}

const statusTimeline: TimelineItem[] = [
  { id: 1, status: 'confirmed',   title: 'Booking Confirmed', description: 'Your order has been confirmed',     date: '2023-06-14 10:30 AM', completed: true  },
  { id: 2, status: 'processing',  title: 'Processing',        description: 'Preparing your order',             date: '2023-06-14 11:15 AM', completed: true  },
  { id: 3, status: 'dispatched',  title: 'Dispatched',        description: 'Your order has been dispatched',   date: '2023-06-15 08:00 AM', completed: true  },
  { id: 4, status: 'in-transit',  title: 'In Transit',        description: 'On the way to your location',     date: '2023-06-15 12:30 PM', completed: true  },
  { id: 5, status: 'delivered',   title: 'Delivered',         description: 'Order delivered successfully',    date: '',                    completed: false },
]

const statusColors: Record<string, string> = {
  confirmed:   'bg-blue-500',
  processing:  'bg-blue-400',
  dispatched:  'bg-blue-300',
  'in-transit':'bg-amber-500',
  delivered:   'bg-green-500',
}

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      setBookingStatus(mockBookingData)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section id="order-tracking" className="py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">Track Your Order</h2>
        <p className="text-muted-foreground text-center mb-10">Enter your booking ID to track your service</p>

        <form onSubmit={handleTrackOrder} className="flex gap-3 mb-8">
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter Booking ID (e.g., WT-2023-001234)"
            className="bg-background border-input flex-1"
          />
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? <><Icons.loader className="w-4 h-4 mr-2 animate-spin" />Tracking...</> : 'Track Order'}
          </Button>
        </form>

        {bookingStatus && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-foreground">Booking Summary</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Booking ID', bookingStatus.id],
                  ['Customer', bookingStatus.customerName],
                  ['Location', bookingStatus.location],
                  ['Tank Size', bookingStatus.tankSize],
                  ['Water Type', bookingStatus.waterType],
                  ['Scheduled Date', new Date(bookingStatus.scheduledDate).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-white text-xs font-medium ${statusColors[bookingStatus.status] ?? 'bg-gray-400'}`}>
                    {bookingStatus.status.replace('-', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="text-foreground">Order Progress</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {statusTimeline.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className={`w-3 h-3 mt-1 rounded-full flex-shrink-0 ${item.completed ? 'bg-primary' : 'bg-muted'} ${bookingStatus.status === item.status ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                    <div>
                      <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.date && <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {bookingStatus.status === 'in-transit' && (
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-foreground">Delivery Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">ETA</p>
                    <p className="font-medium text-foreground">{new Date(bookingStatus.estimatedDelivery).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Technician</p>
                    <p className="font-medium text-foreground">{bookingStatus.driverName}</p>
                    <a href={`tel:${bookingStatus.driverPhone}`} className="text-primary hover:underline text-xs">Call</a>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-medium text-foreground">{bookingStatus.vehicleNumber}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Download Receipt</Button>
              <Button variant="outline" className="flex-1">Contact Support</Button>
            </div>
          </div>
        )}

        {!bookingStatus && !isLoading && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground text-center">Booking Confirmation Preview</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Booking ID', 'WT-2023-001234'],
                ['Address', 'Sector 45, Delhi'],
                ['Tank Size', '1000 Liters'],
                ['Water Type', 'Mineral Water'],
                ['Date', 'June 15, 2023'],
                ['Time Slot', 'Afternoon (12PM–4PM)'],
                ['Total', '₹600'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-muted-foreground">{label}</p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

export default OrderTracking