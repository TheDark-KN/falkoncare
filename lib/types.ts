/**
 * Shared type definitions used across the FalkonCare app.
 * This file bridges Convex backend types with frontend display types.
 */

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
