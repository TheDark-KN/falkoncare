"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { motion, Variants } from "framer-motion"

export function CareersPageClient() {
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

  const openings = [
    {
      title: "Field Service Technician",
      department: "Operations",
      type: "Full-time",
      location: "New Delhi",
      description: "Perform professional water tank cleaning and maintenance services.",
    },
    {
      title: "Customer Support Executive",
      department: "Customer Service",
      type: "Full-time",
      location: "New Delhi",
      description: "Handle customer inquiries, bookings, and provide exceptional support.",
    },
    {
      title: "Booking Coordinator",
      department: "Operations",
      type: "Full-time",
      location: "New Delhi",
      description: "Manage customer bookings, scheduling, and coordinate with field teams.",
    },
    {
      title: "Marketing Executive",
      department: "Marketing",
      type: "Full-time",
      location: "New Delhi",
      description: "Develop and execute marketing strategies to promote Falkon services.",
    },
  ]

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
                <Icons.briefcase className="w-4 h-4" />
                Careers at Falkon Care
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight">
                Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Team</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Be part of a growing organization that values excellence, integrity, and customer satisfaction in providing clean and safe water.
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Working Here */}
        <div className="container mx-auto px-4">
          <motion.div 
             variants={container}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true, margin: "-100px" }}
             className="max-w-5xl mx-auto mb-20"
          >
            <motion.div variants={item} className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[3rem] group-hover:bg-accent/10 transition-colors duration-500 transform translate-x-1/2 -translate-y-1/2" />
              
              <h2 className="text-3xl font-bold text-foreground mb-8 relative z-10">Why Work With Falkon?</h2>
              
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                {[
                  { title: "Competitive Salary", desc: "Industry-competitive compensation packages and performance bonuses.", icon: Icons.rupee },
                  { title: "Growth Opportunities", desc: "Clear career development and advancement paths within a growing startup.", icon: Icons.trending },
                  { title: "Training & Development", desc: "Professional training and skill enhancement workshops regularly.", icon: Icons.award },
                  { title: "Team Environment", desc: "Collaborative and supportive workplace with a focus on work-life balance.", icon: Icons.users }
                ].map((perk, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl hover:bg-background/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <perk.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-1">{perk.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Open Positions */}
            <motion.div variants={item} className="mb-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                   <Icons.target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Open Positions</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {openings.map((job, index) => (
                  <motion.div
                    variants={item}
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                        <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground/90 leading-relaxed text-sm">{job.description}</p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-border/50">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Icons.briefcase className="w-4 h-4 text-primary/70" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icons.mapPin className="w-4 h-4 text-primary/70" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground group-hover:shadow-md transition-all font-semibold h-12">
                        Apply Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Application Process */}
            <motion.div variants={item}>
              <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Application Process</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Submit Application", desc: "Apply for a position with your resume and details" },
                  { step: 2, title: "Initial Screening", desc: "Our recruitment team reviews your application thoroughly" },
                  { step: 3, title: "Interview", desc: "Meet with our team for technical and cultural fit interviews" },
                  { step: 4, title: "Offer & Onboarding", desc: "Receive your offer and start your journey with Falkon Care" },
                ].map((item, index) => (
                  <div key={item.step} className="relative p-6 bg-muted/20 rounded-2xl border border-border/50 text-center hover:bg-muted/40 transition-colors">
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent z-0" />
                    )}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-inner border border-primary/20">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-accent rounded-3xl p-8 sm:p-12 text-center text-primary-foreground shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Have Questions?</h2>
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl mx-auto">
                Reach out to our talented HR team to learn more about career paths, benefits, and working at Falkon Care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 shadow-xl">
                  <Icons.mail className="w-5 h-5 mr-2" />
                  careers@falkoncare.com
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white h-14 px-8 font-bold bg-transparent">
                   <Icons.phone className="w-5 h-5 mr-2" />
                   Call HR: +91 98765 43210
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
