import { createHmac } from 'crypto';

// Generate JWT secret (64 hex chars = 32 bytes)
const jwtSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

// Generate CONVEX_AUTH_ADAPTER_SECRET (32 bytes)
const adapterSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log('=== Copy these into Convex Dashboard (Settings → Environment Variables) ===\n');
console.log('CONVEX_AUTH_JWT_SECRET=' + jwtSecret);
console.log('CONVEX_AUTH_ADAPTER_SECRET=' + adapterSecret);
console.log('\n=== Also add these ===');
console.log('SITE_URL=http://localhost:3000');
console.log('AUTH_RESEND_KEY=re_GsTsEh3J_PnZJsPZnYsRQhn1ZG1BLQUDh');