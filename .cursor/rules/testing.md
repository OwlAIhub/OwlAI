# TESTING RULES

# Comprehensive testing guidelines for production-ready applications

## TESTING PHILOSOPHY & STRATEGY

### Testing Pyramid (Production Standards)

```
    /\     E2E Tests (10%)
   /  \    - Critical user journeys
  /____\   - Cross-browser compatibility
 /      \  - Performance regression
/__________\ Integration Tests (20%)
/          \ - API endpoints
/          \ - Database operations
/          \ - Service interactions
/____________\ Unit Tests (70%)
              - Pure functions
              - Component logic
              - Business rules
              - Edge cases
```

### Test-Driven Development (TDD) Approach

```typescript
// ✅ TDD Cycle Implementation
describe('UserService.createUser', () => {
  // 1. RED: Write failing test first
  it('should create a new user with valid data', async () => {
    const userData = {
      email: 'john@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    const result = await UserService.createUser(userData);

    expect(result).toMatchObject({
      id: expect.any(String),
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(result.password).toBeUndefined(); // Password should not be returned
  });

  // 2. GREEN: Write minimal code to make test pass
  // 3. REFACTOR: Improve code while keeping tests green
});
```

### Coverage Requirements

- **Unit Tests**: Minimum 80% line coverage, 70% branch coverage
- **Integration Tests**: 100% coverage of critical API endpoints
- **E2E Tests**: 100% coverage of primary user flows
- **Accessibility Tests**: 100% coverage of interactive components
- **Performance Tests**: All critical paths under performance budget

## UNIT TESTING STANDARDS

### Jest Configuration (Production Setup)

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts',
    '<rootDir>/src/test/mocks.ts',
  ],
  testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/types/**/*',
    '!src/**/*.stories.*',
    '!src/**/index.ts', // Barrel exports
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Stricter requirements for critical modules
    './src/services/': {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/utils/': {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testTimeout: 10000,
  maxWorkers: '50%', // Use half of available CPU cores

  // Mock external dependencies
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/test/mocks/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

// src/test/setup.ts
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import { server } from './mocks/server';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
```

### React Component Testing (Production Patterns)

```typescript
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserProfile } from './UserProfile';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

expect.extend(toHaveNoViolations);

// ✅ Test utility for rendering with providers
const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    user?: User;
    queryClient?: QueryClient;
    route?: string;
  } = {}
) => {
  const {
    user = mockUser,
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    }),
    route = '/'
  } = options;

  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <UserProvider initialUser={user}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options })
  };
};

