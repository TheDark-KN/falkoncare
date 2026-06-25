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
import { LocationPicker } from "@/components/booking/location-picker"
import { PaymentMethods } from "@/components/payment/payment-methods"
import type { PaymentMethod, RazorpayResponse } from "@/lib/types"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import Script from "next/script"

export default function ServiceBookingPage() {
  const params = useParams()
  const router = useRouter()
  const { user: clerkUser, isLoaded } = useUser()
  const { isAuthenticated } = useConvexAuth()

  // Use Convex for user data and wallet balance
  const userData = useQuery(api.users.current)
  const user = userData ? {
    clerkId: userData.clerkId,
    email: userData.email,
    fullName: userData.fullName || "",
    walletBalance: userData.walletBalance || 0,
  } : null

  const service = serviceItems.find((s) => s.id === params.serviceId)
  const category = serviceCategories.find((c) => c.id === service?.categoryId)
  const IconComponent = getServiceIcon(category?.icon || "droplets")

  // Form Wizard Steps:
  // 1: Personal Info
  // 2: Identity & Contact
  // 3: Service Details & Scheduling
  // 4: Payment & Review
  // 5: Booking Success
  const [step, setStep] = useState(1)

  // Step 1: Personal Info
  const [fullName, setFullName] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [dob, setDob] = useState("")
  const [age, setAge] = useState("")

  // Step 2: Contact & Identity
  const [mobileNumber, setMobileNumber] = useState("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")

  // Step 3: Service details
  const [selectedTankSize, setSelectedTankSize] = useState<string | null>(null)
  const [selectedTankType, setSelectedTankType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [selectedPincode, setSelectedPincode] = useState<string | undefined>(undefined)
  const [rankLevel, setRankLevel] = useState("Residential (Standard)")
  const [notes, setNotes] = useState("")

  // Step 4: Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("wallet")
  const [isBooking, setIsBooking] = useState(false)

  // Pre-populate fields from profile data
  useEffect(() => {
    if (userData) {
      if (userData.fullName && !fullName) setFullName(userData.fullName)
      if (userData.phoneNumber && !mobileNumber) setMobileNumber(userData.phoneNumber.replace("+91", ""))
      if (userData.address && !selectedAddress) setSelectedAddress(userData.address)
    }
  }, [userData])

  // Calculate age from DOB
  useEffect(() => {
    if (!dob) {
      setAge("")
      return
    }
    const birthDate = new Date(dob)
    if (Number.isNaN(birthDate.getTime())) {
      setAge("")
      return
    }
    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--
    }
    setAge(`${calculatedAge} Years`)
  }, [dob])

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

  // Format Aadhaar formatting (XXXX XXXX XXXX)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "")
    const truncated = rawVal.slice(0, 12)
    const formatted = truncated.match(/.{1,4}/g)?.join(" ") || truncated
    setAadhaarNumber(formatted)
  }

  // Format Mobile
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "")
    setMobileNumber(rawVal.slice(0, 10))
  }

  // Step 1 Validation
  const canProceedStep1 = () => {
    return fullName.trim().length > 1 && fatherName.trim().length > 1 && dob !== ""
  }

  // Step 2 Validation
  const canProceedStep2 = () => {
    const cleanMobile = mobileNumber.replace(/\D/g, "")
    const cleanAadhaar = aadhaarNumber.replace(/\D/g, "")
    return cleanMobile.length === 10 && cleanAadhaar.length === 12
  }

  // Step 3 Validation
  const canProceedStep3 = () => {
    if (service?.tankSizes && !selectedTankSize) return false
    if (service?.tankTypes && !selectedTankType) return false
    return selectedDate !== null && selectedTime !== null && selectedAddress.trim().length > 5
  }

  const createBooking = useMutation(api.bookings.create)

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
          handler: async function (response: RazorpayResponse) {
            try {
              setIsBooking(true)
              await createBooking({
                serviceName: service.name,
                date: new Date(selectedDate!).getTime(),
                time: selectedTime!,
                amount: totalPrice,
                address: selectedAddress,
                tankSize: selectedTankSize || undefined,
                tankType: selectedTankType || undefined,
                paymentMethod: selectedPaymentMethod,
              })
              toast.success("Payment Received! Booking confirmed.")
              setStep(5)
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Booking failed"
              toast.error(`Payment succeeded but booking failed: ${msg}. Please contact support.`)
            } finally {
               setIsBooking(false)
            }
          },
          prefill: {
            name: fullName || user?.fullName || "User",
            email: user?.email || "user@example.com",
            contact: `+91${mobileNumber}`,
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
        address: selectedAddress,
        tankSize: selectedTankSize || undefined,
        tankType: selectedTankType || undefined,
        paymentMethod: selectedPaymentMethod,
      })

      toast.success("Booking confirmed successfully!")
      setStep(5)
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("INSUFFICIENT_WALLET_BALANCE")) {
          toast.error("Insufficient wallet balance. Please recharge your wallet to continue.")
        } else if (error.message.includes("UNAUTHENTICATED")) {
          toast.error("Please log in to book a service.")
        } else {
          toast.error(error.message || "Failed to create booking. Please try again.")
        }
      } else {
        toast.error("Failed to create booking. Please try again.")
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950">
        <TopBar title="Service Not Found" />
        <div className="p-8 text-center max-w-md mx-auto mt-20">
          <Icons.alertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-500 font-headline font-semibold">The requested service does not exist.</p>
          <Button className="mt-6 rounded-xl font-headline font-bold" onClick={() => router.push("/dashboard/services")}>
            Browse Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <TopBar title="Service Booking" />

      <div className="pt-8 pb-16 px-6 max-w-3xl mx-auto space-y-8">
        
        {/* Progress Stepper */}
        {step < 5 && (
          <div className="mb-10 relative bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5">
            <div className="flex justify-between items-center mb-4 font-headline">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step {step} of 4</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {step === 1 ? "Personal Info" : step === 2 ? "Identity Verification" : step === 3 ? "Service Configuration" : "Payment & Review"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[10px] font-bold transition-all",
                  step > 1 ? "bg-primary text-white" : step === 1 ? "bg-primary/10 text-primary ring-4 ring-primary/10" : "bg-slate-100 text-slate-400"
                )}>
                  {step > 1 ? <Icons.check className="w-3 h-3" /> : "1"}
                </div>
                <span className={cn("text-[9px] font-bold font-headline", step >= 1 ? "text-primary" : "text-slate-400")}>Personal</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[10px] font-bold transition-all",
                  step > 2 ? "bg-primary text-white" : step === 2 ? "bg-primary/10 text-primary ring-4 ring-primary/10" : "bg-slate-100 text-slate-400"
                )}>
                  {step > 2 ? <Icons.check className="w-3 h-3" /> : "2"}
                </div>
                <span className={cn("text-[9px] font-bold font-headline", step >= 2 ? "text-primary" : "text-slate-400")}>Identity</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[10px] font-bold transition-all",
                  step > 3 ? "bg-primary text-white" : step === 3 ? "bg-primary/10 text-primary ring-4 ring-primary/10" : "bg-slate-100 text-slate-400"
                )}>
                  {step > 3 ? <Icons.check className="w-3 h-3" /> : "3"}
                </div>
                <span className={cn("text-[9px] font-bold font-headline", step >= 3 ? "text-primary" : "text-slate-400")}>Service</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center mb-1 text-[10px] font-bold transition-all",
                  step === 4 ? "bg-primary/10 text-primary ring-4 ring-primary/10" : "bg-slate-100 text-slate-400"
                )}>
                  "4"
                </div>
                <span className={cn("text-[9px] font-bold font-headline", step === 4 ? "text-primary" : "text-slate-400")}>Review</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Icons.user className="w-5 h-5 text-primary" />
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Personal Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Full Name</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-headline text-slate-850 dark:text-slate-200"
                  placeholder="Enter full name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Father's Name</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-headline text-slate-850 dark:text-slate-200"
                  placeholder="Enter father's name"
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Date of Birth</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-headline text-slate-850 dark:text-slate-200"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 opacity-80">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Age (Auto-calculated)</label>
                <input
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed font-headline"
                  readOnly
                  type="text"
                  value={age || "Select DOB"}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                className="w-full py-6 rounded-xl font-headline font-bold text-white shadow-lg shadow-primary/20 active:scale-95 duration-200 border-0"
                disabled={!canProceedStep1()}
                onClick={() => setStep(2)}
              >
                Continue to Identity
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 2: IDENTITY & CONTACT */}
        {step === 2 && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Icons.shield className="w-5 h-5 text-primary" />
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">Contact &amp; Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold font-headline">+91</span>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-headline text-slate-850 dark:text-slate-200"
                    placeholder="10-digit number"
                    type="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-headline">Aadhaar Number</label>
                <input
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all font-headline text-slate-850 dark:text-slate-200"
                  placeholder="XXXX XXXX XXXX"
                  type="text"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                />
                {aadhaarNumber.replace(/\s/g, "").length === 12 && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1.5 font-headline">
                    <Icons.checkCircle className="w-3.5 h-3.5" /> Verified with UIDAI
                  </p>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex gap-4">
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
                Continue to Service Setup
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
        )}

        {/* STEP 3: SERVICE CONFIGURATION */}
        {step === 3 && (
          <div className="space-y-6">
            
            {/* Service & Options Selection */}
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
                            "p-4 rounded-xl border-2 text-center transition-all",
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
                            "p-4 rounded-xl border-2 text-left transition-all",
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
                          "p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1",
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

            {/* Location Address Area */}
            <LocationPicker
              onLocationSelect={(address, pincode) => {
                setSelectedAddress(address)
                setSelectedPincode(pincode)
              }}
              initialAddress={selectedAddress}
            />

            {/* Rank / Level selection */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-headline">Rank / Level</h4>
                <select
                  value={rankLevel}
                  onChange={(e) => setRankLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-semibold font-headline focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
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
                  placeholder="Any special instructions, access notes, or landmark details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 rounded-xl font-headline"
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
                variant="outline"
                className="py-6 rounded-xl font-headline font-bold"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                className="flex-1 py-6 rounded-xl font-headline font-bold text-white shadow-lg shadow-primary/20 active:scale-95 duration-200 border-0"
                disabled={!canProceedStep3()}
                onClick={() => setStep(4)}
              >
                Review &amp; Pay
                <Icons.arrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </div>
        )}

        {/* STEP 4: REVIEW & PAY */}
        {step === 4 && (
          <div className="space-y-8">
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
                        user.walletBalance < totalPrice ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                        ₹{user.walletBalance.toLocaleString()}
                      </p>
                    </div>
                    {user.walletBalance < totalPrice && (
                      <Link href="/dashboard/wallet">
                        <Button variant="outline" size="sm" className="border-rose-500 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-xl font-bold font-headline">
                          Recharge Wallet
                        </Button>
                      </Link>
                    )}
                  </div>
                  {user.walletBalance < totalPrice && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-3 font-semibold font-headline">
                      ⚠️ Insufficient balance. You need ₹{(totalPrice - user.walletBalance).toLocaleString()} more to complete this booking.
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
                    <span className="text-slate-900 dark:text-slate-150">{fullName}</span>
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
                    <span className="text-slate-900 dark:text-slate-150">
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
                    <span className="text-slate-950 dark:text-slate-100 text-right max-w-xs">{selectedAddress}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-lg font-headline font-black">
                    <span className="text-sky-900 dark:text-white">Total Amount</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="py-6 rounded-xl font-headline font-bold"
                onClick={() => setStep(3)}
              >
                Back
              </Button>
              <Button
                size="lg"
                onClick={handleBooking}
                disabled={isBooking || !!(selectedPaymentMethod === "wallet" && user && user.walletBalance < totalPrice)}
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

        {/* STEP 5: BOOKING SUCCESS */}
        {step === 5 && (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 text-center space-y-8 max-w-lg mx-auto">
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
                href={`https://wa.me/919876543210?text=Hello%20FalkonCare%2C%20my%20booking%20is%20confirmed%20for%20${selectedDate}%20at%20${selectedTime}`}
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
