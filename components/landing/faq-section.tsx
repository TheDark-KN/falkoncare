"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { Icons } from "@/components/icons"

const faqs = [
    {
        question: "How often should I clean my water tank?",
        answer:
            "For residential tanks, we recommend professional cleaning every 6 months to ensure water safety and hygiene. Commercial tanks may require more frequent cleaning depending on usage.",
    },
    {
        question: "Is the cleaning process safe for drinking water?",
        answer:
            "Absolutely. We use eco-friendly, food-grade cleaning agents and UV sanitization that effectively kills bacteria without leaving harmful residues.",
    },
    {
        question: "How long does the cleaning process take?",
        answer:
            "A standard overhead tank (1000L - 2000L) typically takes about 60-90 minutes to clean thoroughly. Sump cleaning might take slightly longer.",
    },
    {
        question: "Do you offer emergency cleaning services?",
        answer:
            "Yes, we provide same-day emergency services for urgent situations. Please contact our support team immediately for priority booking.",
    },
    {
        question: "What areas do you cover?",
        answer: "We currently serve the entire metropolitan area and surrounding suburbs. Check our booking page to confirm availability in your specific pincode.",
    },
]

export function FAQSection() {
    return (
        <section id="faq" className="py-20 md:py-32 bg-muted/10 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent blur-3xl transform -translate-y-1/2" />
                <div className="absolute top-1/4 right-0 w-1/4 h-1/3 bg-gradient-to-bl from-accent/5 to-transparent blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-20"
                >
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
                        <Icons.helpCircle className="w-4 h-4" />
                        Common Questions
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6 tracking-tight text-balance">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Questions</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about our water tank cleaning services
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem 
                                key={index} 
                                value={`item-${index}`} 
                                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 sm:px-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20"
                            >
                                <AccordionTrigger className="text-left text-base sm:text-lg font-bold py-6 hover:text-primary transition-colors hover:no-underline [&[data-state=open]]:text-primary group">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                           <span className="text-primary font-bold text-sm">
                                             {String(index + 1).padStart(2, '0')}
                                           </span>
                                        </div>
                                        {faq.question}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2 px-4 sm:px-14 text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
