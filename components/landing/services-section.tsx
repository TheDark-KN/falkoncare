"use client"

import { serviceCategories, serviceItems } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ServicesSectionProps {
  selectedCategory: string | null
  setSelectedCategory: (categoryId: string | null) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const getInclusions = (serviceId: string) => {
  switch (serviceId) {
    case "tank-cleaning-basic":
      return [
        "Mechanical scrubbing & high-pressure washing",
        "Sludge removal & vacuuming",
        "Eco-friendly anti-bacterial treatment"
      ]
    case "tank-cleaning-premium":
      return [
        "Everything in Basic cleaning plus:",
        "Advanced UV radiation disinfection",
        "Full tank sanitization & water testing"
      ]
    case "tank-repair":
      return [
        "Crack sealing & leakage detection",
        "Epoxy coating for chemical resistance",
        "Inlet/outlet pipe joint sealing"
      ]
    case "pipe-cleaning":
      return [
        "High-pressure jet pipe cleaning",
        "Descaling & chemical-free residue clearing",
        "Flow pressure checking & validation"
      ]
    case "pipe-replacement":
      return [
        "Heavy-duty corrosion-free pipe installation",
        "Complete pressure testing for leaks",
        "Old line removal & site cleanup"
      ]
    case "filter-installation":
      return [
        "Brand-independent RO/UV filter installation",
        "TDS testing before & after setup",
        "Leak validation & pressure setup"
      ]
    case "filter-service":
      return [
        "Filter sediment cartridge replacement",
        "Membrane flushing & health check",
        "Complete sanitation of filter chamber"
      ]
    case "water-testing":
      return [
        "12+ physical & chemical parameter analysis",
        "pH level, TDS, and hardness checking",
        "Laboratory certified digital report"
      ]
    case "motor-service":
      return [
        "Winding check & electrical validation",
        "Pump impeller cleaning & lubrication",
        "Coupling check & dry-run validation"
      ]
    default:
      return [
        "Background-verified professional",
        "Eco-friendly materials used",
        "100% satisfaction guaranteed"
      ]
  }
}

export function ServicesSection({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: ServicesSectionProps) {
  
  // Filter Logic
  const filteredServices = serviceItems.filter((service) => {
    const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true
    const matchesSearch = searchQuery
      ? service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  }

  return (
    <section
      id="services"
      className="relative py-20 bg-surface-container-low overflow-hidden border-t border-slate-200/50"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Bento Grid Features - Mockup "Features Section" */}
        <div className="mb-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold mb-4">Unmatched Standards</h2>
            <p className="text-on-surface-variant max-w-2xl text-slate-500">We don't just clean; we restore your water systems to factory-fresh hygiene levels using precision technology.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 lg:row-span-2 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-6">
                  <Icons.activity className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">100% Hygienic 6-Stage Process</h3>
                <p className="text-on-surface-variant text-slate-500 leading-relaxed">Our proprietary 6-stage process includes sludge removal, high-pressure washing, vacuuming, and UV sterilization to kill 99.9% of pathogens.</p>
              </div>
              <img 
                alt="Sterile cleaning equipment" 
                className="mt-8 rounded-xl h-48 w-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAk-wzDwQ_KDHxdlLbUtAIbi5KYUKqUWHCd70Mhr9FMsjMmDEzq6hnhfrp3W-LaoHgPJYfLIyUBW0TEHAQYY87LJOCs0Eojp3kliano7D8Z1GVDfV2Ze9g5NDc7Hmb5XDzUVw1Ii8lYJ09y1mBame9Gk0kNkxnZashg5Axy8l1NqROwLYd5TJshVM8-xo1doiWZ92npCAST4xtIGNsqFP3fUoJAgIeFrT_yy4bmiAYTMpuaMUoiuL1rGDCuygG70Ll8fansjcNysA"
              />
            </div>
            <div className="bg-primary-container/5 p-8 rounded-2xl flex flex-col gap-4 border border-slate-100/50">
              <Icons.userCog className="text-primary w-10 h-10" />
              <h4 className="text-xl font-bold font-headline">Certified Technicians</h4>
              <p className="text-sm text-slate-500">Every Falkon professional is background-checked and specialized in water hygiene protocols.</p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col gap-4 border border-slate-100/50">
              <Icons.clock className="text-secondary w-10 h-10" />
              <h4 className="text-xl font-bold font-headline">Same-Day Service</h4>
              <p className="text-sm text-slate-500">Book before 10 AM for same-day cleaning across the entire Delhi NCR region.</p>
            </div>
            <div className="md:col-span-2 bg-[#1e293b] text-white p-8 rounded-2xl flex items-center gap-8 shadow-md">
              <div className="flex-1">
                <h4 className="text-xl font-bold font-headline mb-2">Eco-Friendly Cleaning</h4>
                <p className="text-sm text-slate-300 opacity-80 leading-relaxed">We use biodegradable, food-grade cleaning agents that leave zero chemical residue in your water supply.</p>
              </div>
              <Icons.sparkles className="w-12 h-12 text-[#2dd4bf] shrink-0" />
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-sky-900 tracking-tight">
            Our Standardized Services
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Simple, upfront, and transparent pricing. No negotiations, no hidden charges.
          </p>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-slate-200/50 font-headline">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-5 py-2 text-xs font-bold shrink-0 transition-all ${
              selectedCategory === null
                ? "bg-primary text-white shadow-md"
                : "border-slate-200 text-slate-500 hover:text-primary bg-white"
            }`}
          >
            All Services
          </Button>
          {serviceCategories.map((category) => {
            const IconComponent = getServiceIcon(category.icon)
            const isSelected = selectedCategory === category.id

            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-5 py-2 text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-primary text-white shadow-md"
                    : "border-slate-200 text-slate-500 hover:text-primary bg-white"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || searchQuery) && (
          <div className="flex items-center gap-2 mb-8 flex-wrap text-sm font-semibold">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-700 text-xs">
                Category: {serviceCategories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500 ml-1">
                  <Icons.x className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-700 text-xs">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-red-500 ml-1">
                  <Icons.x className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Services Menu List */}
        {filteredServices.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2"
          >
            {filteredServices.map((service) => {
              const category = serviceCategories.find((c) => c.id === service.categoryId)
              const inclusions = getInclusions(service.id)

              return (
                <motion.div key={service.id} variants={item}>
                  <div className="bg-surface-container-lowest border border-slate-100 hover:border-primary/20 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex gap-6 items-start group relative">
                    
                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[140px]">
                      <div>
                        {/* Rating Badging */}
                        <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold text-amber-500">
                          <Icons.star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>4.8 (2.5k+ reviews)</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold font-headline text-sky-900 leading-snug group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>

                        {/* Price & Duration */}
                        <div className="flex items-center gap-3 mt-2 text-sm font-headline">
                          <span className="font-extrabold text-sky-900 flex items-center text-base">
                            <Icons.rupee className="w-3.5 h-3.5" />
                            {service.basePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 flex items-center gap-1 text-xs font-semibold">
                            <Icons.clock className="w-3.5 h-3.5 text-slate-400" />
                            {service.duration}
                          </span>
                        </div>

                        {/* Inclusions List */}
                        <ul className="mt-4 space-y-2 border-t border-dashed border-slate-200/50 pt-3">
                          {inclusions.map((inc, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                              <Icons.checkCircle className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Image & Floating Add Button */}
                    <div className="relative flex flex-col items-center justify-center shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-inner bg-muted border border-slate-200/20">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                            <Icons.droplets className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      
                      {/* Floating Add Button Overlay */}
                      <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2">
                        <Link href={`/dashboard/services/${service.id}`}>
                          <Button
                            className="bg-surface-container-high hover:bg-primary hover:text-white text-on-surface border border-slate-200 shadow-md font-bold text-xs px-5 py-1.5 h-auto rounded-xl uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            Add
                          </Button>
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl max-w-md mx-auto">
            <Icons.search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-1 text-base">No services found</h4>
            <p className="text-xs text-slate-500 px-4">
              We couldn't find any services matching your criteria. Try adjusting your search query or filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery("")
              }}
              className="mt-4 text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
