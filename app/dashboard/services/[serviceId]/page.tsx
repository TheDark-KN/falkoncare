"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { serviceItems, serviceCategories } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { CalendarPicker } from "@/components/booking/calendar-picker"
import { LocationPicker } from "@/components/booking/location-picker"
import { PaymentMethods } from "@/components/payment/payment-methods"
import type { PaymentMethod } from "@/lib/types"
import Link from "next/link"
// import { LocalBookingManager } from "@/lib/local-storage"

import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ServiceBookingPage() {
  const params = useParams()
  const router = useRouter()
  // const { isSignedIn, userId } = useAuth()
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { isAuthenticated } = useConvexAuth();

  // Use Convex for user data and wallet balance
  const userData = useQuery(api.users.current);
  const user = userData ? {
    clerkId: userData.clerkId,
    email: userData.email,
    fullName: userData.fullName || "",
    walletBalance: userData.walletBalance || 0,
  } : null;

  // Debug logging
  console.log("Clerk Auth isSignedIn:", isSignedIn, "isLoaded:", isLoaded);
  console.log("User data:", user);

  const service = serviceItems.find((s) => s.id === params.serviceId)
  const category = serviceCategories.find((c) => c.id === service?.categoryId)
  const IconComponent = getServiceIcon(category?.icon || "droplets")

  const [step, setStep] = useState(1)
  const [selectedTankSize, setSelectedTankSize] = useState<string | null>(null)
  const [selectedTankType, setSelectedTankType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>(undefined)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("wallet")
  const [notes, setNotes] = useState("")
  const [isBooking, setIsBooking] = useState(false)

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]

  // Calculate price
  const calculatePrice = () => {
    if (!service) return 0
    let price = service.basePrice

    if (selectedTankSize && service.tankSizes) {
      const sizeOption = service.tankSizes.find((s) => s.size === selectedTankSize)
      if (sizeOption) {
        price = service.basePrice * sizeOption.priceMultiplier
      }
    }

    if (selectedTankType && service.tankTypes) {
      const typeOption = service.tankTypes.find((t) => t.type === selectedTankType)
      if (typeOption) {
        price += typeOption.priceAddition
      }
    }

    return Math.round(price)
  }

  const totalPrice = calculatePrice()

  const canProceedStep1 = () => {
    if (service?.tankSizes && !selectedTankSize) return false
    if (service?.tankTypes && !selectedTankType) return false
    return true
  }

  const canProceedStep2 = () => {
    return selectedDate && selectedTime && selectedAddress.trim() !== ""
  }

  const createBooking = useMutation(api.bookings.create);

  const handleBooking = async () => {
    if (!service) {
      toast.error("Service not found. Please try again.")
      return
    }

    if (!isLoaded || !isAuthenticated) {
      toast.error("Please log in to book a service")
      return
    }

    setIsBooking(true)

    // ONLINE PAYMENT FLOW (Razorpay)
    if (["upi", "card", "netbanking"].includes(selectedPaymentMethod)) {
      try {
        const res = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }),
        })
        
        const order = await res.json()
        if (!res.ok) throw new Error(order.error || "Failed to create order")

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Falkon Care",
          description: `${service.name} Booking`,
          image: "/icon.png",
          order_id: order.id,
          handler: async function (response: any) {
            try {
              setIsBooking(true)
              // Process booking successfully after online payment
              await createBooking({
                serviceName: service.name,
                date: new Date(selectedDate!).getTime(),
                time: selectedTime!,
                amount: totalPrice,
                address: selectedAddress,
                tankSize: selectedTankSize || undefined,
                tankType: selectedTankType || undefined,
                paymentMethod: selectedPaymentMethod,
              });
              toast.success("Payment Received! Booking confirmed.")
              setStep(5)
            } catch (err: any) {
              console.error(err)
              toast.error("Payment succeeded but booking failed. Please contact support.")
            } finally {
               setIsBooking(false)
            }
          },
          prefill: {
            name: user?.fullName || "User",
            email: user?.email || "user@example.com",
          },
          theme: { color: "#519CAB" },
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function () {
          toast.error("Payment failed or was cancelled.")
          setIsBooking(false)
        });
        rzp.open();
      } catch (err) {
        console.error(err)
        toast.error("Failed to initialize payment gateway.")
        setIsBooking(false)
      }
      return; // Return early, Razorpay handles the rest
    }

    // CASH OR WALLET FLOW (Convex)
    try {
      await createBooking({
        serviceName: service.name,
        date: new Date(selectedDate!).getTime(),
        time: selectedTime!,
        amount: totalPrice,
        address: selectedAddress,
        tankSize: selectedTankSize || undefined,
        tankType: selectedTankType || undefined,
        paymentMethod: selectedPaymentMethod,
      });

      console.log("Booking created successfully");
      toast.success("Booking confirmed successfully!")
      setStep(5)
    } catch (error: any) {
      console.error("Booking error:", error);
      if (error.message === "INSUFFICIENT_WALLET_BALANCE") {
        toast.error("Insufficient wallet balance. Please recharge your wallet to continue.");
      } else if (error.message === "UNAUTHENTICATED") {
        toast.error("Please log in to book a service.");
      } else {
        toast.error(error.message || "Failed to create booking. Please try again.");
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar title="Service Not Found" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">The requested service was not found.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/services")}>
            Browse Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <TopBar title="Book Service" />

      <div className="p-6 max-w-4xl mx-auto relative z-10">


        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step > s ? <Icons.check className="w-5 h-5" /> : s}
              </div>
              {s < 4 && <div className={cn("w-16 h-1 mx-2 transition-colors", step > s ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Options */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Service with Image */}
            <Card className="glass-effect overflow-hidden">
              {service.image && (
                <div className="h-64 bg-muted relative">
                  <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">{service.name}</h2>
                    <p className="text-muted-foreground mt-1">{service.description}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icons.clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                      <span className="text-sm px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {category?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tank Size Selection */}
            {service.tankSizes && (
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Tank Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {service.tankSizes.map((option) => (
                      <button
                        key={option.size}
                        onClick={() => setSelectedTankSize(option.size)}
                        className={cn(
                          "p-4 rounded-lg border-2 text-center transition-all",
                          selectedTankSize === option.size
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <Icons.droplets
                          className={cn(
                            "w-6 h-6 mx-auto mb-2",
                            selectedTankSize === option.size ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <p className="font-medium text-foreground">{option.size}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center mt-1">
                          <Icons.rupee className="w-3 h-3" />
                          {Math.round(service.basePrice * option.priceMultiplier)}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tank Type Selection */}
            {service.tankTypes && (
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Tank Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {service.tankTypes.map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setSelectedTankType(option.type)}
                        className={cn(
                          "p-4 rounded-lg border-2 text-left transition-all",
                          selectedTankType === option.type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <p className="font-medium text-foreground">{option.type}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.priceAddition > 0
                            ? `+₹${option.priceAddition} additional charge`
                            : "No additional charge"}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Estimated Price</span>
                  <span className="text-2xl font-bold text-primary flex items-center">
                    <Icons.rupee className="w-5 h-5" />
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              disabled={!canProceedStep1()}
              onClick={() => setStep(2)}
            >
              Continue to Schedule
              <Icons.arrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time Selection with Full Calendar */}
        {step === 2 && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground">
              <Icons.arrowLeft className="w-4 h-4 mr-2" />
              Back to Options
            </Button>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <CalendarPicker onDateSelect={setSelectedDate} selectedDate={selectedDate || undefined} />

              {/* Time Slots */}
              <Card className="glass-effect h-fit">
                <CardHeader>
                  <CardTitle className="text-foreground">Select Time Slot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "p-3 rounded-lg border text-center transition-all",
                          selectedTime === time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 text-foreground",
                        )}
                      >
                        <Icons.clock className="w-4 h-4 mx-auto mb-1" />
                        {time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Location Picker */}
            <LocationPicker
              onLocationSelect={(address, pincode) => {
                setSelectedAddress(address)
                setSelectedPincode(pincode)
              }}
              initialAddress={selectedAddress}
            />

            {/* Notes */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Additional Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions or requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background border-input"
                  rows={3}
                />
              </CardContent>
            </Card>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              disabled={!canProceedStep2()}
              onClick={() => setStep(3)}
            >
              Continue to Payment
              <Icons.arrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground">
              <Icons.arrowLeft className="w-4 h-4 mr-2" />
              Back to Schedule
            </Button>

            <PaymentMethods
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={setSelectedPaymentMethod}
              amount={totalPrice}
            />

            {/* Wallet Balance Warning */}
            {selectedPaymentMethod === "wallet" && user && (
              <Card className={cn(
                "border-2",
                user.walletBalance < totalPrice
                  ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                  : "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Wallet Balance</p>
                      <p className={cn(
                        "text-2xl font-bold flex items-center mt-1",
                        user.walletBalance < totalPrice ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                      )}>
                        <Icons.rupee className="w-5 h-5" />
                        {user.walletBalance.toLocaleString()}
                      </p>
                    </div>
                    {user.walletBalance < totalPrice && (
                      <Link href="/dashboard/wallet">
                        <Button variant="outline" size="sm" className="border-red-500 text-red-600 hover:bg-red-50">
                          Recharge Wallet
                        </Button>
                      </Link>
                    )}
                  </div>
                  {user.walletBalance < totalPrice && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                      ⚠️ Insufficient balance. You need ₹{(totalPrice - user.walletBalance).toLocaleString()} more to complete this booking.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              onClick={() => setStep(4)}
            >
              Review Booking
              <Icons.arrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={() => setStep(3)} className="text-muted-foreground">
              <Icons.arrowLeft className="w-4 h-4 mr-2" />
              Back to Payment
            </Button>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-foreground">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service */}
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{category?.name}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {selectedTankSize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tank Size</span>
                      <span className="font-medium text-foreground">{selectedTankSize}</span>
                    </div>
                  )}
                  {selectedTankType && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tank Type</span>
                      <span className="font-medium text-foreground">{selectedTankType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">
                      {selectedDate &&
                        new Date(selectedDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium text-foreground capitalize">{selectedPaymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-foreground text-right max-w-xs">{selectedAddress || "Address not provided"}</span>
                  </div>
                  {selectedPincode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PIN Code</span>
                      <span className="font-medium text-foreground">{selectedPincode}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-primary flex items-center">
                      <Icons.rupee className="w-4 h-4" />
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleBooking}
                disabled={isBooking || (selectedPaymentMethod === "wallet" && user && user.walletBalance < totalPrice)}
                className={cn(
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all",
                  selectedPaymentMethod === "wallet" && user && user.walletBalance < totalPrice && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icons.check className="w-4 h-4 mr-2" />
                {selectedPaymentMethod === "wallet" && user && user.walletBalance < totalPrice
                  ? "Insufficient Balance"
                  : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Icons.checkCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your {service.name} has been scheduled for{" "}
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}{" "}
              at {selectedTime}. A confirmation has been sent to your email.
            </p>

            <div className="space-y-3 max-w-md mx-auto mb-8">
              <Card className="bg-green-500/5 border-green-500/20">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Booking ID</p>
                  <p className="font-mono font-semibold text-foreground">{`booking-${Date.now()}`.slice(0, 12)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <Button variant="outline" size="lg" onClick={() => router.push("/dashboard")} className="w-full">
                <Icons.home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
