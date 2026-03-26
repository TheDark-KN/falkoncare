"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: "1",
    name: "Rahul Mehta",
    location: "Mumbai",
    rating: 5,
    content: "Excellent service! The team was professional and thorough. My tank has never been this clean.",
    image: "/indian-man.png",
    role: "Homeowner",
  },
  {
    id: "2",
    name: "Anita Sharma",
    location: "Delhi",
    rating: 5,
    content: "Very impressed with the quality of work. They arrived on time and completed the job perfectly.",
    image: "/serene-indian-woman.png",
    role: "Apartment Resident",
  },
  {
    id: "3",
    name: "Vikram Patel",
    location: "Bangalore",
    rating: 5,
    content: "Great value for money. The team was courteous and the tank cleaning was done efficiently.",
    image: "/indian-businessman.png",
    role: "Business Owner",
  },
  {
    id: "4",
    name: "Sneha Gupta",
    location: "Noida",
    rating: 5,
    content: "We use Falkon Care for our office building. Highly reliable and always maintain great hygiene standards.",
    image: "/indian-woman.png",
    role: "Facility Manager",
  }
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 relative bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl rounded-full transform -translate-y-1/2" />
        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-gradient-to-b from-accent/10 to-transparent blur-[4rem] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
             <Icons.star className="w-4 h-4 fill-primary" />
             Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 md:mb-6 text-balance tracking-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Customers</span> Say
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Falkon for their water tank cleaning needs
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto px-4 sm:px-12"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8 py-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full pt-6">
                    <Card className="h-full relative bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 group">
                      {/* Quote icon decoration */}
                      <div className="absolute -top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                        <Icons.messageCircle className="w-6 h-6 text-white" />
                      </div>
                      
                      <CardHeader className="flex flex-row items-center gap-4 pb-4 pt-8">
                        <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm group-hover:border-primary/50 transition-colors">
                          <AvatarImage src={`/placeholder-user.jpg`} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-lg">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground/80 font-medium tracking-wide">{testimonial.role}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex mb-4 gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Icons.star
                              key={i}
                              className={`w-4 h-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-muted"
                                } drop-shadow-sm`}
                            />
                          ))}
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed italic relative z-10">
                          "{testimonial.content}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-4 lg:-left-12 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all shadow-md h-12 w-12" />
              <CarouselNext className="-right-4 lg:-right-12 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all shadow-md h-12 w-12" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  )
}
