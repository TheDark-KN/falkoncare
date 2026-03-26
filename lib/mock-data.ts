import type {
  Customer,
  ServiceCategory,
  ServiceItem,
  Staff,
  Booking,
  Payment,
  WalletTransaction,
  CustomerFeedback,
  Notification,
} from "./types"

export const serviceCategories: ServiceCategory[] = [
  {
    id: "tank-services",
    name: "Tank Cleaning",
    description: "Professional cleaning for overhead and underground tanks",
    icon: "droplets",
  },
  {
    id: "pipe-services",
    name: "Pipe Services",
    description: "Pipe cleaning, repair and replacement",
    icon: "pipette",
  },
  {
    id: "filter-purification",
    name: "Filter & Purification",
    description: "Water filter installation and maintenance",
    icon: "filter",
  },
  {
    id: "monitoring",
    name: "Water Monitoring",
    description: "Water quality testing and monitoring",
    icon: "activity",
  },
  {
    id: "miscellaneous",
    name: "Other Services",
    description: "Additional water-related services",
    icon: "wrench",
  },
]

export const serviceItems: ServiceItem[] = [
  // Tank Services
  {
    id: "tank-cleaning-basic",
    categoryId: "tank-services",
    name: "Basic Tank Cleaning",
    description: "Complete cleaning with anti-bacterial treatment",
    basePrice: 500,
    duration: "1-2 hours",
    image: "/service_1_tank_service_500.png",
    tankSizes: [
      { size: "500L", priceMultiplier: 1 },
      { size: "1000L", priceMultiplier: 1.5 },
      { size: "2000L", priceMultiplier: 2 },
      { size: "5000L", priceMultiplier: 3 },
    ],
    tankTypes: [
      { type: "Overhead", priceAddition: 0 },
      { type: "Underground", priceAddition: 200 },
    ],
  },
  {
    id: "tank-cleaning-premium",
    categoryId: "tank-services",
    name: "Premium Tank Cleaning",
    description: "Deep cleaning with UV treatment and sanitization",
    basePrice: 800,
    duration: "2-3 hours",
    image: "/service_2_tank_service_700.png",
    tankSizes: [
      { size: "500L", priceMultiplier: 1 },
      { size: "1000L", priceMultiplier: 1.5 },
      { size: "2000L", priceMultiplier: 2 },
      { size: "5000L", priceMultiplier: 3 },
    ],
    tankTypes: [
      { type: "Overhead", priceAddition: 0 },
      { type: "Underground", priceAddition: 300 },
    ],
  },
  {
    id: "tank-repair",
    categoryId: "tank-services",
    name: "Tank Repair & Maintenance",
    description: "Leak fixing, coating and minor repairs",
    basePrice: 1000,
    duration: "2-4 hours",
    image: "/service_3_tank_service_1000.png",
  },
  // Pipe Services
  {
    id: "pipe-cleaning",
    categoryId: "pipe-services",
    name: "Pipe Cleaning",
    description: "High-pressure pipe cleaning and descaling",
    basePrice: 600,
    duration: "1-2 hours",
    image: "/service_4_tank_service.png",
  },
  {
    id: "pipe-replacement",
    categoryId: "pipe-services",
    name: "Pipe Replacement",
    description: "Old pipe removal and new installation",
    basePrice: 1500,
    duration: "3-5 hours",
    image: "/service_5_tank_service.png",
  },
  // Filter Services
  {
    id: "filter-installation",
    categoryId: "filter-purification",
    name: "Water Filter Installation",
    description: "New water filter/purifier installation",
    basePrice: 800,
    duration: "1-2 hours",
    image: "/service_6_tank_service.png",
  },
  {
    id: "filter-service",
    categoryId: "filter-purification",
    name: "Filter Servicing",
    description: "Filter cleaning and cartridge replacement",
    basePrice: 400,
    duration: "30-60 mins",
    image: "/service_7_tank.png",
  },
  // Monitoring Services
  {
    id: "water-testing",
    categoryId: "monitoring",
    name: "Water Quality Testing",
    description: "Comprehensive water quality analysis",
    basePrice: 300,
    duration: "30 mins",
    image: "/service_8_tank.png",
  },
  // Miscellaneous
  {
    id: "motor-service",
    categoryId: "miscellaneous",
    name: "Water Motor Service",
    description: "Motor repair and maintenance",
    basePrice: 700,
    duration: "1-2 hours",
    image: "/service_9_tank.png",
  },
]

