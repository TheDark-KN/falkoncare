/**
 * Global type augmentations for FalkonCare.
 * Declared once here to avoid duplicate/conflicting Window interface merges.
 */

interface RazorpayPaymentFailureEvent {
  error: {
    code: string;
    description: string;
    reason: string;
    metadata: { order_id: string; payment_id: string };
  };
}

interface Window {
  Razorpay: new (options: object) => {
    on: (event: string, handler: (response?: RazorpayPaymentFailureEvent) => void) => void;
    open: () => void;
  };
}
