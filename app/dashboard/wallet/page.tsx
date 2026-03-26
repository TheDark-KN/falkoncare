"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import Script from "next/script"
import { motion } from "framer-motion"

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function WalletPage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const balance = useQuery(api.wallet.getBalance)
  const addBalance = useMutation(api.wallet.addBalance)

  const handleTopUp = async () => {
    const numAmount = parseInt(amount)
    if (isNaN(numAmount) || numAmount < 100) {
      toast.error("Please enter a valid amount (minimum ₹100)")
      return
    }

    setIsLoading(true)
    
    try {
      // 1. Create order on our Next.js backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount }),
      })
      
      const order = await res.json()
      
      if (!res.ok) throw new Error(order.error || "Failed to create order")

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Falkon Care",
        description: "Wallet Top Up",
        image: "/icon.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Inform Convex backend to verify & update user balance
            await addBalance({
              amount: numAmount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
            toast.success(`Successfully added ₹${numAmount} to your wallet!`)
            setAmount("")
          } catch (err) {
            console.error(err)
            toast.error("Payment processed, but wallet update failed. Please contact support.")
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#519CAB",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment transfer failed.")
      });
      rzp.open();
      
    } catch (err) {
      console.error(err)
      toast.error("Failed to initialize payment gateway.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Falkon Wallet</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Wallet Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl p-8 bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 shadow-[0_8px_40px_-12px_rgba(81,156,171,0.3)] relative overflow-hidden"
        >
          {/* Subtle Glow inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Icons.wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground/80">Current Balance</h3>
          </div>
          
          <div className="space-y-2">
             <div className="text-5xl font-bold flex items-center gap-2 text-foreground">
               <span className="text-primary">₹</span>
               {balance !== undefined ? balance.toLocaleString() : "..."}
             </div>
             <p className="text-sm text-muted-foreground flex items-center gap-1">
               <Icons.checkCircle className="w-4 h-4 text-green-500" />
               Available for your next booking
             </p>
          </div>
        </motion.div>

        {/* Top Up Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-3xl p-8 bg-background/50 border border-white/10 dark:border-white/5 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6">Top Up Wallet</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Enter Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                <Input 
                  type="number"
                  placeholder="1000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-12 rounded-xl border-border/50 bg-background focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 2000].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  onClick={() => setAmount(preset.toString())}
                  className="rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground h-12"
                >
                  ₹{preset}
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleTopUp} 
              disabled={isLoading || !amount || parseInt(amount) < 100}
              className="w-full h-14 rounded-xl text-lg relative overflow-hidden group shadow-[0_8px_30px_rgba(81,156,171,0.3)] bg-primary text-primary-foreground hover:-translate-y-1 transition-transform"
            >
              {isLoading ? (
                <Icons.loader className="w-5 h-5 animate-spin mx-auto text-primary-foreground" />
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Icons.rupee className="w-5 h-5" /> Add Money Securely
                </span>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Icons.shield className="w-4 h-4" /> SECURED BY RAZORPAY
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
