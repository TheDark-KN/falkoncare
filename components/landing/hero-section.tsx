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
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
  }

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      
      {/* Background Gradients (Smooth Water Fluid Motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0">
        <motion.div 
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.1, 0.9, 1], rotate: [0, 45, -45, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 md:top-20 left-10 md:left-20 w-[40rem] lg:w-[60rem] h-[30rem] lg:h-[40rem] bg-gradient-to-r from-cyan-400/20 via-primary/30 to-blue-400/20 mix-blend-multiply rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[100px] md:blur-[140px] opacity-80" 
        />
        <motion.div 
          animate={{ x: [0, -60, 40, 0], y: [0, 60, -40, 0], scale: [0.9, 1.2, 1, 0.9], rotate: [0, -30, 30, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 md:-bottom-20 right-10 md:-right-20 w-[30rem] lg:w-[50rem] h-[25rem] lg:h-[35rem] bg-gradient-to-r from-secondary/40 via-teal-300/20 to-primary/20 mix-blend-multiply rounded-[60%_40%_30%_70%/50%_60%_40%_50%] blur-[100px] md:blur-[140px] opacity-80" 
        />
      </div>

      {/* Floating Elements (Like the coins in the design) */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[15%] w-16 h-16 liquid-glass rounded-2xl flex items-center justify-center bg-white/60 dark:bg-white/10 shadow-2xl border border-white/40">
           <Icons.droplets className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[40%] right-[15%] w-20 h-20 liquid-glass rounded-[2rem] flex items-center justify-center bg-white/60 dark:bg-white/10 shadow-2xl border border-white/40">
           <Icons.shield className="w-10 h-10 text-accent" />
        </motion.div>
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[30%] left-[20%] w-14 h-14 liquid-glass rounded-xl flex items-center justify-center bg-white/60 dark:bg-white/10 shadow-lg border border-white/40">
           <Icons.checkCircle className="w-7 h-7 text-green-500" />
        </motion.div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 z-20 flex flex-col items-center text-center">
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center max-w-4xl mx-auto space-y-8"
        >
          {/* Top Pill */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-sm rounded-full text-foreground/80 text-sm font-semibold">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-1">
               <img src="/icon.png" alt="Logo" className="w-4 h-4 object-contain" />
            </div>
            Falkon Care Services
          </motion.div>

          <motion.h1 variants={item} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-balance text-foreground">
            Unlock the Power of <br className="hidden md:block"/> Clean, Safe Water
          </motion.h1>

          <motion.p variants={item} className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Invest in professional tank cleaning services and manage your family's health safely and easily with certified experts.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background shadow-xl hover:shadow-2xl transition-all hover:scale-105 h-14 px-10 text-lg rounded-full w-full sm:w-auto"
              >
                Join Falkon Care
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Sleek Trust Indicators (Suits the site much better than a grey mockup box) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
          className="w-full max-w-4xl mx-auto mt-16 pb-12 relative flex justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-12 liquid-glass rounded-full border border-white/50 dark:border-white/10 shadow-xl px-8 py-5 bg-white/40 dark:bg-black/20 backdrop-blur-xl">
            
            <div className="flex items-center gap-3">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="flex flex-col text-left ml-2">
                  <div className="flex items-center text-amber-500">
                     <Icons.star className="w-4 h-4 fill-amber-500" />
                     <Icons.star className="w-4 h-4 fill-amber-500" />
                     <Icons.star className="w-4 h-4 fill-amber-500" />
                     <Icons.star className="w-4 h-4 fill-amber-500" />
                     <Icons.star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Trusted by 10,000+ Users</p>
               </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-foreground/10" />

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                     <Icons.checkCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col text-left">
                     <p className="text-sm font-bold text-foreground">Certified Experts</p>
                     <p className="text-xs text-muted-foreground">100% Guaranteed</p>
                  </div>
               </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}