describe('UserProfile Component', () => {
  const mockUser = {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders user information correctly', () => {
      renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      renderWithProviders(<UserProfile userId="1" />);

      expect(screen.getByTestId('user-profile-skeleton')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('displays error state when user fetch fails', async () => {
      // Mock API error
      server.use(
        rest.get('/api/users/1', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      renderWithProviders(<UserProfile userId="1" />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load user profile/i)).toBeInTheDocument();
      });
    });

    it('handles empty state when user not found', async () => {
      server.use(
        rest.get('/api/users/1', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: 'User not found' }));
        })
      );

      renderWithProviders(<UserProfile userId="1" />);

      await waitFor(() => {
        expect(screen.getByText(/user not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('enables edit mode when edit button is clicked', async () => {
      const { user } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Click edit button
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Verify edit mode is enabled
      expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('saves changes and shows success message', async () => {
      const mockOnUpdate = jest.fn();
      const { user } = renderWithProviders(
        <UserProfile userId="1" onUpdate={mockOnUpdate} />,
        { user: mockUser }
      );

      // Enter edit mode
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Update first name
      const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Save changes
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Verify success
      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            firstName: 'Jane'
          })
        );
        expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
      });
    });

    it('cancels edit mode without saving changes', async () => {
      const { user } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      // Enter edit mode
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Make changes
      const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Cancel
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      // Verify changes were not saved
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('validates form fields before saving', async () => {
      const { user } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      // Enter edit mode
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Clear required field
      const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
      await user.clear(firstNameInput);

      // Try to save
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Verify validation error
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', async () => {
      renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Tab to edit button
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.focus();
      expect(editButton).toHaveFocus();

      // Enter to activate
      fireEvent.keyDown(editButton, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
      });
    });

    it('traps focus in edit mode', async () => {
      const { user } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      // Enter edit mode
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Get all focusable elements
      const firstNameInput = screen.getByRole('textbox', { name: /first name/i });
      const lastNameInput = screen.getByRole('textbox', { name: /last name/i });
      const saveButton = screen.getByRole('button', { name: /save/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      // Test tab order
      firstNameInput.focus();
      expect(firstNameInput).toHaveFocus();

      await user.tab();
      expect(lastNameInput).toHaveFocus();

      await user.tab();
      expect(saveButton).toHaveFocus();

      await user.tab();
      expect(cancelButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels and roles', () => {
      renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      const profileSection = screen.getByRole('region', { name: /user profile/i });
      expect(profileSection).toBeInTheDocument();

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      expect(editButton).toHaveAttribute('aria-describedby');
    });

    it('announces dynamic content changes to screen readers', async () => {
      const { user } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter edit mode
      await user.click(screen.getByRole('button', { name: /edit profile/i }));

      // Verify screen reader announcement
      expect(screen.getByRole('status')).toHaveTextContent(/edit mode enabled/i);
    });

    it('supports high contrast mode', () => {
      renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      const profileCard = screen.getByTestId('user-profile-card');
      expect(profileCard).toHaveClass('border'); // Ensure borders are visible in high contrast
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      // Mock network error
      server.use(
        rest.get('/api/users/1', (req, res) => {
          return res.networkError('Network error');
        })
      );

      renderWithProviders(<UserProfile userId="1" />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('shows appropriate error messages for different error types', async () => {
      const errorCases = [
        { status: 403, message: /access denied/i },
        { status: 404, message: /user not found/i },
        { status: 500, message: /server error/i }
      ];

      for (const { status, message } of errorCases) {
        server.use(
          rest.get('/api/users/1', (req, res, ctx) => {
            return res(ctx.status(status));
          })
        );

        renderWithProviders(<UserProfile userId="1" />);

        await waitFor(() => {
          expect(screen.getByText(message)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Performance', () => {
    it('renders within performance budget', async () => {
      const startTime = performance.now();

      renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within one frame at 60fps (16.67ms)
      expect(renderTime).toBeLessThan(16.67);
    });

    it('does not cause memory leaks', () => {
      const { unmount } = renderWithProviders(<UserProfile userId="1" />, { user: mockUser });

      // Check initial memory
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Unmount component
      unmount();

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Check memory after cleanup
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory should not increase significantly
      expect(finalMemory - initialMemory).toBeLessThan(1024 * 1024); // Less than 1MB
    });
  });
});
```

### Custom Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with default value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('initializes with stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const mockSetItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('localStorage is full');
      });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // Value should still update in state even if localStorage fails
    expect(result.current[0]).toBe('new-value');

    mockSetItem.mockRestore();
  });

  it('supports function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('handles complex objects correctly', () => {
    const complexObject = {
      name: 'John',
      age: 30,
      preferences: { theme: 'dark' },
    };

    const { result } = renderHook(() => useLocalStorage('user', complexObject));

    expect(result.current[0]).toEqual(complexObject);

    act(() => {
      result.current[1]({ ...complexObject, age: 31 });
    });

    expect(result.current[0].age).toBe(31);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual({
      ...complexObject,
      age: 31,
    });
  });
});
```

## INTEGRATION TESTING

### API Testing with MSW (Mock Service Worker)

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/user';

const users: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

export const handlers = [
  // Get user by ID
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
      return res(ctx.status(404), ctx.json({ error: 'User not found' }));
    }

    return res(ctx.json(user));
  }),

  // Create user
  rest.post('/api/users', async (req, res, ctx) => {
    const userData = (await req.json()) as CreateUserRequest;

    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Missing required fields' })
      );
    }

    // Check for duplicate email
    if (users.some(u => u.email === userData.email)) {
      return res(ctx.status(409), ctx.json({ error: 'Email already exists' }));
    }

    const newUser: User = {
      id: String(users.length + 1),
      ...userData,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return res(ctx.status(201), ctx.json(newUser));
  }),

  // Update user
  rest.put('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updateData = (await req.json()) as UpdateUserRequest;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res(ctx.status(404), ctx.json({ error: 'User not found' }));
    }

    users[userIndex] = { ...users[userIndex], ...updateData };

    return res(ctx.json(users[userIndex]));
  }),

  // Delete user
  rest.delete('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res(ctx.status(404), ctx.json({ error: 'User not found' }));
    }

    users.splice(userIndex, 1);

    return res(ctx.status(204));
  }),

  // Authentication
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 200));

    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.json({
          user: users[0],
          token: 'mock-jwt-token',
        })
      );
    }

    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),

  // Error simulation
  rest.get('/api/error-test', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
  }),
];

// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Service Layer Testing

```typescript
import { UserService } from '@/services/user';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

describe('UserService', () => {
  describe('getUser', () => {
    it('returns user data for valid ID', async () => {
      const user = await UserService.getUser('1');

      expect(user).toMatchObject({
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('throws error for non-existent user', async () => {
      await expect(UserService.getUser('999')).rejects.toThrow(
        'User not found'
      );
    });

    it('handles network errors appropriately', async () => {
      server.use(
        rest.get('/api/users/1', (req, res) => {
          return res.networkError('Network error');
        })
      );

      await expect(UserService.getUser('1')).rejects.toThrow('Network error');
    });
  });

  describe('createUser', () => {
    it('creates user with valid data', async () => {
      const userData = {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'SecurePass123!',
      };

      const user = await UserService.createUser(userData);

      expect(user).toMatchObject({
        id: expect.any(String),
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(user.password).toBeUndefined();
    });

    it('throws validation error for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        firstName: '',
        lastName: 'Smith',
      };

      await expect(UserService.createUser(invalidData)).rejects.toThrow(
        'Validation failed'
      );
    });

    it('throws error for duplicate email', async () => {
      const userData = {
        email: 'john@example.com', // Already exists
        firstName: 'John',
        lastName: 'Duplicate',
        password: 'SecurePass123!',
      };

      await expect(UserService.createUser(userData)).rejects.toThrow(
        'Email already exists'
      );
    });
  });

  describe('updateUser', () => {
    it('updates user with valid data', async () => {
      const updateData = {
        firstName: 'Johnny',
        lastName: 'Smith',
      };

      const updatedUser = await UserService.updateUser('1', updateData);

      expect(updatedUser).toMatchObject({
        id: '1',
        firstName: 'Johnny',
        lastName: 'Smith',
      });
    });

    it('handles partial updates correctly', async () => {
      const updateData = { firstName: 'Johnny' };

      const updatedUser = await UserService.updateUser('1', updateData);

      expect(updatedUser.firstName).toBe('Johnny');
      expect(updatedUser.lastName).toBe('Doe'); // Should remain unchanged
    });
  });

  describe('Authentication', () => {
    it('authenticates with valid credentials', async () => {
      const result = await UserService.login('test@example.com', 'password');

      expect(result).toMatchObject({
        user: expect.objectContaining({
          email: 'test@example.com',
        }),
        token: expect.any(String),
      });
    });

    it('rejects invalid credentials', async () => {
      await expect(
        UserService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

## END-TO-END TESTING

### Playwright Configuration (Production Setup)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Patterns (Production Quality)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await loginPage.login('test@example.com', 'password');

    await expect(page).toHaveURL('/dashboard');
    await expect(dashboardPage.welcomeMessage).toBeVisible();
    await expect(dashboardPage.userMenu).toContainText('test@example.com');
  });

  test('invalid credentials show error message', async ({ page }) => {
    await loginPage.login('invalid@example.com', 'wrongpassword');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
    await expect(page).toHaveURL('/login');
  });

  test('form validation prevents submission with empty fields', async ({
    page,
  }) => {
    await loginPage.submitButton.click();

    // Check for HTML5 validation or custom validation messages
    await expect(loginPage.emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(loginPage.passwordInput).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Should still be on login page
    await expect(page).toHaveURL('/login');
  });

  test('remembers user session after page refresh', async ({ page }) => {
    await loginPage.login('test@example.com', 'password');
    await expect(page).toHaveURL('/dashboard');

    // Refresh page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL('/dashboard');
    await expect(dashboardPage.userMenu).toBeVisible();
  });

  test('logout functionality works correctly', async ({ page }) => {
    await loginPage.login('test@example.com', 'password');
    await expect(page).toHaveURL('/dashboard');

    await dashboardPage.logout();

    await expect(page).toHaveURL('/login');
    await expect(loginPage.loginForm).toBeVisible();
  });

  test('protected routes redirect to login when not authenticated', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL('/login');
    await expect(loginPage.loginForm).toBeVisible();
  });
});

// e2e/pages/LoginPage.ts - Page Object Model
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get loginForm() {
    return this.page.getByRole('form', { name: /login/i });
  }
  get emailInput() {
    return this.page.getByRole('textbox', { name: /email/i });
  }
  get passwordInput() {
    return this.page.getByRole('textbox', { name: /password/i });
  }
  get submitButton() {
    return this.page.getByRole('button', { name: /sign in/i });
  }
  get errorMessage() {
    return this.page.getByRole('alert');
  }
  get forgotPasswordLink() {
    return this.page.getByRole('link', { name: /forgot password/i });
  }

  // Actions
  async goto() {
    await this.page.goto('/login');
    await expect(this.loginForm).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submitButton.click();
  }

  async expectToBeVisible() {
    await expect(this.loginForm).toBeVisible();
  }
}

// e2e/user-profile.spec.ts
test.describe('User Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/dashboard');

    // Navigate to profile
    await page.getByRole('button', { name: /user menu/i }).click();
    await page.getByRole('link', { name: /profile/i }).click();

    await expect(page).toHaveURL('/profile');
  });

  test('displays user information correctly', async ({ page }) => {
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /edit profile/i })
    ).toBeVisible();
  });

  test('allows user to update profile information', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: /edit profile/i }).click();

    // Update first name
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    await firstNameInput.fill('Jane');

    // Update last name
    const lastNameInput = page.getByRole('textbox', { name: /last name/i });
    await lastNameInput.fill('Smith');

    // Save changes
    await page.getByRole('button', { name: /save/i }).click();

    // Verify success message
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible();

    // Verify updated information is displayed
    await expect(page.getByText('Jane Smith')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: /edit profile/i }).click();

    // Clear required field
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    await firstNameInput.fill('');

    // Try to save
    await page.getByRole('button', { name: /save/i }).click();

    // Verify validation error
    await expect(page.getByText(/first name is required/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  test('cancels edit mode without saving changes', async ({ page }) => {
    const originalName = await page.getByTestId('user-name').textContent();

    // Enter edit mode
    await page.getByRole('button', { name: /edit profile/i }).click();

    // Make changes
    await page.getByRole('textbox', { name: /first name/i }).fill('Changed');

    // Cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify changes were not saved
    await expect(page.getByTestId('user-name')).toHaveText(originalName || '');
  });
});
```

