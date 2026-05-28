"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export function HomeClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    // Smooth scroll to services section
    const el = document.getElementById("services")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      // Smooth scroll to services section
      const el = document.getElementById("services")
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection 
          onSelectCategory={handleSelectCategory} 
          selectedCategory={selectedCategory}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <ServicesSection 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <HowItWorks />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
