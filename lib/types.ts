/**
 * Shared type definitions used across the FalkonCare app.
 * This file contains ALL domain types + Razorpay/Convex bridge types.
 */

// ─────────────────────────────────────────────
// Domain Types (used by mock-data.ts and store)
// ─────────────────────────────────────────────

export interface TankSizeOption {
  size: string;
  priceMultiplier: number;
}

export interface TankTypeOption {
  type: string;
  priceAddition: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  duration: string;
  image?: string;
  tankSizes?: TankSizeOption[];
  tankTypes?: TankTypeOption[];
}

export interface Staff {
  id: string;
  name: string;
  mobile: string;
  email: string;
  photo: string;
  rating: number;
  completedJobs: number;
  status: "available" | "busy" | "off-duty";
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  walletBalance: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  staffId?: string;
  address: string;
  tankSize?: string;
  tankType?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  method: "wallet" | "cash" | "upi" | "card" | "netbanking";
  createdAt: Date;
}

export interface WalletTransaction {
  id: string;
  customerId: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: Date;
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  userType: "customer" | "staff" | "admin";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ─────────────────────────────────────────────
// Booking / Convex Bridge Types
// ─────────────────────────────────────────────

/** Booking status union — must stay in sync with convex/schema.ts */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

/** Minimal booking shape required by BookingCard — works with both LocalBooking and Convex data */
export interface DisplayBooking {
  id: string;
  serviceName: string;
  date: number; // Unix timestamp (ms)
  time: string;
  amount: number;
  address: string;
  tankSize?: string;
  tankType?: string;
  status: BookingStatus;
  paymentStatus?: string;
}

// ─────────────────────────────────────────────
// Razorpay Types
// ─────────────────────────────────────────────

/** Razorpay checkout response payload */
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/** Razorpay failure event payload */
export interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

/** Razorpay order creation response from /api/razorpay */
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/** Razorpay checkout options */
export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

/** Payment methods supported by the app */
export type PaymentMethod = "wallet" | "cash" | "upi" | "card" | "netbanking";
