"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { serviceCategories, serviceItems } from "@/lib/mock-data"
import { getServiceIcon, Icons } from "@/components/icons"
import Link from "next/link"
import { motion, Variants } from "framer-motion"

export function ServicesSection() {
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <section
      id="services"
      className="relative py-20 md:py-32 bg-background overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-accent/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
            <Icons.checkCircle className="w-4 h-4" />
            Our Expertise
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight text-balance">
            Water Tank Cleaning Services <br className="hidden md:block"/> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Delhi NCR</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hygienic, certified, and affordable water tank cleaning for homes,
            societies, offices, and commercial buildings across Delhi, Noida,
            Gurgaon, Faridabad & Ghaziabad.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16"
        >
          {serviceCategories.map((category) => {
            const IconComponent = getServiceIcon(category.icon)
            const categoryServices = serviceItems.filter(
              (s) => s.categoryId === category.id
            )
            const startingPrice = Math.min(
              ...categoryServices.map((s) => s.basePrice)
            )

            return (
              <motion.div key={category.id} variants={item}>
                <Card
                  className="group relative h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-500
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(2,132,199,0.2)] hover:border-primary/50"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[3rem]" />
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10
                      group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary/90 transition-all duration-500 shadow-sm group-hover:shadow-primary/25 group-hover:shadow-lg group-hover:-rotate-3">
                      <IconComponent className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                    </div>

                    <CardTitle className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>

                    <CardDescription className="text-base text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 hidden flex-col flex-1 pb-6 pt-2">
                    {/* Service list */}
                    <div className="space-y-4 flex-1">
                      {categoryServices.slice(0, 3).map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between text-sm group/item"
                        >
                          <span className="text-muted-foreground group-hover/item:text-foreground transition-colors flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                            {service.name}
                          </span>
                          <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors">
                            ₹{service.basePrice.toLocaleString('en-IN')}+
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing */}
                    <div className="mt-8 pt-4 border-t border-border/50 flex flex-col gap-1">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Starting from
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                          ₹{startingPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link href="/auth/login">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-20 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
              <span className="relative flex items-center">
                Book a Service Now
                <Icons.arrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>

          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 text-lg border-primary/20 text-foreground hover:bg-primary/5 hover:text-primary transition-all hover:-translate-y-1"
            >
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
