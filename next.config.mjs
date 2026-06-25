/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // [FIXED M2] TypeScript errors are no longer suppressed — type safety is enforced
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Set output directory to default .next
  distDir: '.next',
  // Disable source maps in production to reduce file writes
  productionBrowserSourceMaps: false,

  // [FIXED M1] Security headers applied to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer information
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Enforce HTTPS for 1 year
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Restrict browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline for styles; Razorpay checkout needs its own origin; Cloudflare challenges allowed for CAPTCHA
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com https://*.clerk.accounts.dev https://*.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://clerk.falkoncare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.clerk.accounts.dev https://*.accounts.dev https://*.clerk.com https://api.razorpay.com https://checkout.razorpay.com https://clerk-telemetry.com https://challenges.cloudflare.com https://clerk.falkoncare.com https://nominatim.openstreetmap.org",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com https://*.clerk.accounts.dev https://*.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://clerk.falkoncare.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
