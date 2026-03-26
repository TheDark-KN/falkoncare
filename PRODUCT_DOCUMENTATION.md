# Falkon Care - Product Documentation

> **Document Version:** 1.0.0  
> **Last Updated:** March 2026  
> **Company:** Falkon Futurex Private Limited  
> **Website:** https://falkoncare.com  
> **Legal Entity:** Falkon Futurex Private Limited

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [System Design](#2-system-design)
3. [UI/UX Design](#3-uiux-design)
4. [Wireframes](#4-wireframes-text-wireframes)
5. [UI Components List](#5-ui-components-list)
6. [Development Roadmap](#6-development-roadmap)
7. [Folder Structure](#7-folder-structure)

---

# 1. Product Requirements Document (PRD)

## 1.1 Product Overview

**Project Name:** Falkon Care

**Tagline:** Professional Water Tank Cleaning Service in Delhi NCR

**Description:**  
Falkon Care is a service marketplace platform that connects customers in Delhi NCR (Delhi, Noida, Gurgaon, Faridabad, Ghaziabad) with certified water tank cleaning professionals. The platform enables easy booking, secure payments, real-time tracking, and comprehensive service management for both residential and commercial water tank maintenance needs.

**Core Value Proposition:**
- Trusted, certified technicians for professional water tank cleaning
- Easy online booking with same-day service availability
- Transparent pricing with no hidden charges
- 100% safe and hygienic cleaning using eco-friendly solutions
- Comprehensive service coverage across entire Delhi NCR region

---

## 1.2 Problem Statement

### Current Market Challenges

| Problem | Impact | Solution |
|---------|--------|----------|
| Unhygienic water tanks causing waterborne diseases | Health risks for families | Professional cleaning with certified standards |
| Difficulty finding reliable service providers | Time wasted on unreliable vendors | Verified technicians with ratings and reviews |
| Lack of transparency in pricing | Unexpected costs | Fixed pricing with clear breakdowns |
| No accountability or quality guarantee | Poor service experience | Service warranty and satisfaction guarantee |
| Limited service coverage in NCR areas | Inconvenience for customers | Pan-NCR coverage with local technicians |

### Target Market Pain Points

1. **Health Concerns:** Dirty water tanks harbor bacteria, algae, and pathogens causing waterborne diseases
2. **Time Constraints:** Difficult to find and schedule reliable cleaning services
3. **Quality Issues:** Substandard cleaning using harmful chemicals
4. **Trust Deficit:** Lack of verified technicians and service guarantees
5. **Accessibility:** Limited availability in satellite cities like Noida, Gurgaon, Ghaziabad

---

## 1.3 Goals & Objectives

### Primary Goals

| Goal | Metric | Target |
|------|--------|--------|
| Increase service bookings | Monthly bookings | 500+ by Q2 2026 |
| Expand service coverage | Cities covered | 5 major NCR cities |
| Improve customer satisfaction | NPS Score | 4.8+ / 5.0 |
| Reduce service response time | Average hours | < 24 hours |
| Build technician network | Certified partners | 100+ technicians |

### Secondary Goals

- Establish Falkon Care as the #1 water tank cleaning brand in Delhi NCR
- Develop Annual Maintenance Contract (AMC) offerings for B2B clients
- Implement loyalty program with wallet rewards
- Launch mobile application for iOS and Android
- Integrate WhatsApp booking and notifications

---

## 1.4 Target Users

### Primary User Segments

#### 1. Residential Customers
- **Demographics:** Homeowners, tenants, apartment residents aged 25-55
- **Needs:** Regular tank cleaning, affordable pricing, flexible scheduling
- **Behavior:** Price-conscious, value hygiene, prefer digital bookings
- **Pain Points:** Finding reliable services, scheduling conflicts

#### 2. Commercial Customers
- **Demographics:** Society welfare associations, commercial complexes, offices
- **Needs:** Bulk bookings, AMC options, professional service standards
- **Behavior:** Decision-makers (RWA presidents, facility managers)
- **Pain Points:** Coordinating multiple units, maintaining service quality

#### 3. Corporate Clients
- **Demographics:** Hotels, hospitals, schools, industries
- **Needs:** Compliance documentation, regular maintenance schedules
- **Behavior:** Formal procurement process, contract-based services
- **Pain Points:** Vendor management, quality consistency

### User Personas

| Persona | Age | Occupation | Use Case | Key Priority |
|---------|-----|------------|----------|--------------|
| **Priya Sharma** | 32 | Working Professional | Home tank cleaning | Convenience & Trust |
| **Rajesh Kumar** | 45 | RWA President | Society maintenance | Quality & Reliability |
| **Amit Gupta** | 38 | Hotel Manager | Commercial tanks | Compliance & Documentation |
| **Meera Patel** | 28 | New Homeowner | First-time cleaning | Education & Guidance |

---

## 1.5 User Stories

### Customer User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-001 | Customer | Book a service online | I don't have to call or visit | P0 |
| US-002 | Customer | See service pricing upfront | I can budget accordingly | P0 |
| US-003 | Customer | Choose my preferred time slot | It fits my schedule | P0 |
| US-004 | Customer | Track my booking status | I know when technician arrives | P1 |
| US-005 | Customer | Pay via multiple methods | I can use my preferred option | P0 |
| US-006 | Customer | Rate my experience | I can help others decide | P1 |
| US-007 | Customer | Access previous bookings | I can track my service history | P1 |
| US-008 | Customer | Add wallet balance | I can pay quickly next time | P2 |
| US-009 | Customer | Contact support easily | I can resolve issues fast | P1 |
| US-010 | Customer | Book AMC packages | I get regular maintenance | P2 |

### Admin User Stories

| ID | As an... | I want to... | So that... | Priority |
|----|----------|--------------|------------|----------|
| AU-001 | Admin | View all bookings | I can monitor operations | P0 |
| AU-002 | Admin | Update booking status | I can manage workflow | P0 |
| AU-003 | Admin | Manage service catalog | I can add/remove services | P0 |
| AU-004 | Admin | View analytics dashboard | I can track performance | P1 |
| AU-005 | Admin | Manage staff schedules | I can optimize assignments | P1 |
| AU-006 | Admin | View customer database | I can understand customers | P1 |
| AU-007 | Admin | Generate reports | I can make data-driven decisions | P2 |

---

## 1.6 Features List (MVP / Future)

### MVP Features (Phase 1)

#### Customer Features
- [x] User registration and authentication (Clerk)
- [x] Browse services and pricing
- [x] Book service with date/time selection
- [x] View booking history
- [x] View booking details and status
- [x] User profile management
- [x] Wallet system for payments
- [x] Service area coverage display

#### Admin Features
- [x] Dashboard with key metrics
- [x] Manage all bookings
- [x] Update booking status
- [x] View customer list
- [x] Service management

#### Technical Features
- [x] Responsive design (mobile-first)
- [x] SEO optimization
- [x] Google Analytics integration
- [x] Schema markup for local SEO
- [x] Clerk authentication
- [x] Convex backend database

---

### Phase 2 Features (Beta)

- [ ] Staff management module
- [ ] Real-time booking notifications
- [ ] Payment gateway integration (Razorpay)
- [ ] SMS/WhatsApp notifications
- [ ] Before/after photo upload
- [ ] Service review and rating system
- [ ] Booking rescheduling
- [ ] Cancellation with refund flow

### Phase 3 Features (Production)

- [ ] Annual Maintenance Contract (AMC) module
- [ ] Loyalty rewards and points system
- [ ] Referral program
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Staff mobile application
- [ ] Coupon and discount system
- [ ] PDF invoice generation

### Phase 4 Features (Scale)

- [ ] Mobile application (iOS & Android)
- [ ] Real-time technician tracking
- [ ] AI-powered scheduling optimization
- [ ] IoT integration for water quality monitoring
- [ ] API for third-party integrations
- [ ] Multi-city expansion (Mumbai, Bangalore, Hyderabad)
- [ ] Franchise model

---

## 1.7 Functional Requirements

### Authentication Module

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-AUTH-01 | User Registration | Register with email, phone, or OAuth |
| FR-AUTH-02 | User Login | Secure login with email/password |
| FR-AUTH-03 | Password Reset | Email-based password reset flow |
| FR-AUTH-04 | Session Management | JWT-based session with refresh tokens |
| FR-AUTH-05 | Role-Based Access | Customer, Staff, Admin roles |
| FR-AUTH-06 | Multi-Device Support | Concurrent sessions with device tracking |

### Service Module

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-SVC-01 | Service Listing | Display all available services with details |
| FR-SVC-02 | Service Filtering | Filter by category, price, duration |
| FR-SVC-03 | Service Search | Search services by name or keyword |
| FR-SVC-04 | Service Details | View complete service information |
| FR-SVC-05 | Dynamic Pricing | Calculate price based on tank size/type |
| FR-SVC-06 | Service Availability | Show available time slots |

### Booking Module

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-BKG-01 | Create Booking | Book service with all required details |
| FR-BKG-02 | View Bookings | List all user bookings with filters |
| FR-BKG-03 | Booking Details | View complete booking information |
| FR-BKG-04 | Update Booking | Modify date, time, address |
| FR-BKG-05 | Cancel Booking | Cancel with reason selection |
| FR-BKG-06 | Booking Status | Track status (pending → completed) |
| FR-BKG-07 | Booking Confirmation | Email/SMS confirmation on booking |

### Payment Module

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-PAY-01 | Wallet System | In-app wallet for quick payments |
| FR-PAY-02 | Wallet Recharge | Add money to wallet |
| FR-PAY-03 | Payment Deduction | Auto-deduct on booking completion |
| FR-PAY-04 | Transaction History | View all payment transactions |
| FR-PAY-05 | Refund Processing | Process refunds on cancellation |

### Admin Module

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-ADM-01 | Dashboard | Overview with key metrics |
| FR-ADM-02 | Booking Management | View and update all bookings |
| FR-ADM-03 | User Management | View and manage user accounts |
| FR-ADM-04 | Service Management | Add, edit, remove services |
| FR-ADM-05 | Staff Management | Manage technician profiles |
| FR-ADM-06 | Reports | Generate operational reports |

---

## 1.8 Non-Functional Requirements

### Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 3 seconds | Lighthouse Performance Score > 90 |
| API Response Time | < 500ms | Server-side latency monitoring |
| Time to First Byte | < 200ms | CDN optimization |
| Largest Contentful Paint | < 2.5s | Core Web Vitals |
| Cumulative Layout Shift | < 0.1 | Core Web Vitals |

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Data Encryption | TLS 1.3 for data in transit |
| Authentication | Clerk with OAuth 2.0 |
| Session Management | JWT with 24-hour expiry |
| Input Validation | Zod schema validation |
| XSS Protection | React's built-in escaping |
| CSRF Protection | Clerk's built-in protection |
| Rate Limiting | Vercel Edge Functions |
| Data Privacy | GDPR-compliant data handling |

### Accessibility Requirements

| Standard | Compliance Level |
|----------|-----------------|
| WCAG 2.1 | AA Level |
| Color Contrast | 4.5:1 minimum ratio |
| Keyboard Navigation | Full support |
| Screen Reader | ARIA labels implemented |
| Focus Indicators | Visible focus states |

### Scalability Requirements

| Aspect | Requirement |
|--------|-------------|
| Concurrent Users | Support 1000+ simultaneous users |
| Database | Handle 100,000+ records |
| CDN | Global edge caching |
| Auto-scaling | Vercel's automatic scaling |
| Load Balancing | Built-in with Vercel Edge |

---

## 1.9 Success Metrics

### Key Performance Indicators (KPIs)

| KPI | Current | Target (Q2 2026) | Target (Q4 2026) |
|-----|---------|------------------|------------------|
| Monthly Active Users (MAU) | - | 5,000 | 25,000 |
| Monthly Bookings | - | 500 | 3,000 |
| Booking Conversion Rate | - | 5% | 10% |
| Customer Retention Rate | - | 40% | 60% |
| Average Order Value | - | ₹800 | ₹1,200 |
| Net Promoter Score (NPS) | - | 4.5 | 4.8 |
| First Response Time | - | < 1 hour | < 30 minutes |
| Service Completion Rate | - | 95% | 98% |

### Analytics Dashboard Metrics

| Category | Metrics |
|----------|---------|
| **Acquisition** | Website visits, page views, bounce rate |
| **Activation** | Sign-ups, first booking completion |
| **Retention** | Repeat bookings, returning customers |
| **Revenue** | GMV, AOV, revenue per user |
| **Satisfaction** | Ratings, reviews, complaints |

---

## 1.10 Risks & Assumptions

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Technician Availability | High | High | Build network of 100+ technicians |
| Seasonal Demand Fluctuation | Medium | Medium | Offer AMC packages for steady revenue |
| Competition from Local Players | Medium | Medium | Differentiate with technology and trust |
| Customer Churn | Medium | High | Focus on service quality and NPS |
| Technical Scalability | Low | High | Use scalable tech stack (Next.js + Convex) |
| Regulatory Changes | Low | Medium | Maintain compliance documentation |

### Assumptions

1. Water tank cleaning is a recurring need (6-month cycles)
2. Delhi NCR has sufficient demand for professional services
3. Customers prefer online booking over phone calls
4. Trust and quality are valued over lowest price
5. Eco-friendly cleaning solutions are preferred
6. Mobile traffic will continue to grow
7. Technician gig economy model is viable in the region

---

# 2. System Design

## 2.1 System Architecture

### Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 16 (App Router) | Server-side rendering, SEO optimization |
| **Styling** | Tailwind CSS + Radix UI | Rapid development, consistent design |
| **Animation** | Framer Motion | Smooth, production-ready animations |
| **Backend** | Convex | Real-time database, TypeScript-native |
| **Authentication** | Clerk | Secure, feature-rich auth solution |
| **Deployment** | Vercel | Optimized for Next.js, global CDN |
| **Analytics** | Vercel Analytics | Performance and user analytics |
| **Payments** | Wallet System (Phase 1) | In-app wallet for MVP |

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Web App    │  │ Mobile Web   │  │   PWA        │                  │
│  │  (Next.js)   │  │  (Responsive)│  │  (Future)    │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            EDGE LAYER (Vercel)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   CDN        │  │  Edge        │  │  Image       │                  │
│  │  Caching     │  │  Functions   │  │  Optimization│                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Application Server                    │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │   Landing   │  │  Customer   │  │      Admin Panel        │  │   │
│  │  │    Pages    │  │   Portal    │  │                         │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Clerk      │  │   Convex     │  │   Vercel     │                  │
│  │  (Auth)      │  │  (Database)  │  │  Analytics   │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Customer dashboard
│   │   ├── bookings/      # Booking management
│   │   ├── services/      # Service booking
│   │   ├── wallet/        # Wallet management
│   │   ├── profile/       # User profile
│   │   └── notifications/ # User notifications
│   ├── admin/             # Admin panel
│   │   ├── bookings/      # Booking management
│   │   ├── staff/         # Staff management
│   │   ├── services/      # Service catalog
│   │   ├── customers/     # Customer management
│   │   └── reports/       # Analytics reports
│   ├── landing/           # Marketing pages
│   └── services/          # Service listing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard components
│   ├── booking/          # Booking components
│   ├── admin/            # Admin components
│   └── shared/          # Shared utilities
├── lib/                  # Utilities and helpers
│   ├── utils.ts         # Common utilities
│   ├── types.ts         # TypeScript types
│   ├── store.ts         # State management
│   └── mock-data.ts     # Mock data for development
└── convex/              # Convex backend
    ├── schema.ts        # Database schema
    ├── bookings.ts      # Booking functions
    ├── users.ts         # User functions
    └── auth.config.ts  # Auth configuration
```

---

## 2.2 Database Design (Tables)

### Convex Database Schema

#### Users Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | Id | Primary Key | Auto-generated ID |
| `clerkId` | string | Required, Indexed | Clerk user identifier |
| `email` | string | Required, Unique | User email address |
| `fullName` | string | Optional | User's full name |
| `imageUrl` | string | Optional | Profile picture URL |
| `role` | string | Optional | "admin" \| "user" |
| `walletBalance` | number | Optional, Default: 0 | Wallet balance in INR |
| `address` | string | Optional | Default service address |
| `phoneNumber` | string | Optional | Contact number |
| `createdAt` | number | Required | Unix timestamp |
| `updatedAt` | number | Required | Unix timestamp |

**Indexes:**
- `by_clerk_id`: Unique index on `clerkId`
- `by_email`: Unique index on `email`

---

#### Bookings Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | Id | Primary Key | Auto-generated ID |
| `userId` | string | Required, Indexed | Clerk user ID |
| `serviceName` | string | Required | Name of the service |
| `date` | number | Required | Service date (timestamp) |
| `time` | string | Required | Time slot (e.g., "10:00 AM") |
| `amount` | number | Required | Total amount in INR |
| `status` | string | Required, Indexed | Booking status |
| `address` | string | Required | Service address |
| `tankSize` | string | Optional | Tank capacity |
| `tankType` | string | Optional | Type of tank |
| `paymentStatus` | string | Optional | Payment status |
| `staffId` | string | Optional | Assigned technician ID |
| `notes` | string | Optional | Additional notes |
| `createdAt` | number | Required | Unix timestamp |

**Indexes:**
- `by_user`: Index on `userId`
- `by_status`: Index on `status`

**Status Values:**
- `pending` - Booking created, awaiting confirmation
- `confirmed` - Booking confirmed by admin
- `in-progress` - Service being performed
- `completed` - Service completed successfully
- `cancelled` - Booking cancelled

---

#### Services Table (Future)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | Id | Primary Key | Auto-generated ID |
| `name` | string | Required | Service name |
| `description` | string | Required | Service description |
| `category` | string | Required | Service category |
| `basePrice` | number | Required | Starting price |
| `duration` | string | Required | Service duration |
| `image` | string | Optional | Service image URL |
| `isActive` | boolean | Default: true | Active status |
| `createdAt` | number | Required | Unix timestamp |

---

#### Staff Table (Future)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | Id | Primary Key | Auto-generated ID |
| `name` | string | Required | Staff name |
| `email` | string | Required | Contact email |
| `phone` | string | Required | Contact number |
| `photo` | string | Optional | Profile photo |
| `rating` | number | Default: 0 | Average rating |
| `completedJobs` | number | Default: 0 | Total jobs completed |
| `status` | string | Default: "available" | Availability status |
| `serviceAreas` | string[] | Required | Covered areas |
| `createdAt` | number | Required | Unix timestamp |

---

#### Transactions Table (Future)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | Id | Primary Key | Auto-generated ID |
| `userId` | string | Required, Indexed | User ID |
| `bookingId` | string | Optional | Related booking |
| `amount` | number | Required | Transaction amount |
| `type` | string | Required | "credit" \| "debit" |
| `method` | string | Optional | Payment method |
| `description` | string | Required | Transaction description |
| `createdAt` | number | Required | Unix timestamp |

---

## 2.3 API Endpoints

### Convex API Functions

#### Authentication

| Function | Type | Parameters | Returns | Description |
|----------|------|------------|---------|-------------|
| `users.create` | Mutation | User data | User object | Create new user |
| `users.current` | Query | - | User object | Get current user |
| `users.update` | Mutation | id, updates | User object | Update user profile |

#### Bookings

| Function | Type | Parameters | Returns | Description |
|----------|------|------------|---------|-------------|
| `bookings.create` | Mutation | Booking data | Booking object | Create new booking |
| `bookings.get` | Query | - | Booking[] | Get all bookings (admin) |
| `bookings.getByUser` | Query | - | Booking[] | Get user's bookings |
| `bookings.getById` | Query | id | Booking object | Get booking details |
| `bookings.updateStatus` | Mutation | id, status | Booking object | Update booking status |
| `bookings.cancel` | Mutation | id | Booking object | Cancel booking |

#### Services (Future)

| Function | Type | Parameters | Returns | Description |
|----------|------|------------|---------|-------------|
| `services.list` | Query | category? | Service[] | List services |
| `services.getById` | Query | id | Service object | Get service details |
| `services.create` | Mutation | Service data | Service object | Create service |
| `services.update` | Mutation | id, updates | Service object | Update service |
| `services.delete` | Mutation | id | void | Delete service |

#### Payments (Future)

| Function | Type | Parameters | Returns | Description |
|----------|------|------------|---------|-------------|
| `payments.recharge` | Mutation | userId, amount | Transaction object | Recharge wallet |
| `payments.deduct` | Mutation | userId, amount, bookingId | Transaction object | Deduct from wallet |
| `payments.getHistory` | Query | userId | Transaction[] | Get transaction history |

---

## 2.4 Authentication Flow

### Clerk Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

1. SIGN UP FLOW
────────────────
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  Clerk   │───▶│ Clerk    │───▶│ Convex   │
│  Sign Up │    │  OAuth   │    │  DB      │    │ Users    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
    │                                                      │
    │      Create Account                                  │ Create User Record
    │      (Google/Email)                                 │
    │                                                      ▼
    │                                              ┌──────────────┐
    └─────────────────────────────────────────────▶│  Dashboard   │
                                                 └──────────────┘

2. SIGN IN FLOW
────────────────
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  Clerk   │───▶│ Session  │───▶│  App     │
│  Login   │    │ Verify   │    │  Token   │    │ Access   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

3. PROTECTED ROUTE FLOW
────────────────────────
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│ Clerk    │───▶│ Auth     │───▶│ Resource │
│ Request  │    │  Check   │    │  OK?     │    │ Response │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                   │
                            ┌──────┴──────┐
                            │             │
                           Yes           No
                            │             │
                            ▼             ▼
                    ┌──────────┐   ┌──────────────┐
                    │ Continue │   │  Redirect    │
                    │ Request  │   │  to Login    │
                    └──────────┘   └──────────────┘
```

### Session Management

| Aspect | Implementation |
|--------|---------------|
| Token Type | JWT (short-lived) + Refresh Token (long-lived) |
| Token Expiry | Access Token: 24 hours |
| Refresh | Automatic via Clerk SDK |
| Storage | HTTP-only cookies |
| Logout | Clear all tokens + server-side invalidation |

---

## 2.5 Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VERCEL DEPLOYMENT                               │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   Git Repository    │
                    │   (GitHub/GitLab)   │
                    └──────────┬──────────┘
                               │ Push/Merge
                               ▼
                    ┌─────────────────────┐
                    │  Vercel CI/CD      │
                    │  Pipeline          │
                    ├─────────────────────┤
                    │ • Install deps     │
                    │ • TypeScript check │
                    │ • ESLint           │
                    │ • Build            │
                    │ • Deploy preview   │
                    └──────────┬──────────┘
                               │ (Production)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            EDGE NETWORK                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Mumbai     │  │  Bangalore   │  │   Delhi     │  │  Singapore  │    │
│  │  Edge       │  │  Edge        │  │  Edge       │  │  Edge       │    │
│  │  (Asia)     │  │  (Asia)      │  │  (Asia)     │  │  (Asia)     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICES                                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Convex     │  │    Clerk     │  │   Vercel     │                  │
│  │  Database    │  │   Auth      │  │   Analytics  │                  │
│  │  (US East)   │  │  (Global)    │  │  (Built-in)  │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Environment Configuration

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | preview-[random].vercel.app | PR previews |
| Production | falkoncare.com | Live production |

### Environment Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# SEO
NEXT_PUBLIC_SITE_URL=https://falkoncare.com
```

---

# 3. UI/UX Design

## 3.1 Design Principles

### Core Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Mobile-First** | Design for mobile, then scale up |
| **Clarity** | Clear hierarchy, intuitive navigation |
| **Consistency** | Uniform patterns across all screens |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Performance** | Fast load times, smooth animations |
| **Trust** | Professional appearance, clear CTAs |

### Design Language

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DESIGN PRINCIPLES                                │
└─────────────────────────────────────────────────────────────────────────┘

1. VISUAL HIERARCHY
   • Primary actions are prominent (buttons, CTAs)
   • Secondary actions are subtle (links, ghost buttons)
   • Content is organized with clear spacing and alignment

2. CONSISTENT SPACING
   • 4px base unit (0.25rem)
   • Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
   • Consistent padding in cards: 24px
   • Consistent gap in grids: 16-24px

3. TYPOGRAPHY SCALE
   • H1: 3rem (48px) - Hero headlines
   • H2: 2.25rem (36px) - Section titles
   • H3: 1.5rem (24px) - Card titles
   • H4: 1.25rem (20px) - Subheadings
   • Body: 1rem (16px) - Default text
   • Small: 0.875rem (14px) - Supporting text
   • Caption: 0.75rem (12px) - Labels

4. VISUAL BALANCE
   • Cards have equal visual weight
   • White space used generously
   • Images are high quality and relevant
   • Icons are consistent in size and style
```

---

## 3.2 Color Palette

### Primary Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Primary | `#0284c7` | `210, 100%, 49%` | Main brand color, CTAs, links |
| Primary Dark | `#0369a1` | `204, 100%, 39%` | Hover states, emphasis |
| Primary Light | `#e0f2fe` | `199, 100%, 95%` | Backgrounds, highlights |

### Secondary Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Accent | `#0d9488` | `173, 58%, 39%` | Secondary actions, success |
| Accent Light | `#ccfbf1` | `162, 76%, 93%` | Accent backgrounds |

### Neutral Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Background | `#ffffff` | `0, 0%, 100%` | Page background |
| Surface | `#f8fafc` | `210, 40%, 98%` | Card backgrounds |
| Border | `#e2e8f0` | `214, 32%, 91%` | Card borders, dividers |
| Muted | `#f1f5f9` | `215, 20%, 95%` | Disabled states |
| Text Primary | `#0f172a` | `222, 47%, 11%` | Headings, body |
| Text Secondary | `#64748b` | `215, 16%, 47%` | Supporting text |
| Text Muted | `#94a3b8` | `213, 27%, 69%` | Placeholder text |

### Semantic Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Success | `#16a34a` | `142, 71%, 45%` | Success states, confirmations |
| Warning | `#ca8a04` | `43, 80%, 44%` | Warnings, alerts |
| Error | `#dc2626` | `0, 84%, 60%` | Errors, destructive actions |
| Info | `#0284c7` | `210, 100%, 49%` | Information |

### Dark Mode Support

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| `#ffffff` | `#0f172a` | Background |
| `#f8fafc` | `#1e293b` | Surface |
| `#e2e8f0` | `#334155` | Border |
| `#0f172a` | `#f8fafc` | Text |

### Color Usage Guidelines

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           COLOR USAGE                                    │
└─────────────────────────────────────────────────────────────────────────┘

PRIMARY COLOR (Blue - Trust & Professionalism)
├── Primary Button: bg-primary text-primary-foreground
├── Links: text-primary
├── Active States: ring-primary
├── Progress Bars: bg-primary
└── Focus Rings: ring-primary/50

ACCENT COLOR (Teal - Growth & Health)
├── Success Messages: bg-accent/10
├── Checkmarks: text-success
├── Confirmation States: text-success
└── Secondary CTAs: bg-accent

SEMANTIC COLORS
├── Success: Green for positive outcomes
├── Warning: Amber for caution states
├── Error: Red for errors and destructive actions
└── Info: Blue for informational content

NEUTRAL COLORS
├── Background: Page background color
├── Surface: Card and container backgrounds
├── Border: Dividers and card borders
└── Text: Primary, secondary, muted hierarchy
```

---

## 3.3 Typography

### Font Families

| Purpose | Font | Weights | Fallback |
|---------|------|---------|----------|
| Headings | Poppins | 400, 500, 600, 700, 800 | system-ui, sans-serif |
| Body | Roboto | 300, 400, 500, 700 | system-ui, sans-serif |

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 | 3rem / 48px | 700 | 1.2 | -0.02em |
| H2 | 2.25rem / 36px | 700 | 1.25 | -0.01em |
| H3 | 1.5rem / 24px | 600 | 1.3 | 0 |
| H4 | 1.25rem / 20px | 600 | 1.4 | 0 |
| H5 | 1.125rem / 18px | 500 | 1.4 | 0 |
| Body Large | 1.125rem / 18px | 400 | 1.6 | 0 |
| Body | 1rem / 16px | 400 | 1.6 | 0 |
| Body Small | 0.875rem / 14px | 400 | 1.5 | 0 |
| Caption | 0.75rem / 12px | 400 | 1.4 | 0.02em |
| Overline | 0.75rem / 12px | 500 | 1.4 | 0.1em |

### Font Usage in Components

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TYPOGRAPHY EXAMPLES                            │
└─────────────────────────────────────────────────────────────────────────┘

HERO SECTION
┌─────────────────────────────────────────────────────────────────────────┐
│  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">           │
│    Professional Water Tank Cleaning Service                             │
│  </h1>                                                                  │
│  <p className="text-lg text-muted-foreground">                        │
│    Expert services in Delhi NCR...                                      │
│  </p>                                                                   │
└─────────────────────────────────────────────────────────────────────────┘

CARD TITLE
┌─────────────────────────────────────────────────────────────────────────┐
│  <h3 className="text-xl font-semibold text-foreground">               │
│    Water Tank Cleaning                                                   │
│  </h3>                                                                  │
│  <p className="text-sm text-muted-foreground">                         │
│    Professional cleaning for residential...                             │
│  </p>                                                                   │
└─────────────────────────────────────────────────────────────────────────┘

BUTTON TEXT
┌─────────────────────────────────────────────────────────────────────────┐
│  <Button className="bg-primary text-primary-foreground">                │
│    Book Now                                                             │
│  </Button>                                                              │
│                                                                         │
│  <Button variant="outline" className="border-primary text-primary">    │
│    View Services                                                         │
│  </Button>                                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3.4 Component Design

### Button Component

| Variant | Usage | Styles |
|---------|-------|--------|
| Primary | Main CTAs | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Secondary | Secondary actions | `bg-secondary text-secondary-foreground` |
| Outline | Alternative actions | `border border-input bg-background` |
| Ghost | Subtle actions | `hover:bg-accent` |
| Destructive | Delete/Cancel | `bg-destructive text-destructive-foreground` |

### Card Component

| State | Usage | Styles |
|-------|-------|--------|
| Default | Normal card | `bg-card border-border` |
| Hover | Interactive card | `hover:border-primary/30 hover:shadow-lg` |
| Selected | Selected option | `border-primary` |

### Input Component

| State | Usage | Styles |
|-------|-------|--------|
| Default | Normal input | `border-input bg-background` |
| Focus | Focused input | `ring-2 ring-primary ring-offset-2` |
| Error | Invalid input | `border-destructive focus:ring-destructive` |
| Disabled | Disabled input | `opacity-50 cursor-not-allowed` |

---

## 3.5 User Flow

### Customer Booking Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER BOOKING FLOW                               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Home    │───▶│ Services │───▶│  Select  │───▶│  Book    │
│  Page    │    │  Page    │    │ Service  │    │  Form    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                   │
                                                   ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Track   │◀───│  Booking │◀───│ Payment  │◀───│  Confirm │
│  Status  │    │  Details │    │  Page    │    │  Page    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │
     │           ┌──────────┐
     └──────────▶│  Rating  │
                  │  Page    │
                  └──────────┘

STEP DETAILS:
─────────────
1. Home Page → Browse services, view pricing
2. Services Page → Select service category
3. Service Detail → Choose tank size, add-ons
4. Booking Form → Enter address, select date/time
5. Payment → Complete payment (wallet/cash)
6. Confirmation → Booking confirmed, email sent
7. Tracking → Real-time status updates
8. Rating → Rate service experience
```

### Admin Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ADMIN WORKFLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Admin   │───▶│  View    │───▶│  Update  │───▶│  Notify  │
│  Login   │    │ Bookings │    │  Status  │    │ Customer │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                               │
                    ┌──────────┐    ┌──────────┤
                    │  Assign  │◀───│  Accept  │
                    │  Staff   │    │ Booking  │
                    └──────────┘    └──────────┘
```

---

## 3.6 Accessibility

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | 4.5:1 minimum for normal text |
| Focus Indicators | Visible focus rings on all interactive elements |
| Keyboard Navigation | Full keyboard support with Tab navigation |
| Screen Reader | ARIA labels and roles |
| Reduced Motion | Respects `prefers-reduced-motion` |
| Touch Targets | Minimum 44x44px touch targets |

### ARIA Implementation

```tsx
// Button with ARIA
<Button
  aria-label="Book water tank cleaning service"
  aria-describedby="service-description"
>
  Book Now
</Button>

// Card with ARIA
<Card
  role="article"
  aria-labelledby="card-title"
  aria-describedby="card-description"
>
  <CardTitle id="card-title">Service Name</CardTitle>
  <CardDescription id="card-description">Service description</CardDescription>
</Card>

// Status Badge with ARIA
<StatusBadge
  status="confirmed"
  aria-label="Booking status: Confirmed"
/>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between elements |
| Enter | Activate button/link |
| Escape | Close modal/dropdown |
| Space | Toggle checkbox/button |

---

# 4. Wireframes (Text Wireframes)

## 4.1 Landing Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FALKON CARE LANDING PAGE                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [Logo]  Home  Services  About  Contact        [Login] [Book Now] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │    🦅 FALKON CARE                                              │   │
│  │                                                                 │   │
│  │    Professional Water Tank Cleaning                            │   │
│  │    Service in Delhi NCR                                       │   │
│  │                                                                 │   │
│  │    Expert services in Delhi, Noida, Gurgaon,                   │   │
│  │    Faridabad & Ghaziabad. Certified technicians...            │   │
│  │                                                                 │   │
│  │    [Book Now ➜]  [View Services]                               │   │
│  │                                                                 │   │
│  │    ⭐⭐⭐⭐⭐ 4.9/5 | 500+ Reviews                              │   │
│  │                                                                 │   │
│  │                          ┌──────────────────────┐               │   │
│  │                          │  Professional Tank   │               │   │
│  │                          │  Cleaning Image      │               │   │
│  │                          └──────────────────────┘               │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        OUR SERVICES                             │   │
│  │                                                                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│   │
│  │  │  💧        │  │  🔧        │  │  🏠        │  │  ⚙️        ││   │
│  │  │  Water     │  │  Pipe      │  │  Tank      │  │  Filter    ││   │
│  │  │  Tank      │  │  Services  │  │  Repair    │  │  Service   ││   │
│  │  │  Cleaning  │  │            │  │            │  │            ││   │
│  │  │  ₹499+     │  │  ₹299+     │  │  ₹399+     │  │  ₹249+     ││   │
│  │  │  [Book]    │  │  [Book]    │  │  [Book]    │  │  [Book]    ││   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     WHY CHOOSE FALKON CARE                       │   │
│  │                                                                 │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │   │
│  │  │   🛡️          │  │   ⚡           │  │   ✅           │      │   │
│  │  │  Certified    │  │  Same-Day     │  │  100% Safe    │      │   │
│  │  │  Professionals│  │  Service      │  │  & Hygienic   │      │   │
│  │  └───────────────┘  └───────────────┘  └───────────────┘      │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  © 2026 Falkon Care | Falkon Futurex Pvt Ltd | Delhi NCR       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Login Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              LOGIN PAGE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                                                                         │
│                        ┌─────────────────────┐                          │
│                        │   🦅 FALKON CARE    │                          │
│                        └─────────────────────┘                          │
│                                                                         │
│                           Welcome Back!                                 │
│                      Sign in to your account                            │
│                                                                         │
│                    ┌─────────────────────────┐                          │
│                    │  📧 Email Address       │                          │
│                    │  ─────────────────────  │                          │
│                    └─────────────────────────┘                          │
│                                                                         │
│                    ┌─────────────────────────┐                          │
│                    │  🔒 Password            │                          │
│                    │  ─────────────────────  │                          │
│                    │                         │                          │
│                    └─────────────────────────┘                          │
│                                                                         │
│                    [   Sign In   ]                                     │
│                                                                         │
│                        Forgot Password?                                 │
│                                                                         │
│                    ─────────────── OR ───────────────                    │
│                                                                         │
│                    ┌─────────────────────────┐                          │
│                    │  🔵 Continue with Google│                          │
│                    └─────────────────────────┘                          │
│                                                                         │
│                    ───────────────────────────────                      │
│                    Don't have an account?                               │
│                    [   Create Account   ]                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Customer Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER DASHBOARD                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────┬──────────────────────────────────────────────────────┐│
│  │            │  🔔 Notifications                         👤 Priya    ││
│  │  🦅 FALKON │                                                      ││
│  │            │  ┌──────────────────────────────────────────────┐  ││
│  │  ────────  │  │  Welcome back, Priya!                         │  ││
│  │            │  │  Your water tanks are in good hands.           │  ││
│  │  📊 Home   │  │  [Book New Service ➜]                         │  ││
│  │  📅 Bookings│  └──────────────────────────────────────────────┘  ││
│  │  📋 Services│                                                      ││
│  │  👛 Wallet │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐           ││
│  │  👤 Profile│  │Active │ │Completed│ │Wallet │ │Total  │           ││
│  │  🔔 Notifications│ 2  │ │   5    │ │ ₹500  │ │₹4,500 │           ││
│  │            │  └───────┘ └───────┘ └───────┘ └───────┘           ││
│  │  ────────  │                                                      ││
│  │            │  Upcoming Bookings                                  ││
│  │  🚪 Logout │  ┌──────────────────────────────────────────────┐  ││
│  │            │  │ 📅 Tank Cleaning - Mar 28, 10:00 AM         │  ││
│  │            │  │    South Delhi | ₹799 | Status: Confirmed   │  ││
│  │            │  │    [View Details]                           │  ││
│  │            │  └──────────────────────────────────────────────┘  ││
│  │            │  ┌──────────────────────────────────────────────┐  ││
│  │            │  │ 📅 Pipe Service - Mar 30, 2:00 PM            │  ││
│  │            │  │    Gurgaon | ₹499 | Status: Pending          │  ││
│  │            │  │    [View Details]                           │  ││
│  │            │  └──────────────────────────────────────────────┘  ││
│  │            │                                                      ││
│  │            │  Quick Actions                                      ││
│  │            │  ┌──────────┐ ┌──────────┐ ┌──────────┐             ││
│  │            │  │ Book     │ │ Add     │ │ My      │             ││
│  │            │  │ Service  │ │ Money   │ │ Profile │             ││
│  │            │  └──────────┘ └──────────┘ └──────────┘             ││
│  │            │                                                      ││
│  └────────────┴──────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.4 Booking Form Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BOOKING FORM PAGE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────┬──────────────────────────────────────────────────────┐│
│  │            │  ← Back to Services                    👤 Priya     ││
│  │  🦅 FALKON │                                                      ││
│  │            │  Book Water Tank Cleaning                             ││
│  │  ────────  │                                                      ││
│  │  📊 Home   │  ┌──────────────────────────────────────────────────┐│
│  │  📅 Bookings│  │  SELECT SERVICE                                  ││
│  │  📋 Services│  │                                                  ││
│  │  👛 Wallet │  │  ○ Basic Cleaning      ₹499                      ││
│  │  👤 Profile│  │    Standard tank cleaning                        ││
│  │            │  │  ● Deep Cleaning (Popular) ₹799                  ││
│  │            │  │    Thorough cleaning with sanitization           ││
│  │  ────────  │  │  ○ Premium Package       ₹1,299                  ││
│  │            │  │    UV treatment + warranty                       ││
│  │  🚪 Logout │  └──────────────────────────────────────────────────┘│
│  │            │                                                      ││
│  │            │  ┌──────────────────────────────────────────────────┐│
│  │            │  │  TANK DETAILS                                   ││
│  │            │  │                                                  ││
│  │            │  │  Tank Size:    [500-1000L ▼]                     ││
│  │            │  │                                                  ││
│  │            │  │  Tank Type:    ○ Overhead ● Underground ○ Sump    ││
│  │            │  └──────────────────────────────────────────────────┘│
│  │            │                                                      ││
│  │            │  ┌──────────────────────────────────────────────────┐│
│  │            │  │  SERVICE ADDRESS                                ││
│  │            │  │                                                  ││
│  │            │  │  📍 Address:                                    ││
│  │            │  │  123 Main Street, South Delhi                  ││
│  │            │  │  [Change Address]                               ││
│  │            │  └──────────────────────────────────────────────────┘│
│  │            │                                                      ││
│  │            │  ┌──────────────────────────────────────────────────┐│
│  │            │  │  SCHEDULE                                      ││
│  │            │  │                                                  ││
│  │            │  │  Date: [March 28, 2026 ▼]                       ││
│  │            │  │                                                  ││
│  │            │  │  Time Slot:                                     ││
│  │            │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                  ││
│  │            │  │  │ 9AM│ │10AM│ │11AM│ │12PM│                  ││
│  │            │  │  └────┘ └────┘ └────┘ └────┘                  ││
│  │            │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                  ││
│  │            │  │  │ 2PM│ │ 3PM│ │ 4PM│ │ 5PM│                  ││
│  │            │  │  └────┘ └────┘ └────┘ └────┘                  ││
│  │            │  └──────────────────────────────────────────────────┘│
│  │            │                                                      ││
│  │            │  ┌──────────────────────────────────────────────────┐│
│  │            │  │  ORDER SUMMARY                                  ││
│  │            │  │                                                  ││
│  │            │  │  Deep Cleaning:            ₹799                  ││
│  │            │  │  Tank Size (1000L):       Included              ││
│  │            │  │  ─────────────────────────────                 ││
│  │            │  │  Total:                  ₹799                  ││
│  │            │  │                                                  ││
│  │            │  │  Wallet Balance: ₹500                          ││
│  │            │  │  [Confirm Booking - Pay ₹799]                  ││
│  │            │  └──────────────────────────────────────────────────┘│
│  │            │                                                      ││
│  └────────────┴──────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.5 Admin Panel

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ADMIN PANEL                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────┬──────────────────────────────────────────────────────┐│
│  │            │  Admin Dashboard              🔔 Notifications  👤 ││
│  │  🦅 FALKON │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐ ││
│  │  ────────  │  │  📊 OVERVIEW                                    │ ││
│  │            │  │                                                 │ ││
│  │  📊 Dashboard│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐      │ ││
│  │  📅 Bookings│  │  │Today's│ │Monthly│ │Revenue│ │Pending│      │ ││
│  │  👥 Staff   │  │  │Bookings│ │Bookings│ │This Mo│ │Tasks  │      │ ││
│  │  📋 Services│  │  │  15   │ │  342  │ │₹2,45,000│ │  8   │      │ ││
│  │  👥 Customers│ │  └───────┘ └───────┘ └───────┘ └───────┘      │ ││
│  │  📈 Reports │  │                                                 │ ││
│  │            │  │  Revenue Chart [████████████████████]           │ ││
│  │            │  │                                                 │ ││
│  │            │  └────────────────────────────────────────────────┘ ││
│  │            │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐ ││
│  │            │  │  RECENT BOOKINGS                               │ ││
│  │            │  │  ┌──────────────────────────────────────────┐  │ ││
│  │            │  │  │ Customer     │ Service │ Amount │ Status │  │ ││
│  │            │  │  ├──────────────────────────────────────────┤  │ ││
│  │            │  │  │ Priya S.     │ Cleaning│ ₹799   │ ● Pnding│  │ ││
│  │            │  │  │ Rajesh K.    │ Repair  │ ₹499   │ ● Conf. │  │ ││
│  │            │  │  │ Amit G.      │ Cleaning│ ₹1,299 │ ● Done  │  │ ││
│  │            │  │  │ Neha M.     │ Filter  │ ₹249   │ ● Cancel│  │ ││
│  │            │  │  └──────────────────────────────────────────┘  │ ││
│  │            │  │                                                 │ ││
│  │            │  │  [Confirm] [Cancel] [View All]                 │ ││
│  │            │  └────────────────────────────────────────────────┘ ││
│  │            │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐ ││
│  │            │  │  STAFF AVAILABILITY                            │ ││
│  │            │  │  ┌──────────────────────────────────────────┐  │ ││
│  │            │  │  │ 👤 Ramesh K.  ● Available    ⭐4.8  45jobs│  │ ││
│  │            │  │  │ 👤 Suresh P.  ● On Job      ⭐4.9  52jobs│  │ ││
│  │            │  │  │ 👤 Vijay S.   ○ Off Duty    ⭐4.7  38jobs│  │ ││
│  │            │  │  └──────────────────────────────────────────┘  │ ││
│  │            │  └────────────────────────────────────────────────┘ ││
│  │            │                                                       ││
│  └────────────┴───────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.6 Profile Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PROFILE PAGE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────┬──────────────────────────────────────────────────────┐│
│  │            │  ← Back to Dashboard              👤 Priya          ││
│  │  🦅 FALKON │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐  ││
│  │  ────────  │  │                                                    │  ││
│  │  📊 Home   │  │              ┌────────────┐                     │  ││
│  │  📅 Bookings│  │              │    👤      │                     │  ││
│  │  📋 Services│  │              │  Profile   │                     │  ││
│  │  👛 Wallet │  │              │   Photo    │                     │  ││
│  │  👤 Profile│  │              └────────────┘                     │  ││
│  │            │  │                                                    │  ││
│  │  ────────  │  │            Priya Sharma                          │  ││
│  │            │  │            Member since Jan 2026                 │  ││
│  │  🚪 Logout │  │                                                    │  ││
│  │            │  └────────────────────────────────────────────────┘  ││
│  │            │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐  ││
│  │            │  │  PERSONAL INFORMATION                           │  ││
│  │            │  │                                                    │  ││
│  │            │  │  Full Name                                       │  ││
│  │            │  │  ┌──────────────────────────────────────────┐   │  ││
│  │            │  │  │ Priya Sharma                              │   │  ││
│  │            │  │  └──────────────────────────────────────────┘   │  ││
│  │            │  │                                                    │  ││
│  │            │  │  Email Address                                   │  ││
│  │            │  │  ┌──────────────────────────────────────────┐   │  ││
│  │            │  │  │ priya@example.com                       │   │  ││
│  │            │  │  └──────────────────────────────────────────┘   │  ││
│  │            │  │                                                    │  ││
│  │            │  │  Phone Number                                    │  ││
│  │            │  │  ┌──────────────────────────────────────────┐   │  ││
│  │            │  │  │ +91 98765 43210                          │   │  ││
│  │            │  │  └──────────────────────────────────────────┘   │  ││
│  │            │  │                                                    │  ││
│  │            │  │  [Save Changes]                                  │  ││
│  │            │  └────────────────────────────────────────────────┘  ││
│  │            │                                                       ││
│  │            │  ┌────────────────────────────────────────────────┐  ││
│  │            │  │  SAVED ADDRESSES                                │  ││
│  │            │  │                                                    │  ││
│  │            │  │  ┌──────────────────────────────────────────┐   │  ││
│  │            │  │  │ 🏠 Home                          [Edit]│   │  ││
│  │            │  │  │ 123 Main Street, South Delhi, 110001   │   │  ││
│  │            │  │  │ +91 98765 43210                          │   │  ││
│  │            │  │  └──────────────────────────────────────────┘   │  ││
│  │            │  │                                                    │  ││
│  │            │  │  ┌──────────────────────────────────────────┐   │  ││
│  │            │  │  │ 🏢 Office                    [Edit] [Delete]│  │  ││
│  │            │  │  │ 456 Business Park, Gurgaon, 122001       │   │  ││
│  │            │  │  │ +91 98765 43210                          │   │  ││
│  │            │  │  └──────────────────────────────────────────┘   │  ││
│  │            │  │                                                    │  ││
│  │            │  │  [+ Add New Address]                             │  ││
│  │            │  └────────────────────────────────────────────────┘  ││
│  │            │                                                       ││
│  └────────────┴───────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 5. UI Components List

## 5.1 Buttons

### Button Variants

| Variant | Usage | CSS Classes |
|---------|-------|------------|
| Primary | Main CTAs | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Secondary | Secondary actions | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| Outline | Alternative actions | `border border-input bg-background hover:bg-accent` |
| Ghost | Subtle actions | `hover:bg-accent hover:text-accent-foreground` |
| Destructive | Delete actions | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| Link | Links | `text-primary underline-offset-4 hover:underline` |

### Button Sizes

| Size | Height | Usage |
|------|--------|-------|
| `sm` | 32px | Compact buttons, table actions |
| `default` | 40px | Standard buttons |
| `lg` | 48px | Hero CTAs, important actions |
| `icon` | 40px | Icon-only buttons |

### Button States

| State | Appearance |
|-------|------------|
| Default | Primary background, white text |
| Hover | Darker background (10% darker) |
| Active | Even darker (20% darker) |
| Disabled | 50% opacity, cursor-not-allowed |
| Loading | Spinner icon, disabled interaction |

### Button Examples

```tsx
// Primary Button
<Button className="bg-primary text-primary-foreground">
  Book Now
</Button>

// Outline Button
<Button variant="outline" className="border-primary text-primary">
  View Services
</Button>

// Icon Button
<Button variant="ghost" size="icon">
  <Icons.close className="w-4 h-4" />
</Button>

// Loading Button
<Button disabled>
  <Icons.loader className="w-4 h-4 animate-spin mr-2" />
  Loading...
</Button>
```

---

## 5.2 Forms

### Input Component

| State | Usage |
|-------|-------|
| Default | Standard text input with border |
| Focus | Ring effect with primary color |
| Error | Red border with error message |
| Disabled | Grayed out with reduced opacity |

### Form Components

| Component | Description | Props |
|-----------|-------------|-------|
| Input | Text input field | `type`, `placeholder`, `value`, `onChange` |
| Textarea | Multi-line text | `rows`, `maxLength`, `resize` |
| Select | Dropdown selection | `options`, `value`, `onChange` |
| Checkbox | Binary choice | `checked`, `onChange`, `label` |
| Radio | Single selection | `options`, `selected`, `onChange` |
| Switch | Toggle on/off | `checked`, `onChange` |
| Label | Form field label | `htmlFor`, `required` |

### Form Validation

| Rule | Implementation |
|------|----------------|
| Required | `required` prop, error message |
| Email | Email regex validation |
| Phone | Indian phone number format |
| Min Length | Zod schema validation |
| Custom | Zod resolver with custom validators |

### Form Example

```tsx
<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <div>
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        {...register("email")}
      />
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
    </div>
    
    <div>
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="+91 XXXXX XXXXX"
        {...register("phone")}
      />
    </div>
    
    <Button type="submit">Submit</Button>
  </div>
</form>
```

---

## 5.3 Tables

### Table Component

| Feature | Implementation |
|---------|----------------|
| Header | Sticky header on scroll |
| Rows | Alternating colors (optional) |
| Pagination | Page numbers with prev/next |
| Sorting | Column header sort indicators |
| Selection | Checkbox for bulk actions |

### Table Variants

| Variant | Usage |
|---------|-------|
| Default | Standard data table |
| Bordered | Visible borders between cells |
| Striped | Alternating row colors |
| Compact | Reduced padding for dense data |

### Table Example

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Customer</TableHead>
      <TableHead>Service</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {bookings.map((booking) => (
      <TableRow key={booking._id}>
        <TableCell className="font-medium">
          {booking.userId}
        </TableCell>
        <TableCell>{booking.serviceName}</TableCell>
        <TableCell>{formatDate(booking.date)}</TableCell>
        <TableCell>₹{booking.amount}</TableCell>
        <TableCell>
          <StatusBadge status={booking.status} />
        </TableCell>
        <TableCell className="flex gap-2">
          <Button size="sm" variant="ghost">View</Button>
          <Button size="sm" variant="ghost">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 5.4 Cards

### Card Variants

| Variant | Usage | Styles |
|---------|-------|--------|
| Default | Standard card | `bg-card border-border` |
| Elevated | Interactive card | `hover:shadow-lg` |
| Bordered | Minimal card | `border-2` |
| Accent | Highlighted card | `border-primary` |

### Card Components

| Component | Description |
|-----------|-------------|
| Card | Container component |
| CardHeader | Card title and description |
| CardTitle | Card heading |
| CardDescription | Supporting text |
| CardContent | Main card content |
| CardFooter | Action buttons |

### Card Example

```tsx
<Card className="hover:border-primary/30 transition-all">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Water Tank Cleaning</CardTitle>
      <Badge variant="secondary">Popular</Badge>
    </div>
    <CardDescription>
      Professional cleaning for residential tanks
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <Icons.check className="w-4 h-4 text-primary" />
          <span>Deep cleaning</span>
        </li>
        <li className="flex items-center gap-2">
          <Icons.check className="w-4 h-4 text-primary" />
          <span>Sanitization</span>
        </li>
      </ul>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">₹799</span>
        <Button>Book Now</Button>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 5.5 Navigation Bar

### Header Component

| Element | Description |
|---------|-------------|
| Logo | Brand logo with link to home |
| Nav Links | Main navigation items |
| Auth Buttons | Login/Sign up or User menu |
| Mobile Menu | Hamburger menu for mobile |

### Header Variants

| Variant | Usage |
|---------|-------|
| Transparent | Over hero images |
| Solid | White background |
| Sticky | Fixed on scroll |
| Dark | Dark theme variant |

### Header Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Hamburger menu |
| Tablet (768-1024px) | Condensed nav |
| Desktop (> 1024px) | Full navigation |

### Header Example

```tsx
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
  <nav className="container flex items-center justify-between h-16">
    <Link href="/" className="flex items-center gap-2">
      <Icons.falcon className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold">Falkon Care</span>
    </Link>
    
    <div className="hidden md:flex items-center gap-8">
      <Link href="/" className="text-foreground hover:text-primary">
        Home
      </Link>
      <Link href="/services" className="text-foreground hover:text-primary">
        Services
      </Link>
      <Link href="/about" className="text-foreground hover:text-primary">
        About
      </Link>
      <Link href="/contact" className="text-foreground hover:text-primary">
        Contact
      </Link>
    </div>
    
    <div className="flex items-center gap-4">
      <Button variant="outline" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Book Now</Link>
      </Button>
    </div>
  </nav>
</header>
```

---

## 5.6 Sidebar

### Sidebar Component

| Feature | Description |
|---------|-------------|
| Fixed Position | Always visible on desktop |
| Collapsible | Toggle between expanded/collapsed |
| Responsive | Slides in from left on mobile |
| Role-Based | Different items for admin/user |

### Sidebar Navigation

| Role | Navigation Items |
|------|-----------------|
| Customer | Dashboard, Bookings, Services, Wallet, Profile, Notifications |
| Admin | Dashboard, Bookings, Staff, Services, Customers, Reports |

### Sidebar States

| State | Width | Behavior |
|-------|-------|----------|
| Expanded | 256px (w-64) | Full labels visible |
| Collapsed | 64px (w-16) | Icons only |
| Mobile | 100% | Full-screen overlay |

### Sidebar Example

```tsx
<aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r">
  <div className="h-16 flex items-center px-4 border-b">
    <Icons.falcon className="w-8 h-8 text-primary" />
    <span className="ml-2 text-xl font-bold">Falkon Care</span>
  </div>
  
  <nav className="p-4">
    <ul className="space-y-2">
      {navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
</aside>
```

---

## 5.7 Modals

### Modal Component

| Feature | Description |
|---------|-------------|
| Overlay | Dark backdrop (50% opacity) |
| Animation | Fade in and scale up |
| Close | Click outside, X button, Escape key |
| Focus Trap | Keyboard focus stays within modal |

### Modal Variants

| Variant | Usage |
|---------|-------|
| Default | Standard modal dialog |
| Alert | Confirmation dialogs |
| Drawer | Slide-in panel from side |
| Sheet | Bottom sheet on mobile |

### Modal Sizes

| Size | Width | Usage |
|------|-------|-------|
| `sm` | 320px | Simple confirmations |
| `default` | 500px | Standard dialogs |
| `lg` | 700px | Complex forms |
| `xl` | 900px | Data tables, details |
| `full` | 100vw | Full-screen modal |

### Modal Example

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Confirm Booking</DialogTitle>
      <DialogDescription>
        Are you sure you want to book this service?
      </DialogDescription>
    </DialogHeader>
    
    <div className="py-4">
      <p>Service: Water Tank Cleaning</p>
      <p>Date: March 28, 2026</p>
      <p>Amount: ₹799</p>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm Booking
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 5.8 Notifications

### Notification Types

| Type | Usage | Icon | Color |
|------|-------|------|-------|
| Success | Positive feedback | `check-circle` | Success green |
| Error | Error messages | `x-circle` | Error red |
| Warning | Caution alerts | `alert-triangle` | Warning amber |
| Info | Information | `info` | Primary blue |

### Toast Notifications

| Position | Usage |
|----------|-------|
| Top-right | Standard notifications |
| Bottom-right | Confirmation messages |
| Top-center | Critical alerts |

### Notification Component

```tsx
// Success Toast
toast.success("Booking confirmed!", {
  description: "We'll send you a confirmation email shortly.",
  action: {
    label: "View Booking",
    onClick: () => router.push("/dashboard/bookings"),
  },
});

// Error Toast
toast.error("Payment failed", {
  description: "Please check your wallet balance and try again.",
});

// Loading Toast
const toastId = toast.loading("Processing payment...");
// Later: toast.success("Payment successful!", { id: toastId });
```

---

# 6. Development Roadmap

## Phase 1 – MVP (Current)

**Timeline:** January 2026 - March 2026  
**Goal:** Launch basic booking functionality

### Deliverables

| Feature | Status | Description |
|---------|--------|-------------|
| Landing Page | ✅ Complete | SEO-optimized marketing page |
| User Authentication | ✅ Complete | Clerk-based auth with email/OAuth |
| Service Listing | ✅ Complete | Browse available services |
| Booking Flow | ✅ Complete | Create and manage bookings |
| Customer Dashboard | ✅ Complete | View bookings, wallet, profile |
| Admin Panel | ✅ Complete | Basic booking management |
| Convex Backend | ✅ Complete | Database and API functions |

### Success Metrics

- 500+ registered users
- 100+ successful bookings
- 4.5+ average rating
- < 5 second page load time

---

## Phase 2 – Beta

**Timeline:** April 2026 - June 2026  
**Goal:** Enhance features and improve UX

### Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Payment Gateway | P0 | Razorpay integration for payments |
| Real-time Notifications | P0 | Push notifications for booking updates |
| SMS/WhatsApp Alerts | P1 | Order status updates via messaging |
| Booking Rescheduling | P1 | Allow date/time changes |
| Review System | P1 | Star ratings and comments |
| Before/After Photos | P2 | Upload photos for quality assurance |
| Staff Mobile App | P2 | Technician assignment and tracking |

### Success Metrics

- 2,000+ registered users
- 500+ monthly bookings
- 50% repeat booking rate
- < 3 second response time

---

## Phase 3 – Production

**Timeline:** July 2026 - September 2026  
**Goal:** Scale operations and add enterprise features

### Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| AMC Module | P0 | Annual maintenance contracts |
| Loyalty Program | P1 | Points and rewards system |
| Referral System | P1 | Earn credits by referring friends |
| Coupon System | P2 | Discount codes and promotions |
| Advanced Analytics | P2 | Detailed reports and insights |
| Multi-language | P2 | Hindi and regional languages |
| PDF Invoices | P2 | Downloadable invoice generation |

### Success Metrics

- 10,000+ registered users
- 2,000+ monthly bookings
- 60% repeat booking rate
- 4.8+ NPS score

---

## Phase 4 – Scale

**Timeline:** October 2026 - December 2026  
**Goal:** Expand to new markets and platforms

### Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Mobile App (iOS) | P0 | Native iOS application |
| Mobile App (Android) | P0 | Native Android application |
| Real-time Tracking | P1 | Live technician location |
| AI Scheduling | P2 | Optimized booking slots |
| IoT Integration | P2 | Water quality monitoring devices |
| Third-party API | P2 | Integration for property management |
| Multi-city Expansion | P2 | Mumbai, Bangalore, Hyderabad |

### Success Metrics

- 50,000+ registered users
- 10,000+ monthly bookings
- 70% repeat booking rate
- 4.9+ NPS score
- 5+ cities covered

---

## Roadmap Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPMENT ROADMAP                             │
└─────────────────────────────────────────────────────────────────────────┘

2026    Q1 (MVP)      Q2 (Beta)      Q3 (Production)  Q4 (Scale)
        Jan-Mar       Apr-Jun         Jul-Sep           Oct-Dec

User    ████████████
Auth    ████████████
Booking ████████████
Dashboard████████████████████
Admin   ████████████

Payment ████████████████
Notif   ████████████████
Reviews ████████████████
Photos  ████████████████

AMC     ████████████████
Loyalty ████████████████
Referral██████████████████
Analytics██████████████████

Mobile  ██████████████████████████████
Tracking█████████████████████████████
IoT     ███████████████████████████████████
Multi-  ███████████████████████████████████
City

Legend: ██ = Active Development  ▒▒ = Testing/Beta  ░░ = Future
```

---

# 7. Folder Structure

## Frontend Folder Structure

```
falkoncare/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group routes
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   ├── callback/
│   │   │   └── page.tsx        # Auth callback
│   │   ├── check-email/
│   │   │   └── page.tsx        # Email verification
│   │   ├── forgot-password/
│   │   │   └── page.tsx        # Password reset
│   │   └── layout.tsx          # Auth layout
│   │
│   ├── dashboard/               # Customer dashboard
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard home
│   │   ├── bookings/
│   │   │   ├── page.tsx        # Bookings list
│   │   │   └── [bookingId]/
│   │   │       └── page.tsx    # Booking details
│   │   ├── services/
│   │   │   ├── page.tsx        # Services list
│   │   │   └── [serviceId]/
│   │   │       └── page.tsx    # Book service
│   │   ├── wallet/
│   │   │   └── page.tsx        # Wallet management
│   │   ├── profile/
│   │   │   └── page.tsx        # Profile settings
│   │   ├── notifications/
│   │   │   └── page.tsx        # Notifications
│   │   └── layout.tsx          # Dashboard layout
│   │
│   ├── admin/                   # Admin panel
│   │   ├── layout.tsx          # Admin layout
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── bookings/
│   │   │   └── page.tsx        # All bookings
│   │   ├── staff/
│   │   │   └── page.tsx        # Staff management
│   │   ├── services/
│   │   │   └── page.tsx        # Service management
│   │   ├── customers/
│   │   │   └── page.tsx        # Customer management
│   │   └── reports/
│   │       └── page.tsx        # Analytics reports
│   │
│   ├── auth/                    # Legacy auth routes (redirect)
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── sign-in/                 # Clerk sign-in (handled by Clerk)
│   │   └── [[...sign-in]]/
│   │       └── page.tsx
│   │
│   ├── sign-up/                 # Clerk sign-up (handled by Clerk)
│   │   └── [[...sign-up]]/
│   │       └── page.tsx
│   │
│   ├── services/               # Services marketing page
│   │   └── page.tsx
│   │
│   ├── about/                  # About page
│   │   └── page.tsx
│   │
│   ├── careers/                # Careers page
│   │   └── page.tsx
│   │
│   ├── privacy-policy/         # Privacy policy
│   │   └── page.tsx
│   │
│   ├── terms-of-service/      # Terms of service
│   │   └── page.tsx
│   │
│   ├── test/                   # Test pages
│   │   └── page.tsx
│   │
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Landing page (home)
│   ├── robots.ts              # robots.txt
│   └── sitemap.ts             # Sitemap generation
│
├── components/                 # React components
│   ├── ui/                    # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── accordion.tsx
│   │   ├── sheet.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   ├── carousel.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── tooltip.tsx
│   │   └── status-badge.tsx
│   │
│   ├── landing/               # Landing page components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── hero-section.tsx
│   │   ├── services-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── testimonials.tsx
│   │   ├── cta-section.tsx
│   │   └── faq-section.tsx
│   │
│   ├── dashboard/             # Dashboard components
│   │   ├── sidebar.tsx
│   │   ├── top-bar.tsx
│   │   ├── stats-card.tsx
│   │   ├── booking-card.tsx
│   │   ├── booking-form.tsx
│   │   ├── location-picker.tsx
│   │   ├── calendar-picker.tsx
│   │   ├── order-tracking.tsx
│   │   ├── trust-elements.tsx
│   │   ├── pricing-section.tsx
│   │   ├── service-areas.tsx
│   │   └── meta-tags.tsx
│   │
│   ├── booking/               # Booking components
│   │   ├── location-picker.tsx
│   │   └── calendar-picker.tsx
│   │
│   ├── admin/                 # Admin components
│   │   ├── sidebar.tsx
│   │   ├── admin-top-bar.tsx
│   │   ├── analytics-chart.tsx
│   │   └── revenue-metrics.tsx
│   │
│   ├── payment/              # Payment components
│   │   └── payment-methods.tsx
│   │
│   ├── shared/               # Shared components
│   │   └── whatsapp-button.tsx
│   │
│   ├── providers/            # Context providers
│   │   ├── convex-provider.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── icons.tsx             # Icon components
│   └── user-sync.tsx        # User sync component
│
├── lib/                       # Utilities and helpers
│   ├── utils.ts              # Common utilities (cn function)
│   ├── types.ts             # TypeScript type definitions
│   ├── store.ts             # Zustand store
│   ├── mock-data.ts         # Mock data for development
│   ├── calendar-utils.ts    # Calendar helper functions
│   └── local-storage.ts     # LocalStorage utilities
│
├── convex/                   # Convex backend
│   ├── schema.ts            # Database schema
│   ├── bookings.ts          # Booking API functions
│   ├── users.ts            # User API functions
│   ├── auth.config.ts      # Auth configuration
│   ├── http.ts             # HTTP handlers
│   └── _generated/          # Generated types
│
├── public/                   # Static assets
│   ├── images/              # Image assets
│   ├── icons/              # Icon files
│   └── fonts/              # Font files (if any)
│
├── styles/                  # Additional styles
│   └── globals.css         # Global CSS
│
├── .clerk/                  # Clerk configuration
│
├── components.json          # shadcn/ui components config
│
├── next.config.js           # Next.js configuration
├── next.config.mjs          # Next.js ESM config
│
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
│
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
├── package-lock.json       # Lock file
│
├── .env.local               # Environment variables (local)
├── .env.example             # Example env file
│
├── vercel.json              # Vercel configuration
├── convex.json              # Convex configuration
│
├── .gitignore               # Git ignore
├── .npmrc                   # npm configuration
│
└── README.md                # Project readme
```

## Backend (Convex) Structure

```
convex/
├── schema.ts                # Database schema definitions
├── bookings.ts             # Booking mutations and queries
│
├──   ├── create()          # Create new booking
│   ├── getAll()            # Get all bookings (admin)
│   ├── getByUser()         # Get user's bookings
│   ├── getById()           # Get single booking
│   ├── updateStatus()      # Update booking status
│   └── cancel()            # Cancel booking
│
├── users.ts                # User mutations and queries
│
├──   ├── create()          # Create user record
│   ├── getCurrent()        # Get current user
│   ├── update()            # Update user profile
│   └── getByClerkId()      # Get user by Clerk ID
│
├── services.ts             # Service catalog (future)
│
├──   ├── list()            # List all services
│   ├── getById()           # Get service details
│   ├── create()            # Add new service
│   ├── update()            # Update service
│   └── delete()            # Remove service
│
├── staff.ts                # Staff management (future)
│
├──   ├── list()            # List all staff
│   ├── getById()           # Get staff details
│   ├── updateStatus()      # Update availability
│   └── assignBooking()     # Assign to booking
│
├── payments.ts             # Payment processing (future)
│
├──   ├── recharge()         # Wallet recharge
│   ├── deduct()             # Payment deduction
│   └── getHistory()        # Transaction history
│
├── auth.config.ts          # Convex auth configuration
├── http.ts                 # HTTP request handlers
└── _generated/             # Auto-generated types
    ├── api.ts
    ├── dataModel.d.ts
    └── api.d.ts
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with fonts, metadata, providers |
| `app/page.tsx` | Landing page entry point |
| `components/landing/header.tsx` | Main navigation header |
| `components/dashboard/sidebar.tsx` | Dashboard navigation |
| `convex/schema.ts` | Database schema definition |
| `lib/types.ts` | TypeScript interfaces |
| `tailwind.config.js` | Design system configuration |

---

## Deployment Structure

```
Production (Vercel)
├── falkoncare.com (Main)
├── Preview Deployments (PRs)
└── Branch Deployments

Backend (Convex)
├── Convex Cloud (Production)
└── Local Dev (convex dev)

External Services
├── Clerk (Authentication)
└── Vercel Analytics
```

---

## Contributing Guidelines

### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use shadcn/ui components for UI
- Write self-documenting code
- Add comments for complex logic

### Git Workflow

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Run lint and typecheck before PR
4. Request code review
5. Merge after approval

### Testing

- Test all new features locally
- Verify on preview deployment
- Check mobile responsiveness
- Validate accessibility

---

## Support & Contact

| Channel | Details |
|---------|---------|
| **Email** | support@falkoncare.com |
| **Phone** | +91 98765 43210 |
| **Website** | https://falkoncare.com |
| **Address** | South West Delhi, New Delhi - 110001 |

---

*Document generated for Falkon Care - Professional Water Tank Cleaning Service*  
*© 2026 Falkon Futurex Private Limited. All rights reserved.*
