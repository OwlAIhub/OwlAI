# PROJECT-LEVEL RULES

# Production-ready development standards for all project types

## PROJECT CONTEXT TEMPLATE

```
Project Type: [Frontend/Backend/Full-Stack/Mobile/Desktop]
Framework: [React/Next.js/Vue/Angular/Express/FastAPI/Flutter/etc.]
Database: [PostgreSQL/MongoDB/MySQL/Redis/etc.]
Styling: [Tailwind CSS/Styled Components/CSS Modules/etc.]
State Management: [Zustand/Redux/Context/Pinia/etc.]
Authentication: [JWT/OAuth/Auth0/Clerk/etc.]
Deployment: [Vercel/AWS/Docker/Kubernetes/etc.]
Team Size: [Solo/Small Team (2-5)/Medium Team (6-15)/Large Team (15+)]
Target Audience: [Web/Mobile/Desktop/All Platforms]
Performance Requirements: [Standard/High Performance/Enterprise]
Accessibility Level: [WCAG 2.1 AA/AAA]
```

## PRODUCTION-READY CODE QUALITY STANDARDS

### File Organization Principles

```
project-root/
├── src/                          # Source code
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui style)
│   │   ├── forms/              # Form-specific components
│   │   ├── layout/             # Layout components
│   │   └── features/           # Feature-specific components
│   ├── pages/ or app/          # Pages/routes (framework-specific)
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── lib/                    # External library configurations
│   ├── types/                  # TypeScript type definitions
│   ├── constants/              # Application constants
│   ├── config/                 # Configuration files
│   ├── services/               # API services and business logic
│   ├── stores/                 # State management
│   ├── styles/                 # Global styles and themes
│   ├── assets/                 # Static assets
│   └── tests/                  # Test files
├── public/                      # Public static files
├── docs/                       # Documentation
├── scripts/                    # Build and deployment scripts
└── .github/                    # GitHub workflows and templates
```

### Naming Conventions (Production Standard)

```typescript
// ✅ File Naming
// Components: PascalCase
UserProfile.tsx
DashboardLayout.tsx
PaymentForm.tsx

// Hooks: camelCase with 'use' prefix
useLocalStorage.ts
useDebounce.ts
useApiQuery.ts

// Utilities: camelCase
formatCurrency.ts
validateEmail.ts
debounce.ts

// Directories: kebab-case
user-profile/
payment-gateway/
admin-dashboard/

// Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts

// Types/Interfaces: PascalCase
UserProfile.types.ts
ApiResponse.types.ts

// ✅ Variable Naming
// Boolean variables: is/has/can/should prefix
const isLoading = false;
const hasPermission = true;
const canEdit = user.role === 'admin';
const shouldShowModal = errors.length > 0;

// Functions: Verb-based, descriptive
const calculateTotalPrice = (items: CartItem[]) => {...};
const validateUserInput = (input: string) => {...};
const fetchUserProfile = async (userId: string) => {...};

// Event handlers: handle + action
const handleSubmit = (event: FormEvent) => {...};
const handleUserClick = (userId: string) => {...};
const handleInputChange = (value: string) => {...};

// Constants: Descriptive and specific
const MAX_FILE_SIZE_MB = 5;
const DEFAULT_PAGINATION_LIMIT = 20;
const API_TIMEOUT_MS = 10000;
```

### Code Structure Standards

