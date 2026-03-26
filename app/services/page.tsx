import type { Metadata } from "next"
import { ServicesPageClient } from "./client-page"

export const metadata: Metadata = {
  title: "Water Tank Cleaning Service in Delhi NCR - Falkon Care | Noida, Gurgaon, Faridabad, Ghaziabad",
  description: "Professional water tank cleaning services in Delhi, Noida, Gurgaon, Faridabad & Ghaziabad by Falkon Care. ✓ Residential & Commercial ✓ Same-Day Service ✓ Certified Technicians ✓ Starting ₹499. Book Now!",
  keywords: "water tank cleaning Delhi, water tank cleaning NCR, tank cleaning near me, water tank cleaning service, Falkon Care, residential tank cleaning, commercial tank cleaning, water tank sanitization Delhi",
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: "Water Tank Cleaning Service in Delhi NCR - Falkon Care",
    description: "Expert water tank cleaning services across Delhi NCR. Professional, safe, and affordable. Book Falkon Care today!",
    url: 'https://falkoncare.com/services',
  },
}

export default function ServicesPage() {
  return <ServicesPageClient />
}
