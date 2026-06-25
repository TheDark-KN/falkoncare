"use client"

import { motion, type Variants } from "framer-motion"
import { Icons } from "@/components/icons"

const steps = [
  {
    number: "01",
    title: "Book Online",
    description: "Select your tank size and preferred time slot through our seamless dashboard or mobile app.",
    icon: Icons.calendar,
  },
  {
    number: "02",
    title: "Expert Cleaning",
    description: "Our team arrives with high-tech equipment to perform our signature 6-stage sterilization process.",
    icon: Icons.sparkles,
  },
  {
    number: "03",
    title: "Certification",
    description: "Receive a digital hygiene report and a certificate of purity for your records and peace of mind.",
    icon: Icons.checkCircle,
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-surface-container-low overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-headline font-extrabold mb-4">How It Works</h2>
          <p className="text-on-surface-variant text-slate-500">Three simple steps to guaranteed purity</p>
        </div>

        <motion.div
          className="relative flex flex-col md:flex-row gap-12 justify-between"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon
            
            // Stagger layout vertically on desktop for bento effect like in mockup
            const verticalOffsetClass = index === 1 ? "md:mt-12" : index === 2 ? "md:mt-24" : ""

            return (
              <motion.div
                key={step.number}
                className={`relative z-10 flex-1 group ${verticalOffsetClass}`}
                variants={itemVariants}
              >
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors font-headline">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold font-headline text-sky-900">{step.title}</h3>
                </div>
                <div className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <p className="text-on-surface-variant text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
