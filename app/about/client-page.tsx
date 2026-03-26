"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Icons } from "@/components/icons"
import { motion, Variants } from "framer-motion"

export function AboutPageClient() {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pb-24">
        {/* Page Header */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-28">
           <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-l from-primary/10 to-transparent blur-[4rem]" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-accent/10 to-transparent blur-[4rem] rounded-full" />
          </div>

          <div className="container relative mx-auto px-4 z-10">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 0.8, type: "spring" }}
               className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-8 border border-primary/20 backdrop-blur-sm shadow-sm">
                <Icons.falcon className="w-4 h-4" />
                Our Story
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Falkon Care</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Dedicated to providing professional water tank cleaning and maintenance services across Delhi NCR - Your trusted partner for clean and safe water.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Info Section */}
        <div className="container mx-auto px-4">
          <motion.div 
             variants={container}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true, margin: "-100px" }}
             className="max-w-6xl mx-auto mb-20"
          >
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left Column */}
              <div className="space-y-12">
                <motion.div variants={item}>
                  <h2 className="text-3xl font-bold text-foreground mb-6 relative inline-block">
                    Company Overview
                    <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full"></div>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    <strong className="text-foreground">Falkon Care</strong> (Falkon Futurex Private Limited) is Delhi NCR's leading water tank cleaning
                    and maintenance service provider established in 2025. We are committed to ensuring clean, safe, and hygienic
                    water storage for homes and businesses across Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    With a mission to revolutionize water tank maintenance in Delhi NCR, we combine modern technology with expert
                    craftsmanship to deliver exceptional service quality. Trusted by 10,000+ customers, Falkon Care has become
                    the preferred choice for professional water tank cleaning services.
                  </p>
                </motion.div>

                <motion.div variants={item} className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[2rem] group-hover:bg-primary/10 transition-colors duration-500" />
                  
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Icons.building className="w-6 h-6 text-primary" />
                    Company Details
                  </h3>
                  <ul className="space-y-4 text-base relative z-10">
                    <li className="flex items-start gap-4">
                      <span className="font-semibold text-primary min-w-[120px]">Company Name:</span>
                      <span className="text-foreground font-medium">Falkon Futurex Private Limited</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="font-semibold text-primary min-w-[120px]">CIN:</span>
                      <span className="text-muted-foreground">U39000DL2025PTC451909</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="font-semibold text-primary min-w-[120px]">Incorporated:</span>
                      <span className="text-muted-foreground">July 22, 2025</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="font-semibold text-primary min-w-[120px]">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="font-semibold text-primary min-w-[120px]">Location:</span>
                      <span className="text-muted-foreground">South West Delhi, New Delhi, India</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-12">
                <motion.div variants={item}>
                  <h2 className="text-3xl font-bold text-foreground mb-6 relative inline-block">
                    Our Mission
                    <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-accent rounded-full"></div>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed p-6 bg-accent/5 rounded-2xl border border-accent/10">
                    To provide reliable, professional, and affordable water tank cleaning and maintenance services across
                    Delhi NCR that ensure safe, clean water for every household and business. Falkon Care aims to set the
                    highest standards in water tank hygiene and customer satisfaction.
                  </p>
                </motion.div>

                <motion.div variants={item}>
                  <h2 className="text-3xl font-bold text-foreground mb-6 relative inline-block">
                    Our Vision
                    <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary rounded-full"></div>
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    To become the most trusted and preferred water tank cleaning service provider in Delhi NCR and across India,
                    setting industry standards for quality, reliability, and customer satisfaction. Falkon Care envisions a future
                    where every home and business has access to clean, safe water through professional tank maintenance.
                  </p>
                </motion.div>

                <motion.div variants={item} className="grid grid-cols-2 gap-4">
                  {[
                    "Quality & Excellence",
                    "Customer First",
                    "Reliability & Trust",
                    "Environmental Responsibility"
                  ].map((value, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icons.check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{value}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div 
             variants={container}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true, margin: "-100px" }}
             className="max-w-6xl mx-auto"
          >
            <motion.h2 variants={item} className="text-4xl font-bold text-center text-foreground mb-12">
              Why Choose Falkon Care?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Icons.award, title: "Professional Team", desc: "Trained and certified professionals with years of experience in water tank maintenance." },
                { icon: Icons.shield, title: "Quality Assured", desc: "Strict quality control standards to ensure safe and hygienic water storage." },
                { icon: Icons.zap, title: "Quick & Reliable", desc: "Fast scheduling, on-time service delivery, and complete customer satisfaction." }
              ].map((feature, i) => (
                <motion.div key={i} variants={item} className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[2rem] group-hover:bg-primary/20 transition-all duration-500 transform group-hover:scale-150" />
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-primary/20 group-hover:-rotate-3">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
