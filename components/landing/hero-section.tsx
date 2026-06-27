"use client"

import { useState } from "react"
import Image from "next/image"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import { serviceCategories } from "@/lib/mock-data"
import { getServiceIcon } from "@/components/icons"

interface HeroSectionProps {
  onSelectCategory: (categoryId: string | null) => void
  selectedCategory: string | null
  onSearch: (query: string) => void
  searchQuery: string
}

export function HeroSection({
  onSelectCategory,
  selectedCategory,
  onSearch,
  searchQuery,
}: HeroSectionProps) {
  const [searchInput, setSearchInput] = useState(searchQuery)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchInput(val)
    onSearch(val)
  }

  const handleSuggestionClick = (query: string) => {
    setSearchInput(query)
    onSearch(query)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  }

  return (
    <section className="relative min-h-[750px] lg:min-h-[850px] flex items-center overflow-hidden px-4 sm:px-6 lg:px-12 py-16 md:py-24 bg-surface-container-low" id="hero">
      {/* Background visual detail */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -right-1/4 w-[50rem] h-[50rem] bg-gradient-to-br from-primary/20 to-secondary/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Headline, Description and Search */}
          <div className="space-y-6 sm:space-y-8 text-left">
            
            {/* Trust Indicator / Rating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold tracking-wider uppercase"
            >
              <Icons.shield className="w-3.5 h-3.5" />
              <span>Delhi NCR's Leading Hygiene Partner</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-headline font-extrabold text-on-background leading-[1.1] -tracking-[0.03em]"
            >
              Professional <span className="gradient-text">Water Tank</span> Cleaning Service
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed"
            >
              Pure water starts with a pristine tank. We utilize medical-grade sterilization and 6-stage cleaning to ensure your family's health.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button 
                onClick={() => {
                  const el = document.getElementById("services");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm sm:text-base"
              >
                Book Now
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("pricing");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-8 py-4 rounded-xl font-bold transition-colors text-sm sm:text-base"
              >
                View Packages
              </button>
            </motion.div>

            {/* Unified Search Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2 border border-slate-200"
            >
              {/* Location Picker */}
              <div className="flex items-center gap-2 px-3 py-2.5 sm:border-r border-slate-200 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors shrink-0">
                <Icons.mapPin className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm text-slate-800">Delhi NCR</span>
                <Icons.chevronRight className="w-3.5 h-3.5 rotate-90 text-slate-400 ml-auto sm:ml-0" />
              </div>

              {/* Search Input */}
              <div className="flex-1 flex items-center gap-2 px-2 py-1 relative">
                <Icons.search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  placeholder="Search for tank cleaning, filter, UV..."
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-slate-800 placeholder:text-slate-400"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("")
                      onSearch("")
                    }}
                    className="absolute right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <Icons.x className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Popular Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500"
            >
              <span className="font-medium">Suggestions:</span>
              {["Premium", "Basic", "Sump", "Filter", "Water quality"].map((suggest) => (
                <button
                  key={suggest}
                  onClick={() => handleSuggestionClick(suggest)}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-full font-semibold text-slate-700 text-xs"
                >
                  {suggest}
                </button>
              ))}
            </motion.div>

          </div>

{/* Right Column: Filtration System Mockup Image */}
            <div className="relative w-full">
              <div className="absolute -inset-10 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-50000 max-w-lg mx-auto">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaQ-ftuIguz6W9rf5LIKdI4R-nMvBW22WwLB_vIECtJggsDuf0bPbwBsstBWkY8sx8M9j1L_LI3TDFT97Q6g6_eCOrP9AZJZxumQ0uFPO2K1p-qIiCvCcM_LaoZ4XmJSd-ORb3bQsSTN0hUYjHJIwWInB2eH43GoBCoa5zmH3-2zqJfbhF_wShIQINkpzsThsr8HY0aZBGGtdKNFkdGl9JIOM4sgIB9NwpU4_aKg5QbnLra21CvRN5Wt6JzzPe877kBzq2j_dlW94"
                  alt="FalkonCare water tank cleaning service"
                  width={800}
                  height={600}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZjJmZSIvPjwvc3ZnPg=="
                  className="w-full h-[350px] sm:h-[450px] md:h-[500px] object-cover"
                />
              <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Icons.droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Current Water Purity</p>
                    <p className="text-xl font-bold text-on-background">99.8% Bacteria Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