```typescript
// ✅ Component Structure Pattern
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '@/services/user';
import type { User, UserFormData } from '@/types/user';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
  className?: string;
}

/**
 * UserProfile component for displaying and editing user information
 *
 * @param userId - The ID of the user to display
 * @param onUpdate - Callback function called when user is updated
 * @param className - Additional CSS classes
 */
export const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  onUpdate,
  className
}) => {
  // 1. State declarations
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({});

  // 2. Custom hooks
  const { toast } = useToast();

  // 3. Computed values with useMemo
  const displayName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  }, [user]);

  const isFormValid = useMemo(() => {
    return formData.firstName && formData.lastName && formData.email;
  }, [formData]);

  // 4. Event handlers with useCallback
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
  }, [user]);

  const handleSave = useCallback(async () => {
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      const updatedUser = await UserService.updateUser(userId, formData);
      setUser(updatedUser);
      setIsEditing(false);
      onUpdate?.(updatedUser);
      toast({
        title: 'Success',
        description: 'User profile updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, formData, isFormValid, onUpdate, toast]);

  // 5. Side effects with useEffect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await UserService.getUser(userId);
        setUser(userData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load user profile',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, toast]);

  // 6. Loading and error states
  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!user) {
    return <UserNotFound />;
  }

  // 7. Main render logic
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{displayName}</h2>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <UserProfileForm
          data={formData}
          onChange={setFormData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={isLoading}
          isValid={isFormValid}
        />
      ) : (
        <UserProfileDisplay user={user} />
      )}
    </div>
  );
};

// 8. Sub-components for better organization
const UserProfileSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-muted rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  </div>
);

const UserNotFound: React.FC = () => (
  <div className="text-center py-8">
    <p className="text-muted-foreground">User not found</p>
  </div>
);

export default UserProfile;
```

## RESPONSIVE DESIGN STANDARDS (PRODUCTION-LEVEL)

### Mobile-First Responsive Strategy

```typescript
// ✅ Tailwind CSS Responsive Design System
const responsiveBreakpoints = {
  // Base (mobile): 0px and up
  sm: '640px',   // Small tablets
  md: '768px',   // Large tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large desktops
} as const;

// ✅ Responsive Component Example
export const ResponsiveCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={cn(
    // Mobile-first base styles
    'w-full p-4 rounded-lg border bg-card',
    // Small screens (tablets)
    'sm:p-6 sm:max-w-md sm:mx-auto',
    // Medium screens (large tablets)
    'md:p-8 md:max-w-lg',
    // Large screens (laptops)
    'lg:p-10 lg:max-w-2xl',
    // Extra large screens (desktops)
    'xl:p-12 xl:max-w-4xl',
    // 2X large screens
    '2xl:max-w-6xl'
  )}>
    {children}
  </div>
);

// ✅ Responsive Grid System
export const ResponsiveGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={cn(
    // Mobile: 1 column
    'grid grid-cols-1 gap-4',
    // Small: 2 columns
    'sm:grid-cols-2 sm:gap-6',
    // Medium: 3 columns
    'md:grid-cols-3',
    // Large: 4 columns
    'lg:grid-cols-4 lg:gap-8'
  )}>
    {children}
  </div>
);

// ✅ Responsive Typography System
export const ResponsiveHeading: React.FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}> = ({ level, children, className }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const responsiveClasses = {
    1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold',
    3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold',
    4: 'text-lg sm:text-xl md:text-2xl font-medium',
    5: 'text-base sm:text-lg md:text-xl font-medium',
    6: 'text-sm sm:text-base md:text-lg font-medium'
  };

  return (
    <Tag className={cn(responsiveClasses[level], className)}>
      {children}
    </Tag>
  );
};

// ✅ Responsive Navigation Pattern
export const ResponsiveNavigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/settings">Settings</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
              <MobileNavLink href="/projects">Projects</MobileNavLink>
              <MobileNavLink href="/settings">Settings</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
```

### Responsive Image Handling

```typescript
// ✅ Responsive Image Component
export const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  sizes?: string;
  priority?: boolean;
  className?: string;
}> = ({
  src,
  alt,
  aspectRatio = 'landscape',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  className
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', aspectClasses[aspectRatio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform hover:scale-105"
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
};

// ✅ Responsive Image Gallery
export const ResponsiveImageGallery: React.FC<{ images: ImageData[] }> = ({ images }) => {
  return (
    <div className={cn(
      // Mobile: 1 column with full width
      'grid grid-cols-1 gap-4',
      // Small: 2 columns
      'sm:grid-cols-2 sm:gap-6',
      // Medium: 3 columns
      'md:grid-cols-3',
      // Large: 4 columns with larger gaps
      'lg:grid-cols-4 lg:gap-8'
    )}>
      {images.map((image, index) => (
        <ResponsiveImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          priority={index < 4} // Prioritize first 4 images
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      ))}
    </div>
  );
};
```