### Visual Regression Testing

```typescript
// e2e/visual.spec.ts
test.describe('Visual Regression Tests', () => {
  test('homepage layout matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for animations to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('dashboard layout on different screen sizes', async ({ page }) => {
    await page.goto('/login');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');

    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('dashboard-desktop.png');

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('dashboard-tablet.png');

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('dashboard-mobile.png');
  });

  test('form components render correctly', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Test normal state
    await expect(page.getByRole('form')).toHaveScreenshot(
      'contact-form-normal.png'
    );

    // Test error state
    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForSelector('[aria-invalid="true"]');
    await expect(page.getByRole('form')).toHaveScreenshot(
      'contact-form-errors.png'
    );

    // Test filled state
    await page.getByRole('textbox', { name: /name/i }).fill('John Doe');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('john@example.com');
    await page.getByRole('textbox', { name: /message/i }).fill('Test message');
    await expect(page.getByRole('form')).toHaveScreenshot(
      'contact-form-filled.png'
    );
  });
});
```

## ACCESSIBILITY TESTING

### Automated Accessibility Testing

```typescript
// src/test/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { UserProfile } from '@/components/UserProfile';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/pages/Dashboard';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('UserProfile Component', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<UserProfile userId="1" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper heading hierarchy', () => {
      render(<UserProfile userId="1" />);

      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));

      // Check that heading levels don't skip (e.g., h1 -> h3)
      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it('has sufficient color contrast', async () => {
      const { container } = render(<UserProfile userId="1" />);
      const results = await axe(container, {
        rules: { 'color-contrast': { enabled: true } }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Accessibility', () => {
    it('LoginForm has proper form labels and associations', async () => {
      const { container } = render(<LoginForm />);

      // Check axe violations
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check specific form requirements
      const emailInput = container.querySelector('input[type="email"]');
      const passwordInput = container.querySelector('input[type="password"]');

      expect(emailInput).toHaveAttribute('aria-describedby');
      expect(passwordInput).toHaveAttribute('aria-describedby');

      // Check labels are properly associated
      const emailLabel = container.querySelector('label[for]');
      expect(emailLabel).toBeInTheDocument();
    });

    it('shows proper error announcements', async () => {
      const { container, getByRole } = render(<LoginForm />);

      // Submit form to trigger validation
      const submitButton = getByRole('button', { name: /submit/i });
      submitButton.click();

      // Check for error announcements
      const errorRegion = container.querySelector('[role="alert"]');
      expect(errorRegion).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Dynamic Content Accessibility', () => {
    it('announces content changes to screen readers', async () => {
      const { container } = render(<Dashboard />);

      // Check for live regions
      const liveRegions = container.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', () => {
      render(<UserProfile userId="1" />);

      // Check that interactive elements are focusable
      const interactiveElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      interactiveElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('has proper focus management in modals', async () => {
      const { container } = render(<UserProfile userId="1" />);

      // Open modal
      const editButton = container.querySelector('button[aria-label*="edit"]');
      editButton?.click();

      // Check modal focus management
      const modal = container.querySelector('[role="dialog"]');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('aria-modal', 'true');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### E2E Accessibility Testing

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('E2E Accessibility Tests', () => {
  test('homepage is accessible', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login flow is keyboard accessible', async ({ page }) => {
    await page.goto('/login');

    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: /email/i })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('textbox', { name: /password/i })
    ).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused();

    // Test form submission with keyboard
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/dashboard');
  });

  test('modal dialogs trap focus correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Open modal
    await page.getByRole('button', { name: /settings/i }).click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Check focus trap
    const firstFocusable = modal.getByRole('button').first();
    const lastFocusable = modal.getByRole('button').last();

    await expect(firstFocusable).toBeFocused();

    // Tab to last element
    while (
      !(await lastFocusable.isDisabled()) &&
      !(await lastFocusable.evaluate(el => el === document.activeElement))
    ) {
      await page.keyboard.press('Tab');
    }

    // Tab once more should cycle back to first
    await page.keyboard.press('Tab');
    await expect(firstFocusable).toBeFocused();
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('screen reader announcements work correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for live regions
    const liveRegions = await page.locator('[aria-live]').count();
    expect(liveRegions).toBeGreaterThan(0);

    // Test dynamic content announcements
    await page.getByRole('button', { name: /refresh/i }).click();

    const statusRegion = page.locator('[role="status"]');
    await expect(statusRegion).toBeVisible();
  });
});
```

