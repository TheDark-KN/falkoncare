"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { serviceItems, serviceCategories } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { CalendarPicker } from "@/components/booking/calendar-picker"
import dynamic from "next/dynamic"
const LocationPicker = dynamic(
  () => import("@/components/booking/location-picker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center text-sm text-slate-400 font-bold font-headline">
        Loading map...
      </div>
    ),
  }
)
import { PaymentMethods } from "@/components/payment/payment-methods"
import type { PaymentMethod, RazorpayResponse } from "@/lib/types"
import Link from "next/link"
import { useMutation, useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import Script from "next/script"

export default function ServiceBookingPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth()

  // Use Convex for user data and wallet balance
  const userData = useQuery(api.users.current)
  const user = userData ? {
    _id: userData._id,
    email: userData.email,
    fullName: userData.name || userData.fullName || "",
    walletBalance: userData.walletBalance || 0,
    phoneNumber: userData.phone || userData.phoneNumber || "",
  } : null

  const service = serviceItems.find((s) => s.id === params.serviceId)
  const category = serviceCategories.find((c) => c.id === service?.categoryId)
  const IconComponent = getServiceIcon(category?.icon || "droplets")

  // Form Wizard Steps:
  // 1: Service Configuration & Scheduling
  // 2: Location Picker (Map-based)
  // 3: Review & Payment (includes DPDP consent checks)
  // 4: Booking Success
  const [step, setStep] = useState(1)

  // Step 1 States: Service details
  const [selectedTankSize, setSelectedTankSize] = useState<string | null>(null)
  const [selectedTankType, setSelectedTankType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [rankLevel, setRankLevel] = useState("Residential (Standard)")
  const [notes, setNotes] = useState("")

  // Step 2 States: Location Details
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>(undefined)
  const [latitude, setLatitude] = useState<number | undefined>(undefined)
  const [longitude, setLongitude] = useState<number | undefined>(undefined)
  const [locationSource, setLocationSource] = useState<"live" | "manual">("manual")

  // Step 3 States: Payment & Consent
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("wallet")
  const [isBooking, setIsBooking] = useState(false)
  const [isConsentGiven, setIsConsentGiven] = useState(false)
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false)

  // Pre-populate fullName and address from profile data
  const [fullName, setFullName] = useState("")
  useEffect(() => {
    if (userData) {
      if (userData.fullName && !fullName) setFullName(userData.fullName)
      if (userData.address && !selectedAddress) setSelectedAddress(userData.address)
    }
  }, [userData, fullName, selectedAddress])

  // Redirect to /complete-profile if profile is incomplete (no phone or DOB)
  useEffect(() => {
    if (userData) {
      if (!(userData.phone || userData.phoneNumber) || !userData.dob) {
        toast.info("Please complete your profile to book a service.")
        router.push("/complete-profile")
      }
    }
  }, [userData, router])

  const timeSlots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"]

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

  // Load state from sessionStorage on mount
  useEffect(() => {
    if (!params.serviceId) return
    try {
      const saved = sessionStorage.getItem(`falkoncare_booking_state_${params.serviceId}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.step && data.step < 4) setStep(data.step) // don't restore straight to success step
        if (data.selectedTankSize) setSelectedTankSize(data.selectedTankSize)
        if (data.selectedTankType) setSelectedTankType(data.selectedTankType)
        if (data.selectedDate) setSelectedDate(data.selectedDate)
        if (data.selectedTime) setSelectedTime(data.selectedTime)
        if (data.rankLevel) setRankLevel(data.rankLevel)
        if (data.notes) setNotes(data.notes)
        if (data.selectedAddress) setSelectedAddress(data.selectedAddress)
        if (data.selectedPincode) setSelectedPincode(data.selectedPincode)
        if (data.latitude) setLatitude(data.latitude)
        if (data.longitude) setLongitude(data.longitude)
        if (data.locationSource) setLocationSource(data.locationSource)
        if (data.selectedPaymentMethod) setSelectedPaymentMethod(data.selectedPaymentMethod)
        if (data.isConsentGiven) setIsConsentGiven(data.isConsentGiven)
        if (data.isAgeConfirmed) setIsAgeConfirmed(data.isAgeConfirmed)
      }
    } catch (e) {
      console.error("Failed to load booking state from sessionStorage:", e)
    }
  }, [params.serviceId])

  // Save state to sessionStorage on any changes
  useEffect(() => {
    if (!params.serviceId || step === 4) return
    try {
      const stateToSave = {
        step,
        selectedTankSize,
        selectedTankType,
        selectedDate,
        selectedTime,
        rankLevel,
        notes,
        selectedAddress,
        selectedPincode,
        latitude,
        longitude,
        locationSource,
        selectedPaymentMethod,
        isConsentGiven,
        isAgeConfirmed,
      }
      sessionStorage.setItem(`falkoncare_booking_state_${params.serviceId}`, JSON.stringify(stateToSave))
    } catch (e) {
      console.error("Failed to save booking state to sessionStorage:", e)
    }
  }, [
    params.serviceId,
    step,
    selectedTankSize,
    selectedTankType,
    selectedDate,
    selectedTime,
    rankLevel,
    notes,
    selectedAddress,
    selectedPincode,
    latitude,
    longitude,
    locationSource,
    selectedPaymentMethod,
    isConsentGiven,
    isAgeConfirmed,
  ])

  // Step 1 Validation
  const canProceedStep1 = () => {
    if (service?.tankSizes && !selectedTankSize) return false
    if (service?.tankTypes && !selectedTankType) return false
    return selectedDate !== null && selectedTime !== null
  }

  // Step 2 Validation
  const canProceedStep2 = () => {
    return selectedAddress.trim().length > 5
  }

  // Step 3 Validation
  const canProceedStep3 = () => {
    return isConsentGiven && isAgeConfirmed
  }

  const createBooking = useMutation(api.bookings.create)

  const handleBooking = async () => {
    if (!service) {
      toast.error("Service not found. Please try again.")
      return
    }

    if (!isAuthenticated) {
      toast.error("Please log in to book a service")
      return
    }

    if (!isConsentGiven || !isAgeConfirmed) {
      toast.error("Please accept the privacy notice and confirm your age.")
      return
    }

    setIsBooking(true)

    // Overload address with latitude, longitude and source coordinates to preserve existing schema
    const locationMetadata = latitude && longitude 
      ? ` (Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}, Source: ${locationSource})`
      : ""
    const finalAddress = `${selectedAddress}${locationMetadata}`

    const userEmail = user?.email || "user@example.com"
    const userPhone = user?.phoneNumber || "7011365481"

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
          handler: async function (response: RazorpayResponse) {
            try {
              setIsBooking(true)
              await createBooking({
                serviceName: service.name,
                date: new Date(selectedDate!).getTime(),
                time: selectedTime!,
                amount: totalPrice,
                address: finalAddress,
                tankSize: selectedTankSize || undefined,
                tankType: selectedTankType || undefined,
                paymentMethod: selectedPaymentMethod,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              })
              
              // Clear active session storage on success
              try {
                sessionStorage.removeItem(`falkoncare_booking_state_${params.serviceId}`)
              } catch (e) {}

              toast.success("Payment Received! Booking confirmed.")
              setStep(4)
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Booking failed"
              toast.error(`Payment succeeded but booking failed: ${msg}. Please contact support.`)
            } finally {
               setIsBooking(false)
            }
          },
          prefill: {
            name: fullName || user?.fullName || "User",
            email: userEmail,
            contact: userPhone,
          },
          theme: { color: "#006194" },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.on("payment.failed", function () {
          toast.error("Payment failed or was cancelled.")
          setIsBooking(false)
        })
        rzp.open()
      } catch (err) {
        console.error(err)
        toast.error("Failed to initialize payment gateway.")
        setIsBooking(false)
      }
      return
    }

    // CASH OR WALLET FLOW (Convex)
    try {
      await createBooking({
        serviceName: service.name,
        date: new Date(selectedDate!).getTime(),
        time: selectedTime!,
        amount: totalPrice,
        address: finalAddress,
        tankSize: selectedTankSize || undefined,
        tankType: selectedTankType || undefined,
        paymentMethod: selectedPaymentMethod,
      })

      // Clear active session storage on success
      try {
        sessionStorage.removeItem(`falkoncare_booking_state_${params.serviceId}`)
      } catch (e) {}

      toast.success("Booking confirmed successfully!")
      setStep(4)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking failed"
      toast.error(msg)
    } finally {
      setIsBooking(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Book Service" />
        <div className="p-8 text-center font-headline">
          <p className="text-slate-500 font-bold">Service not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col pb-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <TopBar title={`Book ${service.name}`} />

      <div className="max-w-4xl w-full mx-auto px-4 md:px-6 pt-8 flex-1 flex flex-col justify-start">
        
        {/* WIZARD STEP HEADER */}
        {step < 4 && (
          <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-primary font-headline">Step {step} of 3</span>
              <h2 className="text-xl font-headline font-black text-sky-900 dark:text-white leading-tight">
                {step === 1 ? "Configure Service" : step === 2 ? "Specify Address & Map Pin" : "Final Review & Pay"}
              </h2>
            </div>
            
            {/* Horizontal Stepper dots */}
            <div className="flex items-center gap-2">
              <span className={cn("w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-xs transition-all", step === 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>1</span>
              <span className="w-6 h-0.5 bg-slate-200 dark:bg-slate-800"></span>
              <span className={cn("w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-xs transition-all", step === 2 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>2</span>
              <span className="w-6 h-0.5 bg-slate-200 dark:bg-slate-800"></span>
              <span className={cn("w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-xs transition-all", step === 3 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500")}>3</span>
            </div>
          </div>
        )}

        {/* STEP 1: CONFIGURE SERVICE & SLOT */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-headline font-bold text-sky-900 dark:text-white leading-tight">{service.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{service.description}</p>
                  </div>
                </div>

                {/* Tank Size Selection */}
                {service.tankSizes && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Select Tank Size</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {service.tankSizes.map((option) => (
                        <button
                          key={option.size}
                          type="button"
                          onClick={() => setSelectedTankSize(option.size)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all cursor-pointer",
                            selectedTankSize === option.size
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-200/60 dark:border-slate-800/60 hover:border-primary/50 text-slate-600 dark:text-slate-300",
                          )}
                        >
                          <Icons.droplets
                            className={cn(
                              "w-5 h-5 mx-auto mb-2",
                              selectedTankSize === option.size ? "text-primary fill-primary/20" : "text-slate-400",
                            )}
                          />
                          <p className="font-bold text-xs font-headline">{option.size}</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-bold font-headline flex items-center justify-center">
                            ₹{Math.round(service.basePrice * option.priceMultiplier)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tank Type Selection */}
                {service.tankTypes && (
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Select Tank Placement</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {service.tankTypes.map((option) => (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => setSelectedTankType(option.type)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                            selectedTankType === option.type
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-200/60 dark:border-slate-800/60 hover:border-primary/50 text-slate-600 dark:text-slate-300",
                          )}
                        >
                          <p className="font-bold text-xs font-headline">{option.type}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium font-headline">
                            {option.priceAddition > 0 ? `+₹${option.priceAddition} additional` : "Standard pricing"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date & Time Picker */}
            <div className="grid lg:grid-cols-2 gap-6">
              <CalendarPicker onDateSelect={setSelectedDate} selectedDate={selectedDate || undefined} />

              <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl h-fit">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Select Time Slot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer",
                          selectedTime === time
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200/60 dark:border-slate-800/60 hover:border-primary/50 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/20",
                        )}
                      >
                        <Icons.clock className="w-4 h-4" />
                        <span className="text-[10px] font-bold font-headline">{time}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rank / Level selection */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Service Tier</h4>
                <select
                  value={rankLevel}
                  onChange={(e) => setRankLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold font-headline focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option>Industrial (High)</option>
                  <option>Commercial (Medium)</option>
                  <option>Residential (Standard)</option>
                </select>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Additional Notes (Optional)</h4>
                <Textarea
                  placeholder="Special instructions, water access guidelines, or landmark details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-855 border-slate-200 dark:border-slate-800 rounded-xl font-headline"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Est pricing banner */}
            <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <span className="font-headline font-bold text-slate-600 dark:text-slate-400">Estimated Price</span>
              <span className="text-2xl font-headline font-black text-primary flex items-center">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Wizard actions */}
            <div className="flex gap-4">
              <Button
                className="w-full py-6 rounded-xl font-headline font-bold text-white shadow-lg shadow-primary/20 active:scale-95 duration-200 border-0"
                disabled={!canProceedStep1()}
                onClick={() => setStep(2)}
              >
                Continue to Location
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION MAP PICKER */}
        {step === 2 && (
          <div className="space-y-6">
            <LocationPicker
              onLocationSelect={(addr, pin, lat, lng, src) => {
                setSelectedAddress(addr)
                setSelectedPincode(pin)
                setLatitude(lat)
                setLongitude(lng)
                setLocationSource(src || "manual")
              }}
              initialAddress={selectedAddress}
              initialLat={latitude}
              initialLng={longitude}
              initialSource={locationSource}
            />

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="py-6 rounded-xl font-headline font-bold"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1 py-6 rounded-xl font-headline font-bold text-white shadow-lg shadow-primary/20 active:scale-95 duration-200 border-0"
                disabled={!canProceedStep2()}
                onClick={() => setStep(3)}
              >
                Continue to Review &amp; Pay
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & PAY (DPDP consent notice) */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <PaymentMethods
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={setSelectedPaymentMethod}
              amount={totalPrice}
            />

            {/* Wallet Balance Warning */}
            {selectedPaymentMethod === "wallet" && user && (
              <Card className={cn(
                "border-2 rounded-2xl",
                user.walletBalance < totalPrice
                  ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900"
                  : "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 font-headline uppercase tracking-wider">Wallet Balance</p>
                      <p className={cn(
                        "text-2xl font-headline font-black flex items-center mt-1",
                        (user.walletBalance ?? 0) < totalPrice ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        ₹{(user.walletBalance ?? 0).toLocaleString()}
                      </p>
                    </div>
                    {(user.walletBalance ?? 0) < totalPrice && (
                      <Link href="/dashboard/wallet">
                        <Button variant="outline" size="sm" className="border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl font-bold font-headline">
                          Recharge Wallet
                        </Button>
                      </Link>
                    )}
                  </div>
                  {(user.walletBalance ?? 0) < totalPrice && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-3 font-semibold font-headline">
                      ⚠️ Insufficient balance. You need ₹{(totalPrice - (user.walletBalance ?? 0)).toLocaleString()} more to complete this booking.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Booking Summary */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-sky-900 dark:text-white font-headline">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 dark:text-white font-headline">{service.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-headline mt-0.5">{category?.name}</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-sm font-headline font-semibold text-slate-600 dark:text-slate-350">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Customer Name</span>
                    <span className="text-slate-900 dark:text-slate-150">{fullName || user?.fullName || "User"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Mobile</span>
                    <span className="text-slate-900 dark:text-slate-150">{user?.phoneNumber || "7011365481"}</span>
                  </div>
                  {selectedTankSize && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tank Size</span>
                      <span className="text-slate-900 dark:text-slate-150">{selectedTankSize}</span>
                    </div>
                  )}
                  {selectedTankType && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tank Placement</span>
                      <span className="text-slate-900 dark:text-slate-150">{selectedTankType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service Level</span>
                    <span className="text-slate-900 dark:text-slate-150">{rankLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date</span>
                    <span className="text-slate-900 dark:text-slate-150 font-bold">
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
                    <span className="text-slate-400">Time Window</span>
                    <span className="text-slate-900 dark:text-slate-150">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Mode</span>
                    <span className="text-slate-900 dark:text-slate-150 capitalize">{selectedPaymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-400 flex-shrink-0">Service Address</span>
                    <span className="text-slate-900 dark:text-slate-100 text-right max-w-xs">{selectedAddress}</span>
                  </div>
                  {latitude && longitude && (
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-450">Map Coordinates</span>
                      <span className="font-mono text-slate-700 dark:text-slate-350">
                        {latitude.toFixed(5)}, {longitude.toFixed(5)} ({locationSource})
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-lg font-headline font-black">
                    <span className="text-sky-900 dark:text-white">Total Amount</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DPDP PRIVACY NOTICE & CONSENT BOX */}
            <Card className="bg-[#f0f9ff]/40 dark:bg-sky-950/10 border-2 border-sky-100/50 dark:border-sky-900/40 rounded-2xl overflow-hidden shadow-inner">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-headline font-bold text-sm">
                  <Icons.lock className="w-4 h-4 text-primary" />
                  DPDP Act Privacy &amp; Consent Notice
                </div>
                
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                  Falkon Care collects your name, mobile number, address/location, selected service, booking slot, and service notes only to create and fulfill your booking, provide service updates, support your request, and maintain required records. You can request access, correction, or deletion of your personal data, and you can contact us for privacy or grievance support at the contact details provided in our privacy notice.
                </p>

                <div className="pt-2 space-y-3 font-headline">
                  <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-700 dark:text-slate-300 font-bold select-none">
                    <input
                      type="checkbox"
                      checked={isConsentGiven}
                      onChange={(e) => setIsConsentGiven(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>I consent to the collection and processing of my personal details for booking fulfillment.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-700 dark:text-slate-300 font-bold select-none">
                    <input
                      type="checkbox"
                      checked={isAgeConfirmed}
                      onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>I confirm that I am at least 18 years of age (or have parental/guardian consent).</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="py-6 rounded-xl font-headline font-bold"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleBooking}
                disabled={isBooking || !canProceedStep3() || !!(selectedPaymentMethod === "wallet" && user && user.walletBalance < totalPrice)}
                className="flex-1 py-6 rounded-xl font-headline font-bold text-white bg-primary hover:bg-primary/95 shadow-lg active:scale-95 duration-200 border-0 flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Icons.check className="w-4 h-4" />
                    Confirm &amp; Book
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: BOOKING SUCCESS */}
        {step === 4 && (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 text-center space-y-8 max-w-lg mx-auto animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto shadow-inner text-emerald-600">
              <Icons.checkCircle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-black text-sky-900 dark:text-white">Booking Confirmed!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
                You're all set. We'll see you{" "}
                <span className="font-bold text-sky-900 dark:text-slate-200">
                  {selectedDate && new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                </span>{" "}
                between <span className="font-bold text-sky-900 dark:text-slate-200">{selectedTime}</span>.
              </p>
            </div>

            <Card className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl max-w-xs mx-auto">
              <CardContent className="p-4 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-headline">Booking Reference ID</p>
                <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">#FK-{Date.now().toString().slice(-6)}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <a
                href={`https://wa.me/917011365481?text=Hello%20FalkonCare%2C%20my%20booking%20is%2520confirmed%20for%20${selectedDate}%20at%20${selectedTime}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-headline font-black text-sm transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                <Icons.whatsapp className="w-5 h-5 fill-white" />
                Share Booking Details on WhatsApp
              </a>

              <Button
                variant="outline"
                className="w-full py-6 rounded-xl font-headline font-bold border-slate-200 hover:bg-slate-50 dark:border-slate-800"
                onClick={() => router.push("/dashboard")}
              >
                <Icons.home className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
