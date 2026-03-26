# Falkon Care

> Professional Water Tank Cleaning Service in Delhi NCR

A modern service marketplace platform connecting customers with certified water tank cleaning professionals across Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Convex (real-time backend)
- **Auth:** Clerk Authentication
- **Deployment:** Vercel

## Features

- User authentication (email + OAuth)
- Browse and book water tank cleaning services
- Customer dashboard with booking management
- Admin panel for operations management
- Wallet system for payments
- Responsive design (mobile-first)
- SEO optimized

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/falkoncare.git
cd falkoncare

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Clerk and Convex keys

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/                    # Next.js App Router pages
├── dashboard/         # Customer dashboard
├── admin/             # Admin panel
├── services/          # Service listing
└── (auth)/            # Authentication routes

components/
├── ui/               # shadcn/ui base components
├── landing/           # Landing page components
├── dashboard/        # Dashboard components
├── admin/             # Admin components
└── booking/           # Booking components

convex/               # Convex backend functions
lib/                  # Utilities and types
```

## Services

- Water Tank Cleaning (Residential & Commercial)
- Pipe Services
- Tank Repair
- Filter Servicing
- Water Quality Testing

## Service Areas

- Delhi (All Zones)
- Noida & Greater Noida
- Gurgaon
- Faridabad
- Ghaziabad

## License

© 2026 Falkon Futurex Private Limited. All rights reserved.