### Responsive Layout Patterns

```typescript
// ✅ Responsive Dashboard Layout
export const ResponsiveDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        // Mobile: Fixed sidebar that slides in
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out',
        'md:translate-x-0 md:static md:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>

            {/* Header Content */}
            <div className="flex items-center space-x-4">
              <ResponsiveSearchBar />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={cn(
          'min-h-[calc(100vh-4rem)] p-4',
          'sm:p-6',
          'lg:p-8'
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

// ✅ Responsive Card Grid
export const ResponsiveCardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={cn(
    // Mobile: Stack cards vertically
    'space-y-4',
    // Small: 2 columns
    'sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0',
    // Large: 3 columns
    'lg:grid-cols-3',
    // Extra large: 4 columns
    'xl:grid-cols-4'
  )}>
    {children}
  </div>
);

// ✅ Responsive Form Layout
export const ResponsiveFormLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={cn(
    'w-full max-w-md mx-auto p-6',
    'sm:max-w-lg sm:p-8',
    'md:max-w-xl',
    'lg:max-w-2xl lg:p-10'
  )}>
    {children}
  </div>
);
```

## DEVELOPMENT WORKFLOW STANDARDS

### Git Workflow (Production Standards)

```bash
# ✅ Branch Naming Convention
feature/auth-system-implementation
feature/user-dashboard-redesign
bugfix/payment-processing-error
hotfix/security-vulnerability-patch
release/v2.1.0
chore/dependency-updates

# ✅ Commit Message Convention (Conventional Commits)
feat: add user authentication system
fix: resolve payment processing timeout issue
docs: update API documentation for v2.0
style: improve responsive design for mobile devices
refactor: optimize database query performance
test: add unit tests for user service
chore: update dependencies to latest versions
perf: improve page load times by 40%
security: patch XSS vulnerability in user input

# ✅ Commit Message Examples
feat(auth): implement OAuth2 social login integration

- Add Google and GitHub OAuth providers
- Implement secure token storage
- Add user profile sync functionality
- Include comprehensive error handling

fix(payments): resolve Stripe webhook timeout issues

- Increase webhook timeout to 30 seconds
- Add retry mechanism for failed webhooks
- Improve error logging and monitoring
- Update webhook signature validation

# ✅ Pull Request Template
## Description
Brief description of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Performance Impact
- [ ] Performance regression tests completed
- [ ] Bundle size impact assessed
- [ ] Database query performance verified

## Security Checklist
- [ ] Input validation implemented
- [ ] Authorization checks in place
- [ ] No sensitive data exposed
- [ ] Security review completed

## Screenshots (if applicable)
[Include screenshots for UI changes]

## Breaking Changes
[Describe any breaking changes and migration steps]
```

### Testing Requirements (Production Level)

```typescript
// ✅ Testing Strategy Implementation
describe('UserProfile Component', () => {
  // Unit tests for component logic
  describe('Component Rendering', () => {
    it('renders user information correctly', () => {
      render(<UserProfile userId="123" />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      render(<UserProfile userId="123" />);
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });

  // Integration tests for user interactions
  describe('User Interactions', () => {
    it('enables edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProfile userId="123" />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    });

    it('saves changes and shows success message', async () => {
      const user = userEvent.setup();
      const mockOnUpdate = jest.fn();

      render(<UserProfile userId="123" onUpdate={mockOnUpdate} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      await user.clear(screen.getByRole('textbox', { name: /first name/i }));
      await user.type(screen.getByRole('textbox', { name: /first name/i }), 'Jane');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
      });
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<UserProfile userId="123" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports keyboard navigation', async () => {
      render(<UserProfile userId="123" />);

      // Tab navigation test
      const editButton = screen.getByRole('button', { name: /edit/i });
      editButton.focus();
      expect(editButton).toHaveFocus();
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('renders within performance budget', async () => {
      const startTime = performance.now();
      render(<UserProfile userId="123" />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(16); // Under one frame at 60fps
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    it('displays error message when user fetch fails', async () => {
      server.use(
        rest.get('/api/users/123', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load user profile/i)).toBeInTheDocument();
      });
    });
  });
});

// ✅ E2E Test Example
describe('User Profile Flow', () => {
  it('allows user to update their profile end-to-end', async () => {
    await page.goto('/profile');

    // Wait for profile to load
    await page.waitForSelector('[data-testid="user-profile"]');

    // Edit profile
    await page.click('button:has-text("Edit Profile")');
    await page.fill('[name="firstName"]', 'Jane');
    await page.fill('[name="lastName"]', 'Smith');

    // Save changes
    await page.click('button:has-text("Save")');

    // Verify success
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    await expect(page.locator('text=Jane Smith')).toBeVisible();
  });
});
```

## ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA+)

### Mandatory Accessibility Features

```typescript
// ✅ Accessible Form Component
export const AccessibleForm: React.FC<{
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
  title: string;
}> = ({ children, onSubmit, title }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formId = useId();

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
      }}
      aria-labelledby={`${formId}-title`}
      noValidate
    >
      <h2 id={`${formId}-title`} className="text-2xl font-bold mb-6">
        {title}
      </h2>

      {/* Error summary for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-labelledby="error-summary-title"
          className="mb-6 p-4 border border-destructive bg-destructive/10 rounded-lg"
        >
          <h3 id="error-summary-title" className="font-semibold text-destructive mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field} className="text-sm text-destructive">
                <a href={`#${field}`} className="underline hover:no-underline">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </form>
  );
};

// ✅ Accessible Input Component
export const AccessibleInput: React.FC<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({
  label,
  name,
  type = 'text',
  required = false,
  error,
  description,
  value,
  onChange
}) => {
  const inputId = useId();
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-describedby={cn(descriptionId, errorId)}
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive'
        )}
      />

      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

// ✅ Accessible Modal Component
export const AccessibleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ✅ Skip Navigation Link
export const SkipNavigation: React.FC = () => (
  <a
    href="#main-content"
    className={cn(
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
      'bg-background text-foreground px-4 py-2 rounded-md border',
      'focus:z-50 focus:outline-none focus:ring-2 focus:ring-ring'
    )}
  >
    Skip to main content
  </a>
);
```

## ERROR HANDLING STANDARDS (PRODUCTION)

### Comprehensive Error Handling

```typescript
// ✅ Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ComponentType<any> },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to monitoring service
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined') {
      // Log to external service
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Implementation for error tracking service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

// ✅ Default Error Fallback
const DefaultErrorFallback: React.FC<{
  error: Error | null;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full mx-4 text-center">
      <div className="mb-6">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        We're sorry, but something unexpected happened. Please try again.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-6 text-left">
          <summary className="cursor-pointer mb-2 font-medium">
            Error Details (Development)
          </summary>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
      <div className="space-x-4">
        <Button onClick={resetError}>
          Try Again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    </div>
  </div>
);

// ✅ API Error Handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Response) {
    throw new ApiError(
      `HTTP Error: ${error.status} ${error.statusText}`,
      error.status
    );
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500, 'UNKNOWN_ERROR', error);
  }

  throw new ApiError('An unknown error occurred', 500, 'UNKNOWN_ERROR');
};