## PERFORMANCE TESTING

### Performance Testing with Lighthouse

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Performance Tests', () => {
  test('homepage meets Lighthouse performance standards', async ({ page }) => {
    await page.goto('/');

    await playAudit({
      page,
      thresholds: {
        performance: 90,
        accessibility: 95,
        'best-practices': 90,
        seo: 90,
        pwa: 70,
      },
      port: 9222,
    });
  });

  test('dashboard loads within performance budget', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page
      .getByRole('textbox', { name: /email/i })
      .fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Measure dashboard load time
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    await playAudit({
      page,
      thresholds: {
        performance: 85, // Slightly lower for authenticated pages
        accessibility: 95,
        'best-practices': 90,
      },
      port: 9222,
    });
  });

  test('large data tables render efficiently', async ({ page }) => {
    await page.goto('/users?limit=1000'); // Large dataset

    const startTime = Date.now();
    await page.waitForSelector('[data-testid="user-table"]');
    const renderTime = Date.now() - startTime;

    // Should render within 2 seconds even with large data
    expect(renderTime).toBeLessThan(2000);

    // Check for virtualization
    const visibleRows = await page.locator('tbody tr').count();
    expect(visibleRows).toBeLessThan(100); // Should be virtualized
  });

  test('image loading is optimized', async ({ page }) => {
    await page.goto('/gallery');

    // Monitor network requests
    const imageRequests: any[] = [];
    page.on('response', response => {
      if (
        response.url().includes('.jpg') ||
        response.url().includes('.png') ||
        response.url().includes('.webp')
      ) {
        imageRequests.push({
          url: response.url(),
          size: response.headers()['content-length'],
          format: response.url().split('.').pop(),
        });
      }
    });

    await page.waitForLoadState('networkidle');

    // Check that modern formats are being served
    const modernFormats = imageRequests.filter(
      req => req.format === 'webp' || req.format === 'avif'
    );
    expect(modernFormats.length).toBeGreaterThan(0);

    // Check image sizes are reasonable
    imageRequests.forEach(req => {
      const sizeKB = parseInt(req.size) / 1024;
      expect(sizeKB).toBeLessThan(500); // No image should be larger than 500KB
    });
  });
});
```

### Load Testing (Artillery.js)

```yaml
# artillery.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Ramp up load'
    - duration: 300
      arrivalRate: 100
      name: 'Sustained load'
  variables:
    users:
      - 'user1@example.com'
      - 'user2@example.com'
      - 'user3@example.com'