export const mockStaff: Staff[] = [
  {
    id: "staff-1",
    name: "Rajesh Kumar",
    mobile: "+91 98765 43210",
    email: "rajesh@falkon.com",
    photo: "/indian-male-worker-portrait.jpg",
    rating: 4.8,
    completedJobs: 156,
    status: "available",
  },
  {
    id: "staff-2",
    name: "Suresh Patel",
    mobile: "+91 98765 43211",
    email: "suresh@falkon.com",
    photo: "/indian-male-technician-portrait.jpg",
    rating: 4.6,
    completedJobs: 142,
    status: "busy",
  },
  {
    id: "staff-3",
    name: "Amit Singh",
    mobile: "+91 98765 43212",
    email: "amit@falkon.com",
    photo: "/indian-male-service-worker-portrait.jpg",
    rating: 4.9,
    completedJobs: 198,
    status: "available",
  },
  {
    id: "staff-4",
    name: "Vikram Sharma",
    mobile: "+91 98765 43213",
    email: "vikram@falkon.com",
    photo: "/indian-male-plumber-portrait.jpg",
    rating: 4.7,
    completedJobs: 134,
    status: "off-duty",
  },
]

export const mockCustomer: Customer = {
  id: "cust-1",
  name: "Priya Sharma",
  mobile: "+91 99887 76655",
  email: "priya@example.com",
  address: "123, Green Valley Apartments, Sector 15, Gurgaon",
  walletBalance: 2500,
  createdAt: new Date("2024-01-15"),
}

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "cust-1",
    serviceId: "tank-cleaning-premium",
    serviceName: "Premium Tank Cleaning",
    date: "2025-11-28",
    time: "10:00 AM",
    status: "confirmed",
    amount: 1600,
    staffId: "staff-1",
    address: "123, Green Valley Apartments, Sector 15, Gurgaon",
    tankSize: "1000L",
    tankType: "Overhead",
    createdAt: new Date(),
  },
  {
    id: "booking-2",
    customerId: "cust-1",
    serviceId: "filter-service",
    serviceName: "Filter Servicing",
    date: "2025-11-20",
    time: "02:00 PM",
    status: "completed",
    amount: 400,
    staffId: "staff-3",
    address: "123, Green Valley Apartments, Sector 15, Gurgaon",
    createdAt: new Date("2025-11-18"),
  },
  {
    id: "booking-3",
    customerId: "cust-1",
    serviceId: "water-testing",
    serviceName: "Water Quality Testing",
    date: "2025-11-15",
    time: "11:00 AM",
    status: "completed",
    amount: 300,
    staffId: "staff-2",
    address: "123, Green Valley Apartments, Sector 15, Gurgaon",
    createdAt: new Date("2025-11-14"),
  },
]

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    bookingId: "booking-1",
    customerId: "cust-1",
    amount: 1600,
    status: "paid",
    method: "wallet",
    createdAt: new Date(),
  },
  {
    id: "pay-2",
    bookingId: "booking-2",
    customerId: "cust-1",
    amount: 400,
    status: "paid",
    method: "upi",
    createdAt: new Date("2025-11-18"),
  },
]

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: "wallet-1",
    customerId: "cust-1",
    amount: 5000,
    type: "credit",
    description: "Wallet Recharge",
    createdAt: new Date("2025-11-01"),
  },
  {
    id: "wallet-2",
    customerId: "cust-1",
    amount: 1600,
    type: "debit",
    description: "Payment for Premium Tank Cleaning",
    createdAt: new Date(),
  },
  {
    id: "wallet-3",
    customerId: "cust-1",
    amount: 400,
    type: "debit",
    description: "Payment for Filter Servicing",
    createdAt: new Date("2025-11-18"),
  },
]

export const mockFeedback: CustomerFeedback[] = [
  {
    id: "feedback-1",
    customerId: "cust-1",
    bookingId: "booking-2",
    rating: 5,
    comment: "Excellent service! The technician was very professional and thorough.",
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "feedback-2",
    customerId: "cust-1",
    bookingId: "booking-3",
    rating: 4,
    comment: "Good testing service. Report was detailed.",
    createdAt: new Date("2025-11-15"),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "cust-1",
    userType: "customer",
    title: "Booking Confirmed",
    message: "Your Premium Tank Cleaning is scheduled for Nov 28 at 10:00 AM",
    read: false,
    createdAt: new Date(),
  },
  {
    id: "notif-2",
    userId: "cust-1",
    userType: "customer",
    title: "Service Completed",
    message: "Your Filter Servicing has been completed. Please rate your experience.",
    read: true,
    createdAt: new Date("2025-11-20"),
  },
]

// Generate available time slots
export function generateTimeSlots(): string[] {
  return ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]
}

// Generate available dates (next 14 days)
export function generateAvailableDates(): { date: string; available: boolean }[] {
  const dates = []
  const today = new Date()

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      date: date.toISOString().split("T")[0],
      available: Math.random() > 0.2, // 80% chance of availability
    })
  }

  return dates
}