// ✅ Custom Error Hook
export const useErrorHandler = () => {
  const { toast } = useToast();

  return useCallback((error: unknown, context?: string) => {
    let message = 'An unexpected error occurred';
    let title = 'Error';

    if (error instanceof ApiError) {
      message = error.message;
      title = `Error ${error.status}`;
    } else if (error instanceof Error) {
      message = error.message;
    }

    // Log error for debugging
    console.error(`Error in ${context}:`, error);

    // Show user-friendly toast
    toast({
      title,
      description: message,
      variant: 'destructive'
    });

    // Log to monitoring service
    if (typeof window !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error);
    }
  }, [toast]);
};
```

## SECURITY IMPLEMENTATION (PRODUCTION)

### Frontend Security Measures

```typescript
// ✅ Content Security Policy Component
export const SecurityHeaders: React.FC = () => (
  <Head>
    <meta
      httpEquiv="Content-Security-Policy"
      content={`
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https: blob:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL};
        frame-src 'none';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim()}
    />
    <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
    <meta httpEquiv="X-Frame-Options" content="DENY" />
    <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
  </Head>
);

// ✅ Input Sanitization Hook
export const useSanitizedInput = () => {
  return useCallback((input: string, options: { allowHtml?: boolean } = {}) => {
    if (options.allowHtml) {
      // Use DOMPurify for HTML content
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: ['href', 'title'],
        ALLOW_DATA_ATTR: false
      });
    }

    // Basic text sanitization
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .trim();
  }, []);
};

// ✅ CSRF Protection Hook
export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    // Fetch CSRF token from API
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token))
      .catch(console.error);
  }, []);

  return csrfToken;
};
```

## PERFORMANCE MONITORING (PRODUCTION)

### Advanced Performance Tracking

```typescript
// ✅ Performance Monitoring Hook
export const usePerformanceMonitoring = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    // Log slow renders
    if (renderTime > 16) {
      // More than one frame at 60fps
      console.warn(
        `Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`
      );
    }

    // Track render performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_render', {
        component_name: componentName,
        render_time: renderTime,
        render_count: renderCount.current,
      });
    }

    startTime.current = performance.now();
  });

  return { renderCount: renderCount.current };
};

// ✅ Bundle Size Monitoring
export const bundleAnalysis = {
  // Webpack Bundle Analyzer configuration
  analyzeBundle: process.env.ANALYZE === 'true',

  // Bundle size limits
  maxBundleSize: 250 * 1024, // 250KB
  maxChunkSize: 100 * 1024, // 100KB

  // Performance budget
  performanceBudget: {
    javascript: 250,
    css: 50,
    images: 500,
    fonts: 100,
    total: 1000,
  },
};
```

## DEPLOYMENT STANDARDS (PRODUCTION)

### Environment Configuration

```typescript
// ✅ Environment Variables Schema
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SENTRY_DSN: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// ✅ Health Check Endpoint
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check external services
    const services = await Promise.allSettled([
      fetch(env.API_URL + '/health', { method: 'HEAD' }),
      // Add other service checks
    ]);

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: services.map((result, index) => ({
        name: ['api'][index],
        status: result.status === 'fulfilled' ? 'healthy' : 'unhealthy'
      }))
    };

    return NextResponse.json(healthStatus);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}

// ✅ Docker Health Check
// Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## CODE GENERATION RULES (PRODUCTION STANDARDS)

### Mandatory Checklist for All Generated Code

When generating ANY code, ALWAYS ensure:

1. **Responsive Design**: Mobile-first approach with proper breakpoints
2. **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels
3. **Error Handling**: Comprehensive error boundaries and user feedback
4. **Performance**: Optimized rendering and bundle size
5. **Security**: Input validation and output sanitization
6. **Testing**: Unit tests and accessibility tests included
7. **TypeScript**: Strict typing with proper interfaces
8. **Documentation**: Clear comments and JSDoc for complex logic
9. **SEO**: Proper meta tags and semantic HTML structure
10. **Production Ready**: Environment variables and deployment considerations

### Production Code Generation Prompts

Use these prompts to ensure production-ready code:

- "Generate this component with full responsive design, accessibility, and error handling"
- "Create this API with comprehensive validation, security, and monitoring"
- "Build this feature with TypeScript, testing, and production deployment ready"
- "Implement this with WCAG 2.1 AA compliance and mobile-first responsive design"
- "Add comprehensive error boundaries and user feedback to this component"
- "Create this with proper SEO, performance optimization, and security measures"
- "Generate this form with validation, accessibility, and error handling"
- "Build this dashboard with responsive layout, loading states, and error boundaries"

### Production Review Checklist

Before deploying generated code, verify:

- [ ] Responsive design works across all device sizes
- [ ] Accessibility requirements are met (WCAG 2.1 AA)
- [ ] Error handling is comprehensive and user-friendly
- [ ] Performance meets production standards
- [ ] Security measures are implemented
- [ ] TypeScript types are properly defined
- [ ] Tests are written and passing
- [ ] Documentation is clear and complete
- [ ] SEO considerations are addressed
- [ ] Production environment variables are configured
- [ ] Monitoring and logging are in place
- [ ] Code follows established patterns and conventions