scenarios:
  - name: 'User Login and Browse'
    weight: 70
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: '{{ users }}'
            password: 'password'
          capture:
            - json: '$.token'
              as: 'authToken'
      - get:
          url: '/api/dashboard'
          headers:
            Authorization: 'Bearer {{ authToken }}'
      - get:
          url: '/api/users/profile'
          headers:
            Authorization: 'Bearer {{ authToken }}'
      - think: 5

  - name: 'Anonymous Browse'
    weight: 30
    flow:
      - get:
          url: '/'
      - get:
          url: '/about'
      - get:
          url: '/contact'
      - think: 3
```

## CODE GENERATION TESTING RULES

### Mandatory Testing Checklist for All Generated Code

When generating ANY code, ALWAYS include:

1. **Unit Tests**: Component logic, edge cases, error handling
2. **Integration Tests**: API interactions, service integrations
3. **Accessibility Tests**: WCAG compliance, keyboard navigation
4. **Performance Tests**: Render time, memory usage
5. **Error Handling Tests**: Network failures, validation errors
6. **Responsive Tests**: Multiple screen sizes and orientations
7. **Mock Setup**: Proper MSW handlers for API testing
8. **Test Utilities**: Render helpers, custom matchers
9. **Coverage Requirements**: Meet minimum coverage thresholds
10. **E2E Tests**: Critical user journeys and workflows

### Testing Code Generation Prompts

Use these prompts to ensure comprehensive testing:

- "Generate this component with complete test suite including unit, accessibility, and performance tests"
- "Create this API with full integration tests, error handling, and load testing scenarios"
- "Build this feature with TDD approach including failing tests first"
- "Implement this with comprehensive accessibility testing and keyboard navigation tests"
- "Add E2E tests covering all user flows and edge cases for this feature"
- "Create this with proper mock setup and test utilities"
- "Generate performance tests to ensure this meets budget requirements"
- "Include visual regression tests for this UI component"

### Testing Review Checklist

Before deploying generated code, verify:

- [ ] Unit tests cover all component logic and edge cases
- [ ] Integration tests verify API interactions work correctly
- [ ] Accessibility tests ensure WCAG 2.1 AA compliance
- [ ] Performance tests validate render time and memory usage
- [ ] Error handling tests cover network failures and validation
- [ ] Responsive tests work across all target devices
- [ ] E2E tests cover critical user journeys
- [ ] Mock setup is comprehensive and realistic
- [ ] Test coverage meets or exceeds thresholds
- [ ] All tests pass consistently in CI/CD pipeline
- [ ] Visual regression tests catch UI changes
- [ ] Load tests validate system handles expected traffic

### Testing Standards Summary

**Test Coverage Requirements:**

- Unit Tests: 80% minimum
- Integration Tests: 100% of API endpoints
- E2E Tests: 100% of critical user flows
- Accessibility Tests: 100% of interactive components
- Performance Tests: All performance-critical components

**Quality Gates:**

- All tests must pass before merge
- Coverage thresholds must be met
- Performance budgets must not be exceeded
- Accessibility violations must be zero
- Load tests must pass under expected traffic

**Continuous Integration:**

- Tests run on every pull request
- Performance regression detection
- Accessibility scanning in CI
- Visual regression testing
- Load testing in staging environment
