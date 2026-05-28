import { HomeClient } from "./home-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Falkon Care - Professional Water Tank Cleaning Service in Delhi NCR | Noida, Gurgaon, Faridabad",
  description: "Falkon Care provides expert water tank cleaning services in Delhi, Noida, Gurgaon, Faridabad & Ghaziabad. Professional residential & commercial tank cleaning. Book now for same-day service! ✓ Certified Technicians ✓ Safe & Hygienic ✓ Affordable Rates",
  keywords: "Falkon Care, water tank cleaning Delhi, water tank cleaning NCR, water tank cleaning near me, water tank cleaning service, tank cleaning Noida, tank cleaning Gurgaon, residential tank cleaning, commercial tank cleaning",
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <HomeClient />
}
