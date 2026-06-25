# Design System Specification: The Pristine Professional

## 1. Overview & Creative North Star
This design system is built to transform a utility service into a high-end digital experience. Our Creative North Star is **"The Hydro-SaaS Aesthetic."** We are moving away from the cluttered, line-heavy layouts of traditional government portals and toward a fluid, editorial approach that feels as clean as the water the service provides.

To break the "template" look, we employ **Intentional Asymmetry**. Instead of rigid, centered columns, we use wide-set margins and overlapping surface layers to create depth. By treating the UI as a series of floating, high-fidelity "sheets" rather than a flat grid, we convey a sense of modern efficiency and elite reliability.

---

## 2. Colors & Surface Logic
We don't just use color; we use *chromatic depth*. The palette transitions from deep, authoritative blues to hygienic, sterile teals.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. 
*   **The Method:** Boundaries must be defined through background color shifts. For example, a `surface-container-low` component should sit directly on a `surface` background.
*   **The Result:** A seamless, "infinite" layout that feels modern and expansive rather than boxed-in.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack.
*   **Layer 0 (Base):** `surface` (#f7f9fb)
*   **Layer 1 (Main Content):** `surface-container-low` (#f2f4f6)
*   **Layer 2 (High-Priority Cards):** `surface-container-lowest` (#ffffff)
*   **Layer 3 (Floating Elements):** Glassmorphism (see below).

### The "Glass & Gradient" Rule
To inject "soul" into the professional aesthetic:
*   **Glassmorphism:** For floating navigation or modal overlays, use `surface-container-lowest` at 70% opacity with a `24px` backdrop-blur. 
*   **Signature Gradients:** Main CTAs must use a linear gradient from `primary` (#006194) to `primary-container` (#007bb9) at a 135-degree angle. This mimics the light refraction found in clean water.

---

## 3. Typography
We utilize a pairing of **Plus Jakarta Sans** (a modern, high-end alternative to Poppins) for headlines and **Public Sans** (a more sophisticated, legible take on Roboto/San Francisco) for body text to achieve an editorial feel.

*   **Display (L/M/S):** Used for hero marketing or high-level dashboard metrics. Set with `-0.02em` letter spacing to feel tight and authoritative.
*   **Headline (L/M/S):** Used for page titles and major section headers.
*   **Title & Body:** Public Sans provides a neutral, highly readable foundation for technical service details and data tables.
*   **The Hierarchy Goal:** Use high-contrast scale jumps (e.g., a `display-md` title next to `body-md` metadata) to create a clear "read-first" path for the user.

---

## 4. Elevation & Depth
We reject traditional "Material" drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The contrast in light values provides all the "lift" required.
*   **Ambient Shadows:** For high-elevation elements (like a task drawer), use a shadow with a blur of `40px`, a `10px` Y-offset, and an opacity of `6%`. The shadow color must be tinted with the `on-surface` (#191c1e) token to avoid a "muddy" grey look.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#bfc7d2) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** Gradient-filled (`primary` to `primary-container`), `xl` (1.5rem) roundedness. 
*   **Secondary:** Ghost-style using `surface-container-high` background with `on-surface` text.
*   **Tertiary:** No background; `on-primary-fixed-variant` text with a subtle underline on hover.

### Inputs & Fields
*   **The Container:** Use `surface-container-highest` (#e0e3e5) for the field background. 
*   **States:** On focus, the background shifts to `surface-container-lowest` (#ffffff) with a `2px` "Ghost Border" in `primary`. Forbid traditional 1px outlines.

### Cards & Lists
*   **Card Style:** `lg` (1rem) corner radius. Use vertical whitespace (Spacing Scale `8` or `10`) instead of dividers.
*   **Service Chips:** Use `secondary-container` (#86f2e4) with `on-secondary-container` (#006f66) for status indicators like "Completed" or "Sterilized."

### Specialized Component: The "Hygiene Meter"
A custom progress ring or bar using a gradient from `secondary` (#006a61) to `secondary-fixed` (#89f5e7) to visualize water quality or cleaning progress.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Generous Padding:** When in doubt, increase padding. White space is the primary indicator of "premium" service.
*   **Mix Surface Tones:** Layer a white card on a light grey background to create a clean, organized look.
*   **Use Soft Corners:** Stick strictly to the `lg` (16px) and `xl` (24px) rounding for main UI containers.

### Don't:
*   **Don't use Dividers:** Never use a horizontal line to separate list items. Use a `0.5px` background shift or simply `1.5rem` of vertical space.
*   **Don't use Pure Black:** Text should always be `on-surface` (#191c1e), which is a soft charcoal, keeping the UI feeling high-end and "airy."
*   **Don't use Harsh Shadows:** If the shadow is clearly visible, it is too dark. It should feel like an ambient glow, not a cutout.