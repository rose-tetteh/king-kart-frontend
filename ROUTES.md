# King Kart Frontend Routes Documentation

Complete documentation of all frontend routes/endpoints in the King Kart application.

## Table of Contents

- [Public Routes](#public-routes)
- [Customer Routes](#customer-routes)
- [Admin Routes](#admin-routes)
- [Route Parameters](#route-parameters)

---

## Public Routes

These routes are accessible to all users without authentication.

### Home Page
- **Route:** `/`
- **Component:** `src/app/page.tsx`
- **Description:** Landing page with hero section, featured services, and about section
- **Features:**
  - Hero banner with call-to-action
  - Featured services showcase
  - Why Choose King Kart section
  - Trust indicators

### Services
- **Route:** `/services`
- **Component:** `src/app/services/page.tsx`
- **Description:** Browse all available services
- **Features:**
  - Service catalog with filtering
  - Service categories
  - Pricing information

### Service Details
- **Route:** `/services/[id]`
- **Component:** `src/app/services/[id]/page.tsx`
- **Description:** Detailed view of a specific service
- **Parameters:**
  - `id` - Service identifier
- **Features:**
  - Service description
  - Pricing details
  - Add to cart functionality
  - Image gallery

### Shopping Cart
- **Route:** `/cart`
- **Component:** `src/app/cart/page.tsx`
- **Description:** View and manage shopping cart items
- **Features:**
  - Cart item list
  - Quantity adjustment
  - Remove items
  - Price calculation
  - Proceed to checkout

### Checkout
- **Route:** `/checkout`
- **Component:** `src/app/checkout/page.tsx`
- **Description:** Complete order and payment
- **Features:**
  - Order summary
  - Customer information form
  - Measurement input
  - Order placement

### Login
- **Route:** `/login`
- **Component:** `src/app/login/page.tsx`
- **Description:** Customer login page
- **Features:**
  - Email/password authentication
  - Remember me option
  - Link to registration

### Register
- **Route:** `/register`
- **Component:** `src/app/register/page.tsx`
- **Description:** Customer registration page
- **Features:**
  - Account creation form
  - Email validation
  - Password requirements

---

## Customer Routes

These routes require customer authentication. Unauthenticated users will be redirected to login.

### Customer Profile
- **Route:** `/profile`
- **Component:** `src/app/profile/page.tsx`
- **Description:** Customer account profile and settings
- **Authentication:** Required (Customer)
- **Features:**
  - View account information
  - Update profile details
  - Manage preferences

### Order History
- **Route:** `/orders`
- **Component:** `src/app/orders/page.tsx`
- **Description:** List of customer's order history
- **Authentication:** Required (Customer)
- **Features:**
  - Order list with status
  - Filter by status
  - Search orders
  - Quick view order details

### Order Details
- **Route:** `/orders/[orderNumber]`
- **Component:** `src/app/orders/[orderNumber]/page.tsx`
- **Description:** Detailed view of a specific order
- **Authentication:** Required (Customer)
- **Parameters:**
  - `orderNumber` - Unique order identifier
- **Features:**
  - Order summary
  - Status timeline
  - Item details
  - Delivery information
  - Order tracking

### Measurements - Manual Entry
- **Route:** `/measurements/manual`
- **Component:** `src/app/measurements/manual/page.tsx`
- **Description:** Manually enter body measurements
- **Authentication:** Required (Customer)
- **Features:**
  - Measurement form
  - Input validation
  - Save measurements
  - Measurement guide

### Measurements - Profiles
- **Route:** `/measurements/profiles`
- **Component:** `src/app/measurements/profiles/page.tsx`
- **Description:** Manage saved measurement profiles
- **Authentication:** Required (Customer)
- **Features:**
  - View saved profiles
  - Edit profiles
  - Delete profiles
  - Set default profile

### Measurements - Upload
- **Route:** `/measurements/upload`
- **Component:** `src/app/measurements/upload/page.tsx`
- **Description:** Upload measurement photos/files
- **Authentication:** Required (Customer)
- **Features:**
  - File upload
  - Image preview
  - Upload validation
  - Instructions for proper photos

---

## Admin Routes

These routes require admin authentication. Unauthenticated users or non-admin users will be redirected.

### Admin Login
- **Route:** `/admin/login`
- **Component:** `src/app/admin/login/page.tsx`
- **Description:** Admin authentication page
- **Features:**
  - Admin credentials login
  - Secure authentication
  - Redirect after login

### Admin Orders Dashboard
- **Route:** `/admin/orders`
- **Component:** `src/app/admin/orders/page.tsx`
- **Description:** Admin dashboard for managing all orders
- **Authentication:** Required (Admin)
- **Features:**
  - View all orders
  - Filter by status (pending, confirmed, in_progress, ready, completed, cancelled)
  - Search orders by order number or customer
  - Sort by date, status, total
  - Quick status updates
  - Batch operations
  - Export orders

### Admin Order Details
- **Route:** `/admin/orders/[orderNumber]`
- **Component:** `src/app/admin/orders/[orderNumber]/page.tsx`
- **Description:** Detailed admin view of a specific order
- **Authentication:** Required (Admin)
- **Parameters:**
  - `orderNumber` - Unique order identifier
- **Features:**
  - Complete order information
  - Customer details
  - Item breakdown
  - Update order status
  - Add internal notes
  - View status history
  - Measurement details
  - Contact customer

---

## Route Parameters

### Dynamic Route Parameters

#### `[id]` - Service ID
- Used in `/services/[id]`
- Format: String or number identifier
- Example: `/services/1`, `/services/african-prints`

#### `[orderNumber]` - Order Number
- Used in `/orders/[orderNumber]` and `/admin/orders/[orderNumber]`
- Format: Unique order identifier (string)
- Example: `/orders/ORD-20240226-001`

---

## Route Groups

The application uses Next.js route groups for organization:

### Layouts

#### Root Layout
- **File:** `src/app/layout.tsx`
- **Applies to:** All routes
- **Features:**
  - Global styles
  - Header component
  - Footer component
  - Cart context provider
  - Font configuration

#### Admin Layout
- **File:** `src/app/admin/layout.tsx`
- **Applies to:** `/admin/*` routes
- **Features:**
  - Admin navigation sidebar
  - Admin guard (authentication check)
  - Admin-specific styling
  - Breadcrumb navigation

---

## Authentication & Authorization

### Customer Authentication
- **Login Route:** `/login`
- **Storage:** Local storage (`customerUser`)
- **Protected Routes:**
  - `/profile`
  - `/orders`
  - `/orders/[orderNumber]`
  - `/measurements/*`

### Admin Authentication
- **Login Route:** `/admin/login`
- **Storage:** Session storage (`adminUser`)
- **Protected Routes:**
  - `/admin/orders`
  - `/admin/orders/[orderNumber]`

### Redirect Behavior
- Unauthenticated access to protected routes → Redirect to login
- Authenticated admin accessing `/admin/login` → Redirect to `/admin/orders`
- Authenticated customer accessing `/login` → Redirect to `/`

---

## API Integration

All routes that require backend data use the API base URL configured in environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Endpoints Used by Routes

- `/services` → `GET /api/services`
- `/services/[id]` → `GET /api/services/{id}`
- `/checkout` → `POST /api/orders`
- `/orders` → `GET /api/orders` (customer's orders)
- `/admin/orders` → `GET /api/orders` (all orders)
- `/admin/orders/[orderNumber]` → `PATCH /api/orders/{orderNumber}`

---

## Navigation Structure

```
Home (/)
├── Services (/services)
│   └── Service Details (/services/[id])
├── Cart (/cart)
│   └── Checkout (/checkout)
├── Login (/login)
├── Register (/register)
└── Profile (/profile)
    ├── Orders (/orders)
    │   └── Order Details (/orders/[orderNumber])
    └── Measurements
        ├── Manual Entry (/measurements/manual)
        ├── Profiles (/measurements/profiles)
        └── Upload (/measurements/upload)

Admin (/admin)
├── Login (/admin/login)
└── Orders (/admin/orders)
    └── Order Details (/admin/orders/[orderNumber])
```

---

## Future Routes (Planned)

These routes are mentioned in documentation but not yet implemented:

- `/about` - About King Kart page
- `/contact` - Contact form
- `/faq` - Frequently Asked Questions
- `/admin/dashboard` - Admin analytics dashboard
- `/admin/products` - Product management
- `/admin/customers` - Customer management
- `/admin/settings` - Admin settings

---

## Notes

- All routes use Next.js App Router (Next.js 16+)
- Server components by default, client components marked with `'use client'`
- Dynamic routes use bracket notation `[param]`
- Route groups use parentheses `(group)` for organization without affecting URL structure
- All pages are TypeScript (.tsx files)

---

**Last Updated:** February 26, 2026
**Version:** 1.0.0
