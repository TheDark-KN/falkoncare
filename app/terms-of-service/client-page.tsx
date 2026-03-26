"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion, Variants } from "framer-motion"

export function TermsOfServiceClient() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Terms of Service</h1>
            <div className="inline-block bg-muted/50 rounded-full px-4 py-1 border border-border">
               <p className="text-sm text-muted-foreground font-medium">Last Updated: January 2025 | Falkon Futurex Private Limited</p>
            </div>
          </motion.div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="max-w-3xl mx-auto space-y-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm"
          >
            {/* Sections mapped for animation */}
            {[
              {
                title: "1. Agreement to Terms",
                content: "By accessing and using this website and services provided by Falkon Futurex Private Limited, you accept and agree to be bound by and comply with these Terms of Service. If you do not agree to abide by the above, please do not use this service."
              },
              {
                title: "2. Use License",
                content: "Permission is granted to temporarily download one copy of the materials (information or software) on Falkon's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
                list: [
                  "Modifying or copying the materials",
                  "Using the materials for any commercial purpose or for any public display",
                  "Attempting to decompile or reverse engineer any software contained on the website",
                  "Removing any copyright or other proprietary notations from the materials",
                  "Transferring the materials to another person or 'mirroring' the materials on any other server"
                ]
              },
              {
                title: "3. Disclaimer",
                content: "The materials on Falkon's website are provided 'as is'. Falkon makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
              },
              {
                title: "4. Limitations of Liability",
                content: "In no event shall Falkon Futurex Private Limited or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Falkon's website, even if Falkon or an authorized representative has been notified orally or in writing of the possibility of such damage."
              },
              {
                title: "5. Accuracy of Materials",
                content: "The materials appearing on Falkon's website could include technical, typographical, or photographic errors. Falkon does not warrant that any of the materials on its website are accurate, complete, or current. Falkon may make changes to the materials contained on its website at any time without notice."
              },
              {
                 title: "6. Links and Third Party Materials",
                 content: "Falkon has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Falkon of the site. Use of any such linked website is at the user's own risk."
              },
              {
                 title: "7. Modifications to Terms",
                 content: "Falkon may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
              },
              {
                 title: "8. Governing Law",
                 content: "These terms and conditions are governed by and construed in accordance with the laws of the Republic of India, and you irrevocably submit to the exclusive jurisdiction of the courts in New Delhi."
              }
            ].map((section, idx) => (
              <motion.section key={idx} variants={item}>
                <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                {section.list && (
                  <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground ml-4">
                    {section.list.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-6">9. Service Booking Terms</h2>
              <div className="grid sm:grid-cols-2 gap-6 text-muted-foreground">
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Booking Confirmation</h3>
                  <p className="text-sm">All bookings are subject to availability and confirmation by Falkon. A confirmation will be sent via email or SMS.</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Cancellation Policy</h3>
                  <p className="text-sm">Customers may cancel bookings up to 24 hours before the scheduled service date. Cancellations made within 24 hours may incur a fee.</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Rescheduling</h3>
                  <p className="text-sm">Customers can reschedule free of charge if done at least 48 hours in advance through our platform.</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Payment Terms</h3>
                  <p className="text-sm">Payment must be made as per the selected payment method at the time of booking or upon service completion.</p>
                </div>
              </div>
            </motion.section>

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-muted-foreground text-sm">
                <p className="font-semibold text-foreground text-lg mb-4">Falkon Futurex Private Limited</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2"><strong>Address:</strong> South West Delhi, New Delhi, India</p>
                    <p><strong>CIN:</strong> U39000DL2025PTC451909</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Email:</strong> legal@falkoncare.com</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                  </div>
                </div>
              </div>
            </motion.section>

          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
