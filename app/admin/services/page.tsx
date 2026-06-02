"use client"

import { AdminTopBar } from "@/components/admin/admin-top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceCategories, serviceItems } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"

export default function AdminServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopBar title="Service Management" />

      <div className="p-6">
        {/* Categories Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {serviceCategories.map((category) => {
            const IconComponent = getServiceIcon(category.icon)
            const categoryServices = serviceItems.filter((s) => s.categoryId === category.id)

            return (
              <Card key={category.id} className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{categoryServices.length} services</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Services List */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">All Services</CardTitle>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Icons.plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Base Price</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tank Sizes</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceItems.map((service) => {
                    const category = serviceCategories.find((c) => c.id === service.categoryId)

                    return (
                      <tr key={service.id} className="border-b border-border last:border-0">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{category?.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-foreground flex items-center">
                            <Icons.rupee className="w-3 h-3" />
                            {service.basePrice}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{service.duration}</span>
                        </td>
                        <td className="p-4">
                          {service.tankSizes ? (
                            <div className="flex flex-wrap gap-1">
                              {service.tankSizes.map((size: { size: string; priceMultiplier: number }) => (
                                <span
                                  key={size.size}
                                  className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground"
                                >
                                  {size.size}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Icons.settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
