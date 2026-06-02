
# ✅ TODO LIST: Fix “Insufficient Wallet Balance” Error (Convex + Next.js)

## 🟢 PHASE 1: Backend (Convex) — MUST DO

### ⬜ 1. Replace `Error` with `ConvexError`

**File:** `convex/bookings.ts`

**Why:** Convex errors must be serializable and readable by the client.

```ts
import { ConvexError } from "convex/values"

// ❌ remove this
// throw new Error("Insufficient wallet balance")

// ✅ add this
throw new ConvexError("INSUFFICIENT_WALLET_BALANCE")
```

---

### ⬜ 2. Validate wallet before booking

**Goal:** Stop invalid bookings early

```ts
if (!wallet || wallet.balance < args.price) {
  throw new ConvexError("INSUFFICIENT_WALLET_BALANCE")
}
```

---

### ⬜ 3. (Optional but recommended) Add error constants

**Why:** Avoid typos and future bugs

```ts
export const ERRORS = {
  INSUFFICIENT_WALLET_BALANCE: "INSUFFICIENT_WALLET_BALANCE",
  UNAUTHORIZED: "UNAUTHORIZED",
}
```

---

## 🟢 PHASE 2: Client Handling — VERY IMPORTANT

### ⬜ 4. Wrap booking call in `try/catch`

**File:**
`app/dashboard/services/[serviceId]/page.tsx`

```ts
try {
  await createBooking({...})
} catch (error: any) {
  if (error.message === "INSUFFICIENT_WALLET_BALANCE") {
    toast.error("Insufficient wallet balance. Please recharge.")
  } else {
    toast.error("Booking failed. Please try again.")
  }
}
```

---

### ⬜ 5. Stop console crash (no uncaught errors)

✔ Console should NOT show red error
✔ App should stay stable

---

## 🟢 PHASE 3: UX Improvements (Prevention > Error)

### ⬜ 6. Disable booking button if wallet is low

**Best UX — user never hits the error**

```tsx
<Button disabled={walletBalance < service.price}>
  {walletBalance < service.price ? "Insufficient Balance" : "Confirm Booking"}
</Button>
```

---

### ⬜ 7. Show wallet balance clearly

**Let users know before booking**

* Show balance near price
* Highlight in red if low

```tsx
<p className="text-sm text-muted-foreground">
  Wallet Balance: ₹{walletBalance}
</p>
```

---

### ⬜ 8. Add “Recharge Wallet” CTA

```tsx
<Link href="/dashboard/wallet">
  <Button variant="outline">Recharge Wallet</Button>
</Link>
```

---

## �� PHASE 4: Safety & Future-Proofing (Recommended)

### ⬜ 9. Make booking + wallet deduction atomic

**So no partial failures**

* Deduct balance
* Create booking
* Save transaction
* All in ONE mutation

---

### ⬜ 10. Log failed booking attempts (optional)

```ts
console.warn("Booking failed due to low balance", {
  userId,
  required: args.price,
  available: wallet.balance,
})
```

---

## 🟢 PHASE 5: Testing Checklist (Don’t skip)

### ⬜ Test with low balance

* Booking blocked
* Friendly toast shown
* No console error

### ⬜ Test with exact balance

* Booking succeeds
* Balance becomes 0

### ⬜ Test double-click booking

* No double deduction
* No duplicate booking

---

## 🎯 FINAL RESULT YOU SHOULD SEE

✔ No red console errors
✔ Clean user-friendly messages
✔ Professional booking flow
✔ Wallet logic feels solid
✔ App behaves like production-ready SaaS

---

If you want, next I can:

* Turn this TODO into **GitHub issues**
* Add **wallet auto-top-up**
* Add **booking confirmation modal**
* Improve **Convex schema design**

Just tell me what you want next — you’re very close to a rock-solid system 💪💧

