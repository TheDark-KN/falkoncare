"use client"

import { useState } from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-background text-white py-16 md:py-28">
      {/* Background visual detail */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-1/4 -right-1/4 w-[50rem] h-[50rem] bg-gradient-to-br from-primary/30 to-teal-500/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-accent/20 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Search */}
          <div className="md:col-span-7 flex flex-col space-y-6 md:space-y-8 text-left">
            
            {/* Trust Indicator / Rating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 w-fit px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs sm:text-sm font-semibold"
            >
              <Icons.star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.8 Rating (10,000+ Bookings in Delhi NCR)</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              Home services, <br />
              <span className="text-primary font-extrabold bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                on demand.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-350 max-w-xl text-slate-300 font-medium leading-relaxed"
            >
              Get certified water tank cleaning, pipe maintenance, and water quality testing professionals right at your doorstep.
            </motion.p>

            {/* Unified Search Widget - styled like Urban Company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 border border-slate-200"
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
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-slate-800 placeholder:text-slate-450 placeholder:text-slate-400"
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
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-350 text-slate-400"
            >
              <span className="font-medium">Suggestions:</span>
              {["Premium", "Basic", "Sump", "Filter", "Water quality"].map((suggest) => (
                <button
                  key={suggest}
                  onClick={() => handleSuggestionClick(suggest)}
                  className="px-3 py-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-full font-semibold text-slate-200 text-xs"
                >
                  {suggest}
                </button>
              ))}
            </motion.div>

          </div>

          {/* Right Column: Category App-Grid */}
          <div className="md:col-span-5 flex flex-col justify-center items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Background gradient accent inside box */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-accent/20 rounded-full blur-2xl" />

              <h3 className="text-center font-bold text-slate-300 text-sm uppercase tracking-wider mb-6 relative z-10">
                Select a Service Category
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10 justify-items-center">
                {serviceCategories.map((category) => {
                  const IconComponent = getServiceIcon(category.icon)
                  const isSelected = selectedCategory === category.id

                  return (
                    <motion.button
                      key={category.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectCategory(category.id)}
                      className={`flex flex-col items-center justify-center w-[110px] h-[110px] rounded-2xl border transition-all duration-300 p-2 text-center relative ${
                        isSelected
                          ? "bg-primary border-primary shadow-lg shadow-primary/30 text-white"
                          : "bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/25 text-slate-200 hover:text-white"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-2 transition-colors ${
                        isSelected ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? "text-white" : "text-primary"}`} />
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2">
                        {category.name}
                      </span>
                    </motion.button>
                  )
                })}

                {/* Reset Filter Button */}
                {selectedCategory && (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onSelectCategory(null)}
                    className="flex flex-col items-center justify-center w-[110px] h-[110px] rounded-2xl border border-dashed border-white/20 bg-transparent text-slate-350 hover:bg-white/5 hover:border-white/40 transition-all p-2 text-center text-slate-400 hover:text-white"
                  >
                    <div className="p-2 rounded-xl bg-white/5 mb-2">
                      <Icons.x className="w-6 h-6 text-slate-450 text-slate-400" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">
                      All Services
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
