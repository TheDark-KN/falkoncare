"use client"

import { motion, type Variants } from "framer-motion"
import { Icons } from "@/components/icons"

const steps = [
  {
    number: "01",
    title: "Choose Service",
    description: "Select from our range of water tank and pipe services",
    icon: Icons.clipboardList,
  },
  {
    number: "02",
    title: "Book a Slot",
    description: "Pick a convenient date and time for the service",
    icon: Icons.calendar,
  },
  {
    number: "03",
    title: "Confirm & Pay",
    description: "Complete booking with secure payment options",
    icon: Icons.creditCard,
  },
  {
    number: "04",
    title: "Service Done",
    description: "Our experts clean your tank professionally",
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
    scale: 0.9
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
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background/80 overflow-hidden relative min-h-[600px]">
      {/* Mobile Background Pattern */}
      <div className="absolute inset-0 opacity-10 lg:opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Fully Responsive */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 lg:mb-6 text-balance bg-gradient-to-r from-foreground via-primary/90 to-primary bg-clip-text text-transparent drop-shadow-lg"
            whileInView={{ scale: [0.95, 1.02, 1], y: [10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Book your water tank cleaning service in just 4 simple steps
          </motion.p>
        </motion.div>

        {/* Steps Container with Flow Lines */}
        <div className="relative">
          {/* Mobile Vertical Flow Lines */}
          <div className="block lg:hidden absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full"
              initial={{ scaleY: 0, opacity: 0 }}
              whileInView={{ scaleY: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />
          </div>

          {/* Steps Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isLast = index === steps.length - 1

              return (
                <motion.div
                  key={step.number}
                  className="relative group flex flex-col items-center lg:items-start"
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Mobile: Vertical Position Indicator */}
                  {!isLast && (
                    <motion.div
                      className="hidden sm:block lg:hidden absolute left-1/2 -translate-x-1/2 w-1.5 h-12 bg-gradient-to-b from-primary/40 to-primary/20 rounded-full mb-4"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    />
                  )}

                  {/* Step Card - Mobile Optimized */}
                  <motion.div
                    className={`
                      w-full max-w-sm mx-auto lg:mx-0 p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl
                      bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-md
                      border border-border/40 hover:border-primary/40
                      shadow-lg hover:shadow-2xl hover:shadow-primary/15
                      transition-all duration-500 group-hover:scale-[1.02]
                      lg:hover:shadow-primary/25
                      ${index === 0 ? 'lg:rounded-r-none lg:pr-4 lg:border-r-0' : ''}
                      ${index === 3 ? 'lg:rounded-l-none lg:pl-4 lg:border-l-0' : ''}
                    `}
                  >
                    {/* Progress Ring & Icon */}
                    <div className="relative flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
                      {/* Rotating Progress Ring */}
                      <motion.div
                        className="absolute w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/4 to-secondary/8 p-2 lg:p-3 opacity-80"
                        animate={{ rotate: "360deg" }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      />

                      {/* Icon Container */}
                      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl bg-gradient-to-br from-background to-muted shadow-xl border-2 border-border/20 group-hover:border-primary/50 transition-all duration-400 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary shadow-md" />
                      </div>

                      {/* Number Badge */}
                      <motion.span
                        className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary-foreground shadow-2xl flex items-center justify-center text-xs sm:text-sm lg:text-base font-black border-4 border-background drop-shadow-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          scale: { type: "spring", stiffness: 500, damping: 20 },
                          rotate: { duration: 0.4 }
                        }}
                      >
                        {step.number}
                      </motion.span>
                    </div>

                    {/* Content */}
                    <div className="text-center lg:text-left space-y-3">
                      <motion.h3
                        className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary/90 transition-all duration-400 mb-2 lg:mb-3 line-clamp-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p
                        className="text-sm lg:text-base text-muted-foreground leading-relaxed line-clamp-2 lg:line-clamp-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                      >
                        {step.description}
                      </motion.p>
                    </div>
                  </motion.div>

                  {/* Desktop Horizontal Connectors */}
                  {!isLast && (
                    <motion.svg
                      className="hidden lg:block absolute top-1/2 -right-4 lg:right-8 w-24 h-20 pointer-events-none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.6 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.15 }}
                    >
                      <motion.path
                        d="M 0 50 Q 30 20 50 50 T 100 50"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="5,5"
                      />
                    </motion.svg>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Mobile Cycle Arrow */}
        <motion.div
          className="block lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-60"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 360 }}
          viewport={{ once: true }}
          transition={{
            scale: { duration: 0.8, type: "spring" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          {/* <Icons.arrowUpRight className="w-10 h-10 text-primary/70 shadow-lg" />
        </motion.div> */}
        </motion.div>
        {/* Desktop Cycle Indicator */}
        <motion.div
          className="hidden lg:block absolute -bottom-12 right-8 opacity-50 pointer-events-none"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Icons.checkCircle className="w-16 h-16 text-primary/60 shadow-2xl drop-shadow-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
