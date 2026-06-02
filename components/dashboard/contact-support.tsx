"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

function validateContactForm(data: FormData): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Full name is required'
  if (!data.email.trim()) errors.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email'
  if (!data.subject.trim()) errors.subject = 'Subject is required'
  if (!data.message.trim()) errors.message = 'Message is required'
  else if (data.message.trim().length < 20) errors.message = 'Message must be at least 20 characters'
  return { isValid: Object.keys(errors).length === 0, errors }
}

const supportOptions = [
  { id: 1, title: 'Booking Assistance', description: 'Need help with your booking?', icon: '📅', contact: 'bookings@falkoncare.com' },
  { id: 2, title: 'Technical Support', description: 'Issues with the website or app?', icon: '💻', contact: 'techsupport@falkoncare.com' },
  { id: 3, title: 'Billing Inquiry', description: 'Questions about your bill or payment?', icon: '💳', contact: 'billing@falkoncare.com' },
  { id: 4, title: 'Complaints & Feedback', description: 'Share your feedback or raise concerns.', icon: '📝', contact: 'feedback@falkoncare.com' },
]

const faqs = [
  { question: 'How long does the service take?', answer: 'Standard tank cleaning takes 1–3 hours depending on size and type.' },
  { question: 'Can I reschedule my booking?', answer: 'You can reschedule up to 2 hours before the scheduled time via your account.' },
  { question: 'How is the water quality assured?', answer: 'All tanks are cleaned with certified anti-bacterial solutions and UV treatment.' },
  { question: 'Can I get a refund?', answer: 'Yes, we offer a 100% satisfaction guarantee. Contact us within 24 hours of service.' },
]

const ContactSupport = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { isValid, errors: validationErrors } = validateContactForm(formData)
    setErrors(validationErrors)
    if (!isValid) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitSuccess(false), 5000)
    }, 1500)
  }

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-foreground mb-2">Contact & Support</h2>
        <p className="text-muted-foreground text-center mb-12">We're here to help you with any questions or concerns</p>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 text-sm">
                  <Icons.checkCircle className="w-4 h-4 inline mr-2" />
                  Thank you! Our team will respond within 24 hours.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="bg-background border-input" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="bg-background border-input" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="subject" className="text-foreground">Subject *</Label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this regarding?" className="bg-background border-input" />
                  {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="message" className="text-foreground">Message *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Describe your issue or inquiry (min. 20 characters)" rows={5} className="bg-background border-input" />
                  {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting ? <><Icons.loader className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Support Options */}
          <div className="space-y-4">
            {supportOptions.map(option => (
              <Card key={option.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-start gap-4">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{option.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{option.description}</p>
                    <a href={`mailto:${option.contact}`} className="text-sm text-primary hover:underline">{option.contact}</a>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Phone Support</h4>
                    <a href="tel:+91-9876543210" className="text-primary hover:underline text-sm">+91-9876543210</a>
                    <p className="text-xs text-muted-foreground">Available 24/7 for emergencies</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🕒</span>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Business Hours</h4>
                    <p className="text-xs text-muted-foreground">Mon–Fri: 6:00 AM – 10:00 PM</p>
                    <p className="text-xs text-muted-foreground">Sat–Sun: 7:00 AM – 9:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Emergency Support</h3>
          <p className="text-muted-foreground mb-4">Our emergency team is available 24/7 for urgent issues.</p>
          <a href="tel:+91-9876543210">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Icons.phone className="w-4 h-4 mr-2" />
              Call Emergency Support
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ContactSupport