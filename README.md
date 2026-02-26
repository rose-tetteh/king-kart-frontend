# King Kart Frontend

Modern e-commerce frontend for King Kart clothing brand, built with Next.js 14+ and TypeScript.

## Overview

King Kart is a premium clothing brand specializing in high-quality apparel. This frontend application provides a seamless shopping experience with features including product browsing, shopping cart, secure checkout, and order management.

## Technology Stack

- **Framework:** Next.js 16.1+ with App Router
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x with custom brand colors
- **React:** 19.2+
- **Linting:** ESLint 9 with Next.js config
- **Formatting:** Prettier 3.7+
- **Package Manager:** npm

### Brand Colors

- **Gold:** `#D4A017` - Primary accent color
- **Navy:** `#1B2845` - Primary brand color
- **Olive Green:** `#6B6B2C` - Secondary accent

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** 18.x or 20.x LTS
- **npm:** 9.x or higher (comes with Node.js)
- **Git:** 2.30+

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd king-kart-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production-ready application
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files
- `npm test` - Run test suite

## Project Structure

```
king-kart-frontend/
├── public/              # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── admin/      # Admin routes (login, orders management)
│   │   ├── cart/       # Shopping cart
│   │   ├── checkout/   # Checkout flow
│   │   ├── login/      # Customer login
│   │   ├── register/   # Customer registration
│   │   ├── orders/     # Customer order history
│   │   ├── profile/    # Customer profile
│   │   ├── services/   # Service catalog
│   │   ├── measurements/ # Measurement management
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Landing page
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── home/       # Home page components
│   │   ├── layout/     # Layout components (Header, Footer)
│   │   ├── admin/      # Admin-specific components
│   │   └── orders/     # Order-related components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React Context providers
│   └── lib/            # Utility functions and auth helpers
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── README.md           # This file
└── ROUTES.md           # Complete routes documentation
```

## Routes Documentation

For a complete list of all available routes, endpoints, and authentication requirements, see **[ROUTES.md](./ROUTES.md)**.

### Quick Route Overview

**Public Routes:**
- `/` - Home page
- `/services` - Service catalog
- `/services/[id]` - Service details
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/login` - Customer login
- `/register` - Customer registration

**Customer Routes** (Authentication Required):
- `/profile` - Customer profile
- `/orders` - Order history
- `/orders/[orderNumber]` - Order details
- `/measurements/manual` - Manual measurement entry
- `/measurements/profiles` - Measurement profiles
- `/measurements/upload` - Upload measurements

**Admin Routes** (Admin Authentication Required):
- `/admin/login` - Admin login
- `/admin/orders` - Orders management
- `/admin/orders/[orderNumber]` - Order details and management

## Integration with Backend

This frontend communicates with the King Kart backend API:

- **Backend Repository:** [king-kart-backend](../king-kart-backend)
- **API Base URL:** Configured via `NEXT_PUBLIC_API_URL` environment variable
- **Default Backend Port:** 8080

Ensure the backend is running before using features that require API communication.

## Development Guidelines

### Code Style

- Follow TypeScript strict mode conventions
- Use functional components with React Hooks
- Components use PascalCase naming (e.g., `ServiceCard.tsx`)
- Utility functions use camelCase naming (e.g., `formatPrice.ts`)
- Files use kebab-case naming (e.g., `service-card.tsx`)

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

Examples:
feat(cart): add quantity increment/decrement
fix(checkout): resolve payment validation issue
chore(deps): update dependencies
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following the coding standards
3. Run linting: `npm run lint`
4. Format code: `npm run format`
5. Commit changes: `git commit -m "feat(scope): description"`
6. Push to branch: `git push origin feature/your-feature`
7. Open a pull request

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is occupied, Next.js will automatically try the next available port (3001, 3002, etc.).

To specify a custom port:

```bash
PORT=3001 npm run dev
```

### Module Not Found Errors

Clear cache and reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

Ensure TypeScript version matches the project requirements:

```bash
npm list typescript
```

## License

Proprietary - King Kart Clothing Brand

## Support

For issues or questions, contact the development team or create an issue in the repository.
