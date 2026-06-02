"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/dashboard/top-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceCategories, serviceItems } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import type { ServiceItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function ServicesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredServices = selectedCategory
    ? serviceItems.filter((s) => s.categoryId === selectedCategory)
    : serviceItems

  const handleServiceSelect = (service: ServiceItem) => {
    router.push(`/dashboard/services/${service.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Book a Service" />

      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Service Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={cn(
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              All Services
            </Button>
            {serviceCategories.map((category) => {
              const IconComponent = getServiceIcon(category.icon)
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const category = serviceCategories.find((c) => c.id === service.categoryId)
            const IconComponent = getServiceIcon(category?.icon || "droplets")

            return (
              <Card
                key={service.id}
                className="bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden group"
              >
                {service.image && (
                  <div className="h-48 bg-muted relative overflow-hidden">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                      {category?.name}
                    </span>
                  </div>
                  <CardTitle className="text-foreground mt-4">{service.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icons.clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-xl font-bold text-primary flex items-center">
                        <Icons.rupee className="w-4 h-4" />
                        {service.basePrice}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleServiceSelect(service)}
                  >
                    Book Now
                    <Icons.arrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
