# 🎟️ EventEase — Campus Event Management & Booking Platform

> **"Discover Events. Create Experiences."**  
> A full-stack, enterprise-grade event discovery, management, and atomic seat reservation system built with React 18, Node.js, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=flat&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-8174D8)](LICENSE)
[![Test Suite](https://img.shields.io/badge/Tests-36%20Passed%20(100%25)-success)](#-automated-testing-suite)

---

## 📖 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [Key Capabilities & Role Matrix](#-key-capabilities--role-matrix)
3. [Design System & UI Guidelines](#-design-system--ui-guidelines)
4. [Technology Stack](#-technology-stack)
5. [Architecture & Folder Structure](#-architecture--folder-structure)
6. [Data Models & Schema Architecture](#-data-models--schema-architecture)
7. [The Atomic Booking Engine (Concurrency Safeguards)](#-the-atomic-booking-engine-concurrency-safeguards)
8. [REST API Specification](#-rest-api-specification)
9. [Local Development Quickstart](#-local-development-quickstart)
10. [Automated Testing Suite](#-automated-testing-suite)
11. [Production Deployment Guide (Atlas, Render, Vercel)](#-production-deployment-guide)
12. [Security Architecture & Best Practices](#-security-architecture--best-practices)

---

## 🌟 Executive Summary

**EventEase** is a college event management and registration portal engineered for academic communities. It bridges the gap between campus organizers (student clubs, faculties, symposium leads) and students seeking hackathons, technical workshops, sports tournaments, and cultural fests.

### Core Problems Solved:
* **Overbooking & Race Conditions:** Atomic database operators eliminate seat overselling during simultaneous booking spikes.
* **Administrative Moderation:** Multi-tiered approval workflow ensures quality control and campus policy compliance.
* **Unified Role Workflows:** Dedicated, responsive portals for Students, Organizers, and Administrators with role-based route guards.
* **Modern Campus Experience:** Clean, calming lavender aesthetic inspired by modern productivity tools without neon or harsh dark modes.

---

## 👥 Key Capabilities & Role Matrix

| Capability / Feature | Student | Organizer | Administrator |
| :--- | :---: | :---: | :---: |
| Browse & Search Public Events | ✅ | ✅ | ✅ |
| Filter by Category, Date, & Price Type | ✅ | ✅ | ✅ |
| View Event Guidelines & Live Seat Capacity | ✅ | ✅ | ✅ |
| One-Click Event Booking & Ticket Generation | ✅ | ❌ | ❌ |
| Real-time Booking Cancellation with Seat Restoration | ✅ | ❌ | ❌ |
| Personal Booking History & Reference Numbers | ✅ | ❌ | ❌ |
| Create Event Proposals (`pending` status) | ❌ | ✅ | ❌ |
| Edit & Delete Owned Event Drafts / Proposals | ❌ | ✅ | ❌ |
| View Attendee Rosters & Active Bookings | ❌ | ✅ | ✅ |
| Review Pending Submissions & Set Rejection Reasons | ❌ | ❌ | ✅ |
| Platform-wide User and Event Management | ❌ | ❌ | ✅ |
| Quick Platform Statistics & Metric Aggregations | ✅ (Personal) | ✅ (Club) | ✅ (Global) |

---

## 🎨 Design System & UI Guidelines

EventEase features a soothing color palette designed for high legibility, accessible contrast, and visual elegance:

### Color Palette Tokens
| Token Name | Hex Code | Visual Swatch & Intended Application |
| :--- | :--- | :--- |
| **Canvas Background** | `#FAFAF7` | Warm off-white page background |
| **Surface Card** | `#FFFFFF` | Clean white cards, containers, and modals |
| **Brand Primary** | `#8174D8` | Primary lavender accent for CTAs, focus rings, and highlights |
| **Pale Lavender** | `#F1EEFF` | Subtle brand backgrounds, hover states, badges |
| **Pale Blue** | `#EAF2FF` | Informational cards, status tints, secondary badges |
| **Primary Text** | `#24243A` | High-contrast readable typography for headings & body |
| **Secondary Text** | `#73758A` | Muted subtitle text, metadata, labels, and timestamps |
| **Border Gray** | `#E9E7F2` | Subtle outlines, dividers, and card borders |

### Core Design Rules
* **Typography:** Clean sans-serif hierarchy powered by Tailwind CSS.
* **Iconography:** Cohesive visual language using `lucide-react` icons exclusively.
* **Accessibility:** Accessible color contrast ratios, visible keyboard focus indicators, and screen-reader labels.
* **Zero Native Popups:** Browser `alert()`, `confirm()`, and `prompt()` calls are replaced with custom accessible `<Modal />` and `<ToastContext />` components.

---

## 💻 Technology Stack

### Frontend Architecture
* **Library / Runtime:** React 18 with Vite build tool
* **Routing:** React Router DOM v6 (declarative protected route wrappers)
* **Styling:** Tailwind CSS v3 with centralized color tokens
* **Icons:** Lucide React
* **HTTP Client:** Axios (configured with interceptors, credentials, and bearer fallback)

### Backend Architecture
* **Runtime:** Node.js v18+ LTS
* **Framework:** Express.js REST API (`/api/v1`)
* **Security:**
  * `helmet` for HTTP security headers
  * `cors` with granular origin whitelisting and credentials support
  * `express-rate-limit` to prevent brute-force attacks on sensitive endpoints
  * `cookie-parser` for secure HttpOnly cookie session handling
  * `bcryptjs` (salt rounds: 12) for one-way password hashing
  * `jsonwebtoken` (JWT) for stateless cryptographic authentication

### Database & ODM
* **Engine:** MongoDB (MongoDB Atlas cloud cluster or local service)
* **Object Data Modeling:** Mongoose v8
* **Indexes:** Unique compound indexes, text indexes for keyword search, status-based query filters

---

## 📂 Architecture & Folder Structure

```
EventEase/
├── .gitignore                   # Universal repository ignore rules
├── package.json                 # Monorepo convenience scripts (test, seed)
│
├── client/                      # Frontend Application (React + Vite)
│   ├── .env.example             # Frontend environment variables template
│   ├── index.html               # Single page application entry point
│   ├── package.json             # Frontend client dependencies & scripts
│   ├── tailwind.config.js       # Design system tokens (#8174D8, #FAFAF7, etc.)
│   ├── vite.config.js           # Vite dev server & proxy settings
│   └── src/
│       ├── App.jsx              # Application router & provider wrapper
│       ├── main.jsx             # React DOM root render
│       ├── index.css            # Base Tailwind styles & custom utilities
│       ├── components/
│       │   ├── auth/            # ProtectedRoute wrapper
│       │   ├── common/          # Button, Card, Badge, Modal, FormInput, StatCard
│       │   ├── events/          # EventCard, EventFilters, EventGrid
│       │   ├── feedback/        # EmptyState, ErrorState, LoadingSkeleton
│       │   └── layout/          # Navbar, Footer
│       ├── context/             # AuthContext (sessions), ToastContext (notifications)
│       ├── layouts/             # MainLayout (public), DashboardLayout (sidebar)
│       ├── pages/
│       │   ├── auth/            # LoginPage, RegisterPage
│       │   ├── public/          # LandingPage, ExploreEventsPage, EventDetailsPage, AboutPage
│       │   └── dashboards/
│       │       ├── student/     # StudentOverview, MyBookingsPage, StudentProfilePage
│       │       ├── organizer/   # OrganizerOverview, OrganizerEventsPage, OrganizerAttendeesPage
│       │       └── admin/       # AdminOverview, AdminApprovalsPage, AdminUsersPage, AdminEventsPage
│       ├── services/            # Axios API client & endpoints (auth, event, booking, etc.)
│       └── utils/               # formatters (currency, dates, capacity)
│
└── server/                      # Backend REST API (Node.js + Express)
    ├── .env.example             # Backend environment template
    ├── package.json             # Backend server dependencies & scripts
    ├── scripts/
    │   ├── seedAdmin.js         # Dedicated script to provision platform admin
    │   ├── seedSampleData.js    # Seed 6 campus events, organizers, & student bookings
    │   └── testSuite.js         # 36-step automated integration test suite
    └── src/
        ├── app.js               # Express application initialization & middleware stack
        ├── server.js            # HTTP server listener & DB connection trigger
        ├── config/
        │   └── db.js            # Mongoose MongoDB connection manager
        ├── controllers/         # Request handling & HTTP responses
        │   ├── authController.js
        │   ├── eventController.js
        │   ├── bookingController.js
        │   ├── organizerController.js
        │   └── adminController.js
        ├── middleware/
        │   ├── authMiddleware.js # JWT verification (protect) & RBAC (authorize)
        │   └── errorHandler.js   # Global operational error handler & CastError parser
        ├── models/              # Mongoose database schemas
        │   ├── User.js          # Authentication, roles, profile
        │   ├── Event.js         # Event metadata, capacity, approval workflow
        │   └── Booking.js       # Student reservations, unique references
        ├── routes/              # Express API route declarations (/api/v1/...)
        ├── services/
        │   └── bookingService.js# Concurrency-safe atomic seat booking engine
        ├── utils/               # AppError, apiResponse, generateToken
        └── validators/          # Input schema validators & role injection guards
```

---

## 🗄️ Data Models & Schema Architecture

### 1. User Model (`User.js`)
* `name`: String (required, trimmed, max 60 chars)
* `email`: String (unique, required, lowercase, indexed)
* `password`: String (hashed with bcrypt, selected out by default)
* `role`: Enum `['student', 'organizer', 'admin']` (default: `'student'`)
* `department`: String (optional academic department)
* `organizationName`: String (required for organizers)
* `timestamps`: `createdAt`, `updatedAt`

### 2. Event Model (`Event.js`)
* `title`: String (required, indexed)
* `description`: String (required)
* `category`: Enum `['technology', 'workshop', 'hackathon', 'cultural', 'sports', 'seminar']`
* `organizer`: ObjectId ref `'User'` (required)
* `startDateTime`, `endDateTime`: Date (required)
* `registrationDeadline`: Date (required)
* `venue`: String (hall / lab / auditorium)
* `location`: String (campus block / building)
* `price`: Number (0 for free events)
* `capacity`: Number (total registration quota)
* `availableSeats`: Number (real-time remaining seats, protected by atomic operations)
* `status`: Enum `['draft', 'pending', 'approved', 'rejected', 'cancelled']` (default: `'pending'`)
* `rejectionReason`: String (mandatory when admin rejects a submission)
* `bannerImage`: String (secure URL or fallback image)
* `timestamps`: `createdAt`, `updatedAt`

### 3. Booking Model (`Booking.js`)
* `bookingReference`: String (unique, e.g., `#EVT-928471`)
* `student`: ObjectId ref `'User'` (required)
* `event`: ObjectId ref `'Event'` (required)
* `status`: Enum `['confirmed', 'cancelled', 'attended']` (default: `'confirmed'`)
* `bookedAt`: Date (default: `Date.now`)
* `cancelledAt`: Date
* **Compound Unique Index:** `{ student: 1, event: 1, status: 1 }` guarantees a student cannot hold duplicate active bookings for the same event.

---

## ⚡ The Atomic Booking Engine (Concurrency Safeguards)

Event registrations in high-traffic campus scenarios face race conditions where two simultaneous requests see 1 available seat and both book it, causing negative capacity.

EventEase solves this using MongoDB's atomic operator paradigm:

```javascript
// Step 1: Atomic seat decrement with positive capacity precondition
const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    status: 'approved',
    availableSeats: { $gt: 0 },
    registrationDeadline: { $gt: new Date() }
  },
  {
    $inc: { availableSeats: -1 }
  },
  {
    new: true,
    runValidators: true
  }
);

if (!updatedEvent) {
  throw new AppError('Sorry, this event is fully booked or past its deadline', 400);
}

// Step 2: Create confirmed booking document
const booking = await Booking.create({
  bookingReference: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
  student: studentId,
  event: eventId,
  status: 'confirmed'
});
```

### Idempotent Cancellation Guarantee:
When a booking is cancelled, the system verifies `status: 'confirmed'` before updating:
```javascript
const booking = await Booking.findOneAndUpdate(
  { _id: bookingId, student: studentId, status: 'confirmed' },
  { status: 'cancelled', cancelledAt: new Date() },
  { new: true }
);

if (booking) {
  // Restore seat capacity exactly once
  await Event.findByIdAndUpdate(booking.event, { $inc: { availableSeats: 1 } });
}
```
*If a student double-clicks or replays the cancellation request, subsequent calls fail gracefully without incrementing seats multiple times.*

---

## 📡 REST API Specification

Base URL: `http://localhost:5000/api/v1` (or your Render URL)

### Health Check
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | System status, database health, uptime | Public |

### Authentication & Profiles (`/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new student or organizer | Public |
| `POST` | `/auth/login` | Authenticate user, receive JWT cookie & bearer token | Public |
| `POST` | `/auth/logout` | Clear session cookie | Public |
| `GET` | `/auth/me` | Fetch currently authenticated user profile | Authenticated |
| `PUT` | `/auth/profile` | Update profile information | Authenticated |

> 🔒 **Admin Injection Protection:** The registration endpoint rejects any payload attempting to self-assign `role: 'admin'` with `403 Forbidden`. The platform administrator must be seeded securely via server environment credentials.

### Public Event Catalog (`/events`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | List approved upcoming events (search, filter, sort, paginate) | Public |
| `GET` | `/events/featured` | Fetch top featured events | Public |
| `GET` | `/events/:id` | Fetch single event details with organizer metadata | Public |

### Student Bookings (`/bookings`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings/:eventId` | Atomically reserve a seat for an approved event | Student |
| `GET` | `/bookings/my` | Retrieve student's booking history & status | Student |
| `PUT` | `/bookings/:id/cancel`| Cancel an active booking and restore event capacity | Student |

### Organizer Management (`/organizer`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/organizer/dashboard` | Organizer KPI cards (total events, bookings, pending) | Organizer |
| `GET` | `/organizer/events` | List all events owned by authenticated organizer | Organizer |
| `POST` | `/organizer/events` | Submit new event proposal (saved as `pending`) | Organizer |
| `PUT` | `/organizer/events/:id`| Update owned event (if not locked) | Organizer |
| `DELETE`| `/organizer/events/:id`| Delete eligible owned event | Organizer |
| `GET` | `/organizer/attendees` | View attendee list and registered student details | Organizer |

### Admin Moderation (`/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/dashboard` | Platform metrics (total users, organizers, events, bookings) | Admin |
| `GET` | `/admin/pending` | Fetch events awaiting approval review | Admin |
| `PUT` | `/admin/events/:id/status` | Approve or reject event (rejection reason required) | Admin |
| `GET` | `/admin/users` | List registered users with search & role filter | Admin |
| `GET` | `/admin/events` | List all platform events regardless of status | Admin |

---

## 🚀 Local Development Quickstart

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **MongoDB:** Local instance running on port `27017` OR free MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/EventEase.git
cd EventEase
```

### 2. Configure Environment Variables

#### Backend Configuration:
Create `server/.env` based on `server/.env.example`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/eventease
JWT_SECRET=super-secret-eventease-jwt-token-replace-in-production-min-32-chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Admin Seed Account
ADMIN_NAME="System Administrator"
ADMIN_EMAIL=admin@eventease.com
ADMIN_PASSWORD=AdminSecurePass123!
```

#### Frontend Configuration:
Create `client/.env` based on `client/.env.example`:
```ini
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### 4. Seed Platform Administrator & Sample Catalog
```bash
# Provision the initial Administrator
npm run seed:admin

# Populate 6 college events, organizers, and bookings
npm run seed:data
```

### 5. Launch Development Servers
Open two terminal windows:

* **Terminal 1 (Backend API):**
  ```bash
  cd server
  npm run dev
  # Server running at http://localhost:5000
  ```

* **Terminal 2 (Frontend Client):**
  ```bash
  cd client
  npm run dev
  # Client running at http://localhost:5173
  ```

### 6. Default Demo Credentials
The platform includes built-in 1-click login buttons on the login page, or you can log in manually:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@eventease.com` | `AdminSecurePass123!` |
| **Club Organizer** | `gdsc.lead@campus.edu` | `OrganizerPass123!` |
| **Student** | `alex.johnson@campus.edu` | `StudentPass123!` |

---

## 🧪 Automated Testing Suite

EventEase features a comprehensive automated integration test suite covering 36 critical assertions across all architectural layers.

Run tests directly from the root repository:
```bash
npm test
```

### Test Suite Coverage Checklist (36/36 Passed):
* **Group 1: Health & Connectivity (3 tests)**
  * `GET /api/v1/health` responds with HTTP 200
  * System reporting healthy status
  * Database actively connected
* **Group 2: Registration, Validation & Credentials (9 tests)**
  * Student registration issues 201 Created and JWT token
  * Password hashing verified
  * Duplicate email prevention
  * Password length validation (minimum 6 characters)
  * **Role injection protection:** Attempting `role: 'admin'` rejected with 403 Forbidden
  * Authentication login, session token issuance, invalid credential handling
* **Group 3: Role-Based Access Control (RBAC) (5 tests)**
  * Unauthenticated requests to protected routes blocked with 401
  * Students forbidden from `/admin/*` and `/organizer/*` endpoints (403)
  * Admin and Organizer roles granted respective dashboard access
* **Group 4: Public Catalog Search & Filters (5 tests)**
  * Public event retrieval
  * Keyword search matching (`?search=Summit`)
  * Category filtering (`?category=technology`)
  * Price filtering (`?price=free`)
* **Group 5: Event Approval Workflow (5 tests)**
  * Organizers create events starting in `pending` state
  * Rejecting an event without `rejectionReason` blocked with 400 Bad Request
  * Rejection reason recorded and saved
  * Admin approval transitions event to `approved`
* **Group 6: Atomic Seat Reservations & Race Condition Defense (6 tests)**
  * Seat reservation succeeds with 201 Created
  * Capacity atomically decrements from 15 to 14
  * Duplicate booking by same student rejected with 400 Bad Request
  * Booking cancellation restores seat capacity back to 15
  * **Idempotency check:** Duplicate cancellation requests rejected without extra seat restoration
* **Group 7: Resilient Error Handling (3 tests)**
  * Malformed MongoDB ObjectIds handled cleanly via CastError (HTTP 400, no crashes)
  * Valid but non-existent ObjectIds return HTTP 404
  * Undefined routes return structured HTTP 404

---

## 🌐 Production Deployment Guide

Follow this step-by-step roadmap to deploy EventEase to production for free using **MongoDB Atlas**, **Render**, and **Vercel**.

```
           ┌──────────────────────┐
           │   Vercel (Frontend)  │
           │  https://...vercel.app│
           └──────────┬───────────┘
                      │ HTTPS API Calls (with Credentials)
                      ▼
           ┌──────────────────────┐
           │   Render (Backend)   │
           │  https://...onrender.com
           └──────────┬───────────┘
                      │ Mongoose TLS Connection
                      ▼
           ┌──────────────────────┐
           │  MongoDB Atlas Cloud │
           │   Cluster (M0 Free)  │
           └──────────────────────┘
```

---

### Step 1: Deploy Database on MongoDB Atlas

1. **Sign Up / Log In:** Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create an account.
2. **Create a Free Cluster:** Select **Shared (M0 Free Tier)** in your preferred cloud provider and region (e.g., AWS us-east-1).
3. **Configure Database Access:**
   * Navigate to **Security > Database Access**.
   * Click **Add New Database User**.
   * Authentication Method: **Password**.
   * Username: `eventease_admin`
   * Password: Generate a secure password (save this safely).
   * User Privileges: **Read and write to any database**.
4. **Configure Network Access:**
   * Navigate to **Security > Network Access**.
   * Click **Add IP Address**.
   * Select **Allow Access From Anywhere (`0.0.0.0/0`)** so your Render backend can connect.
5. **Get Connection String:**
   * Go to **Clusters > Connect > Drivers**.
   * Driver: Node.js (Version 5.5 or later).
   * Copy the connection string format:
     ```
     mongodb+srv://eventease_admin:<password>@cluster0.abcde.mongodb.net/eventease?retryWrites=true&w=majority
     ```
   * Replace `<password>` with your actual password and ensure the database name is `eventease`.

---

### Step 2: Deploy Backend Web Service on Render

1. **Sign Up / Log In:** Go to [render.com](https://render.com) and connect your GitHub account.
2. **Push Code to GitHub:**
   Ensure your local project is pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete production ready EventEase platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/EventEase.git
   git push -u origin main
   ```
3. **Create Web Service:**
   * Click **New + > Web Service**.
   * Select your GitHub repository.
4. **Configure Build & Start Settings:**
   * **Name:** `eventease-api`
   * **Region:** Same region as your MongoDB cluster (e.g., US East).
   * **Root Directory:** `server`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
   * **Instance Type:** `Free`
5. **Add Environment Variables on Render:**
   In the **Environment** tab, add the following key-value pairs:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production security & logging |
   | `PORT` | `10000` | Render assigns ports automatically |
   | `MONGODB_URI` | *[Your Atlas connection string from Step 1]* | Must include actual password |
   | `JWT_SECRET` | *[A strong 64-character random string]* | Never use default secrets |
   | `JWT_EXPIRES_IN` | `7d` | Token lifetime |
   | `CLIENT_URL` | `https://your-eventease-app.vercel.app` | Update this after deploying frontend |
   | `ADMIN_NAME` | `System Administrator` | For initial seed |
   | `ADMIN_EMAIL` | `admin@eventease.com` | Production admin email |
   | `ADMIN_PASSWORD` | `YourStrongAdminPassword987!` | Production admin password |
6. **Deploy & Seed Database:**
   * Click **Create Web Service**. Wait for the build and deployment logs to say `Server listening on port 10000`.
   * Open the **Shell** tab on Render and run:
     ```bash
     npm run seed:admin
     npm run seed:data
     ```
   * Test the health check endpoint in your browser: `https://eventease-api.onrender.com/api/v1/health`

---

### Step 3: Deploy Frontend on Vercel

1. **Sign Up / Log In:** Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. **Import Project:**
   * Click **Add New... > Project**.
   * Select your `EventEase` repository.
3. **Configure Project Settings:**
   * **Framework Preset:** `Vite`
   * **Root Directory:** Click Edit and select `client`.
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Install Command:** `npm install`
4. **Configure Environment Variables:**
   Under **Environment Variables**, add:
   * **Name:** `VITE_API_URL`
   * **Value:** `https://eventease-api.onrender.com/api/v1` *(your Render backend URL)*
5. **Deploy:**
   * Click **Deploy**. Vercel will build the frontend and provide a live URL (e.g., `https://eventease-app.vercel.app`).
6. **Sync CORS on Render:**
   * Return to your Render Web Service dashboard.
   * Update the `CLIENT_URL` environment variable to match your new Vercel production URL: `https://eventease-app.vercel.app`.
   * Trigger a manual redeploy on Render so the new CORS whitelist takes effect.

---

## 🛡️ Security Architecture & Best Practices

1. **Defense-in-Depth Authentication:**
   * Passwords hashed using `bcryptjs` with 12 salt rounds.
   * JWT tokens delivered via secure `HttpOnly`, `SameSite: 'lax'` cookies with a fallback Authorization Bearer header for cross-domain API clients.
2. **Strict Server-Side Authorization Guards:**
   * Role validation executed in Express middleware (`authorize(['admin'])`) before any controller logic runs.
   * Frontend route protection provides UX feedback, but backend authorization guarantees zero unauthorized data access.
3. **Sanitization & Input Validation:**
   * Required field validations on all incoming requests.
   * MongoDB CastErrors caught cleanly to prevent stack trace leakage.
4. **Brute Force & Rate Limiting:**
   * `express-rate-limit` enforces limits on auth and booking endpoints.
5. **Safe Environment Handling:**
   * Real credentials kept strictly in untracked `.env` files.
   * `.env.example` templates committed with dummy placeholders.

---

## 📄 License & Attribution

This project is licensed under the **MIT License**.  
Developed with ❤️ for academic institutions, student innovators, and campus communities.
