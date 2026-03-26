"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[5rem]" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-white rounded-full blur-[6rem]" 
        />
      </div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-white/20 rounded-2xl shadow-inner border border-white/30 backdrop-blur-xl">
            <Icons.droplets className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-balance tracking-tight">
            Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-teal-100">Clean Water?</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Book your water tank cleaning service today and ensure safe, hygienic water for your family and business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 rounded-xl group"
              >
                Get Started
                <Icons.arrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+919876543210" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 px-8 text-lg border-2 border-white/40 text-white hover:bg-white/10 hover:border-white bg-transparent transition-all hover:-translate-y-1 rounded-xl group"
              >
                <Icons.phone className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Call +91 9876543210
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
