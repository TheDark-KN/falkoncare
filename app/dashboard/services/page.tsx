"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceCategories, serviceItems } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import type { ServiceItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ServicesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter services by category and search query
  const filteredServices = useMemo(() => {
    return serviceItems.filter((service) => {
      const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const handleServiceSelect = (service: ServiceItem) => {
    router.push(`/dashboard/services/${service.id}`)
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-slate-950 flex flex-col">
      <TopBar title="Book a Service" />

      {/* Main Content Canvas */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 font-headline">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Icons.chevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300">Book New Service</span>
        </nav>

        {/* Page Header & Search Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/40 dark:border-slate-800/40 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-black text-sky-900 dark:text-white tracking-tight">
              Select Your Service
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-base font-medium">
              Choose from our precision hygiene solutions tailored for pure water integrity.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative min-w-[300px]">
            <Icons.search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-sm font-headline focus:ring-2 focus:ring-primary focus:bg-white transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-250 shadow-sm"
              placeholder="Search services..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icons.x className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Category Filter Pills */}
        <section>
          <div className="flex flex-wrap gap-2.5 p-1.5 bg-slate-200/50 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200/30 dark:border-slate-800/30">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-6 py-2.5 rounded-xl font-headline text-sm font-bold transition-all duration-200",
                selectedCategory === null
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              All Services
            </button>
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl font-headline text-sm font-bold transition-all duration-200 flex items-center gap-2",
                  selectedCategory === category.id
                    ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => {
                const category = serviceCategories.find((c) => c.id === service.categoryId)
                const isPremium = service.basePrice >= 800

                return (
                  <div
                    key={service.id}
                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/40 dark:border-slate-800/40 transition-all duration-300 relative h-full"
                  >
                    {/* Service Image Banner */}
                    <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-800/50">
                      {service.image ? (
                        <Image
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          src={service.image}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Icons.droplets className="w-12 h-12" />
                        </div>
                      )}
                      {isPremium && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-[#86f2e4] text-[#006f66] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider font-headline shadow-sm">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <h3 className="text-xl font-headline font-bold text-sky-900 dark:text-white leading-tight">
                          {service.name}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-2xl font-headline font-black text-primary">
                            ₹{service.basePrice}
                          </span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                            Starting At
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1 font-medium">
                        {service.description}
                      </p>

                      {/* Meta Info Row */}
                      <div className="flex items-center gap-6 mb-8 text-xs font-bold text-slate-500 font-headline">
                        <div className="flex items-center gap-1.5">
                          <Icons.clock className="text-primary w-4 h-4" />
                          {service.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icons.checkCircle className="text-primary w-4 h-4" />
                          Certified
                        </div>
                      </div>

                      <Button
                        className="w-full py-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-headline font-bold hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-200 border-0"
                        onClick={() => handleServiceSelect(service)}
                      >
                        Select Service
                        <Icons.arrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-sky-900/5 max-w-lg mx-auto">
              <Icons.search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-headline font-bold text-sky-900 dark:text-white mb-2">No services found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                We couldn't find any services matching "{searchQuery}". Try searching for something else.
              </p>
              <Button 
                variant="outline"
                className="font-headline font-bold rounded-xl"
                onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
