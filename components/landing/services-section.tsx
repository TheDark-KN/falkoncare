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
      className="relative py-20 bg-background overflow-hidden border-t border-border/40"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Our Standardized Services
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm sm:text-base">
            Simple, upfront, and transparent pricing. No negotiations, no hidden charges.
          </p>
        </div>

        {/* Categories Horizontal Tabs (Styled like Urban Company Category pills) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none border-b border-border/30">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-5 py-2 text-xs font-bold shrink-0 transition-all ${
              selectedCategory === null
                ? "bg-foreground text-background shadow-md"
                : "border-border hover:border-slate-400 text-muted-foreground hover:text-foreground"
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
                    ? "bg-foreground text-background shadow-md"
                    : "border-border hover:border-slate-400 text-muted-foreground hover:text-foreground"
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
            <span className="text-muted-foreground font-medium">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-foreground text-xs">
                Category: {serviceCategories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500 ml-1">
                  <Icons.x className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-foreground text-xs">
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
                  <div className="bg-card border border-border/50 hover:border-primary/45 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-350 flex gap-6 items-start group relative">
                    
                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col justify-between h-full min-h-[140px]">
                      <div>
                        {/* Rating Badging */}
                        <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold text-amber-500">
                          <Icons.star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>4.8 (2.5k+ reviews)</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>

                        {/* Price & Duration */}
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="font-extrabold text-foreground flex items-center text-base">
                            <Icons.rupee className="w-3.5 h-3.5" />
                            {service.basePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                            <Icons.clock className="w-3.5 h-3.5 text-slate-400" />
                            {service.duration}
                          </span>
                        </div>

                        {/* Inclusions List - Styled like Urban Company details */}
                        <ul className="mt-4 space-y-2 border-t border-dashed border-border/60 pt-3">
                          {inclusions.map((inc, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                              <Icons.checkCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Image & Floating Add Button */}
                    <div className="relative flex flex-col items-center justify-center shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-inner bg-muted border border-border/20">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Icons.droplets className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      
                      {/* Floating Add Button Overlay (Exactly like Urban Company) */}
                      <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2">
                        <Link href={`/dashboard/services/${service.id}`}>
                          <Button
                            className="bg-white hover:bg-slate-50 text-primary border border-primary/20 shadow-md font-bold text-xs px-5 py-1.5 h-auto rounded-lg uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
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
          <div className="text-center py-16 bg-muted/20 border border-dashed border-border/60 rounded-3xl max-w-md mx-auto">
            <Icons.search className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-1 text-base">No services found</h4>
            <p className="text-xs text-muted-foreground px-4">
              We couldn't find any services matching your criteria. Try adjusting your search query or filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery("")
              }}
              className="mt-4 text-xs font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
