"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import Image from "next/image"
import { motion, Variants } from "framer-motion"

export function HeroSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      {/* Background blobs with glassmorphism */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl opacity-70" 
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-20 w-[40rem] h-[40rem] bg-gradient-to-bl from-accent/20 to-accent/5 rounded-full blur-3xl opacity-70" 
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* CONTENT */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md border border-primary/20 shadow-sm rounded-full text-primary text-sm font-medium">
              <Icons.falcon className="w-4 h-4" />
              Trusted by 10,000+ Customers
            </motion.div>

            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-balance">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Falkon Care</span>{" "}
              <span className="block text-foreground mt-2">
                Professional Tank Cleaning Service
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Expert water tank cleaning services in Delhi, Noida, Gurgaon,
              Faridabad & Ghaziabad. Certified technicians, hygienic process,
              and affordable pricing.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-14 px-8 text-lg w-full sm:w-auto overflow-hidden group relative"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center">
                    Book Now
                    <Icons.arrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Link href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 backdrop-blur-sm transition-all hover:-translate-y-1 h-14 px-8 text-lg w-full sm:w-auto"
                >
                  View Services
                </Button>
              </Link>
            </motion.div>

            {/* Reviews */}
            <motion.div variants={item} className="flex items-center gap-6 pt-6 border-t border-border/50">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden relative z-[${5-i}]`}>
                     <Image src={`/avatars/0${i}.png`} alt="Customer" width={40} height={40} className="object-cover" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/%3E%3C/svg%3E"; }} />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold relative z-0">
                  500+
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icons.star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-sm font-bold ml-1 text-foreground">4.9/5</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Verified Customer Reviews
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* IMAGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="relative lg:order-last"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/20 bg-muted shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <Image
                src="/water-tank-cleaning-service.jpg"
                alt="Professional Water Tank Cleaning Service"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              
              {/* Premium glass badge overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute bottom-8 left-8 right-8 z-20"
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Icons.shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold flex items-center gap-2">
                        100% Safe & Hygienic
                      </p>
                      <p className="text-white/80 text-sm">Certified Process</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Icons.check className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating availability badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-background rounded-2xl border shadow-xl p-4 flex items-center gap-4 z-30"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Available Now</p>
                <p className="text-sm font-bold">Same-day Service</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

