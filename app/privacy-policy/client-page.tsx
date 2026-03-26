"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { motion, Variants } from "framer-motion"

export function PrivacyPolicyClient() {
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Privacy Policy</h1>
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
            {[
              {
                title: "Introduction",
                content: "Falkon Futurex Private Limited ('we,' 'us,' 'our,' or 'Company') respects the privacy of our users ('you' or 'User'). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services."
              },
            ].map((section, idx) => (
              <motion.section key={idx} variants={item}>
                <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </motion.section>
            ))}

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-6">1. Information We Collect</h2>
              <div className="space-y-6">
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                  <p className="text-muted-foreground text-sm">We collect information you provide directly, including your name, email address, phone number, address, payment information, and service preferences.</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                  <p className="text-muted-foreground text-sm">We automatically collect certain information about your device when you use our services, including browser type, IP address, pages visited, and timestamps.</p>
                </div>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Location Information</h3>
                  <p className="text-muted-foreground text-sm">With your consent, we may collect precise location information to provide and improve our services, particularly for scheduling and service delivery.</p>
                </div>
              </div>
            </motion.section>

            {[
              {
                title: "2. How We Use Your Information",
                content: "We use the information we collect to:",
                list: [
                  "Provide, maintain, and improve our services",
                  "Process your bookings and payments",
                  "Send service-related notifications and updates",
                  "Respond to your inquiries and customer support requests",
                  "Personalize your experience and provide tailored recommendations",
                  "Comply with legal obligations and prevent fraud",
                  "Conduct analytics and improve our platform"
                ]
              },
              {
                title: "3. Data Security",
                content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security."
              },
              {
                title: "4. Sharing of Information",
                content: "We may share your information with:",
                list: [
                  "Our staff members and service providers to deliver services",
                  "Payment processors and financial institutions for transaction processing",
                  "Law enforcement when required by law or court order",
                  "Third-party service providers who assist in our operations"
                ],
                postContent: "We do not sell or rent your personal information to third parties for marketing purposes."
              },
              {
                title: "5. Your Privacy Rights",
                content: "You have the right to:",
                list: [
                  "Access, review, and request copies of your personal information",
                  "Request correction of inaccurate or incomplete information",
                  "Request deletion of your personal information (subject to legal restrictions)",
                  "Opt-out of marketing communications",
                  "Withdraw consent for data processing at any time"
                ]
              },
              {
                title: "6. Cookies and Tracking Technologies",
                content: "We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze site usage. You can control cookie settings through your browser preferences."
              },
              {
                title: "7. Children's Privacy",
                content: "Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will take steps to delete such information."
              },
              {
                title: "9. Changes to This Policy",
                content: "We reserve the right to modify this Privacy Policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after any modifications indicates your acceptance of the updated Privacy Policy."
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
                {section.postContent && (
                  <p className="text-muted-foreground leading-relaxed mt-4">{section.postContent}</p>
                )}
              </motion.section>
            ))}

            <motion.section variants={item}>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-muted-foreground text-sm">
                <p className="font-semibold text-foreground text-lg mb-4">Falkon Futurex Private Limited</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2"><strong>Address:</strong> South West Delhi, New Delhi, India</p>
                    <p><strong>CIN:</strong> U39000DL2025PTC451909</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong>Email:</strong> privacy@falkoncare.com</p>
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
