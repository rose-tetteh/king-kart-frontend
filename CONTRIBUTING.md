# Contributing to King Kart Frontend

Thank you for your interest in contributing to King Kart Frontend! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone <your-fork-url>
   cd king-kart-frontend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Access the application at http://localhost:3000

### Code Quality Checks

Before committing, ensure your code passes all checks:

```bash
npm run lint          # Run ESLint
npm run format:check  # Check code formatting
npm run format        # Auto-format code
npm test              # Run tests
npm run build         # Verify production build works
```

## Coding Standards

### File Naming Conventions

- **Components:** `PascalCase` (e.g., `ServiceCard.tsx`)
- **Utilities/Hooks:** `camelCase` with prefix (e.g., `useAuth.ts`, `formatPrice.ts`)
- **Files:** `kebab-case` (e.g., `service-card.tsx`, `api-client.ts`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL.ts`)

### Code Style

- **TypeScript:** Use TypeScript for all new code
- **Components:** Functional components with hooks
- **Formatting:** Prettier configuration (single quotes, 2-space indentation)
- **Imports:** Group by external → internal → relative

Example:
```typescript
// External imports
import { useState, useEffect } from 'react';
import axios from 'axios';

// Internal imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Relative imports
import { ServiceCard } from './service-card';
```

### Component Structure

```typescript
'use client'; // If using client-side features

import { useState } from 'react';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState<string>('');

  const handleClick = () => {
    // Logic here
    onAction();
  };

  return (
    <div className="container">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

## Commit Message Guidelines

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```
feat(cart): add quantity selector component

Implemented a reusable quantity selector with increment/decrement
buttons and manual input support.

Closes #123
```

```
fix(checkout): resolve payment validation error

Fixed issue where valid credit card numbers were being rejected
due to incorrect Luhn algorithm implementation.

Fixes #456
```

## Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature
   git rebase main
   ```

2. **Ensure all checks pass:**
   - Linting (no ESLint errors)
   - Formatting (Prettier compliant)
   - Tests (all tests passing)
   - Build (production build successful)

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature
   ```

4. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Request review from maintainers

5. **Address review feedback:**
   - Make requested changes
   - Push updates to the same branch
   - Respond to review comments

## Testing Guidelines

### Unit Tests

Test individual components and functions:

```typescript
import { render, screen } from '@testing-library/react';
import { ServiceCard } from './service-card';

describe('ServiceCard', () => {
  it('renders service name correctly', () => {
    render(<ServiceCard name="Laundry" price={50} />);
    expect(screen.getByText('Laundry')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test component interactions and API calls (when implemented).

### Test Coverage

- Aim for >80% code coverage
- Test edge cases and error handling
- Mock external dependencies (API calls, etc.)

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes:

```tsx
<div className="flex items-center justify-between rounded-lg bg-gold p-4">
  <h2 className="text-lg font-bold text-navy">Title</h2>
</div>
```

### Brand Colors

Use custom color classes defined in `globals.css`:

- **Primary:** `bg-gold`, `text-gold`, `border-gold`
- **Secondary:** `bg-navy`, `text-navy`, `border-navy`
- **Accent:** `bg-olive`, `text-olive`, `border-olive`

### Responsive Design

Always consider mobile-first design:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>
```

## API Integration

### API Client Pattern

Use centralized API client in `src/services/api/`:

```typescript
// src/services/api/services.ts
import { apiClient } from './client';

export async function getServices() {
  const response = await apiClient.get('/services');
  return response.data;
}
```

### Error Handling

Implement consistent error handling:

```typescript
try {
  const data = await getServices();
  setServices(data);
} catch (error) {
  console.error('Failed to fetch services:', error);
  setError('Unable to load services. Please try again.');
}
```

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where necessary
- Ensure keyboard navigation works
- Test with screen readers when possible

## Questions or Issues?

- Check existing issues on GitHub
- Ask questions in pull request comments
- Contact the development team

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to King Kart! 🛒
