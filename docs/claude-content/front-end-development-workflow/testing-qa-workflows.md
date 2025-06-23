# Frontend Testing and Quality Assurance Workflows

## Testing Strategy Overview

### Testing Pyramid
```
    🔺 E2E Tests (5-10%)
      - User journey testing
      - Cross-browser compatibility
      - Performance testing

  🔺🔺 Integration Tests (15-25%)
      - Component integration
      - API integration
      - Hook testing

🔺🔺🔺 Unit Tests (70-80%)
      - Component testing
      - Utility function testing
      - Business logic testing
```

## Unit Testing with Vitest

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.ts',
        '**/*.stories.{js,ts,jsx,tsx}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup
```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Setup fetch mock
global.fetch = vi.fn()
```

### Test Utilities
```typescript
// src/tests/utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockPost = (overrides = {}) => ({
  id: '1',
  title: 'Test Post',
  content: 'This is a test post content',
  author: createMockUser(),
  publishedAt: '2024-01-01T00:00:00Z',
  tags: ['test', 'example'],
  ...overrides,
})

// Custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received !== null
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    }
  },
})
```

### Component Testing Examples
```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@/tests/utils'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-primary')
  })

  it('renders different variants', () => {
    const { rerender } = render(<Button variant="secondary">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')

    rerender(<Button variant="destructive">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Loading spinner
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Test</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
```

### Form Testing
```typescript
// src/components/forms/ContactForm/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@/tests/utils'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

const mockSubmit = vi.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<ContactForm onSubmit={mockSubmit} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/subject must be at least 5 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
    
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject')
    await user.type(screen.getByLabelText(/message/i), 'This is a test message')
    
    await user.click(screen.getByRole('button', { name: /send message/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      })
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockSubmit} isLoading />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Loading spinner
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<ContactForm onSubmit={mockSubmit} />)
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    
    // Simulate successful submission
    rerender(<ContactForm onSubmit={mockSubmit} isLoading={false} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('')
      expect(screen.getByLabelText(/email/i)).toHaveValue('')
    })
  })
})
```

### Hook Testing
```typescript
// src/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { authService } from '@/services/auth'

// Mock the auth service
vi.mock('@/services/auth')
const mockAuthService = authService as vi.Mocked<typeof authService>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial state correctly', () => {
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('handles login successfully', async () => {
    const mockUser = { id: '1', name: 'John', email: 'john@example.com', token: 'abc123' }
    mockAuthService.login.mockResolvedValue({ user: mockUser })
    
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login({ email: 'john@example.com', password: 'password' })
    })
    
    expect(result.current.isLoginLoading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isLoginLoading).toBe(false)
    })
  })

  it('handles login failure', async () => {
    const mockError = new Error('Invalid credentials')
    mockAuthService.login.mockRejectedValue(mockError)
    
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    act(() => {
      result.current.login({ email: 'john@example.com', password: 'wrong' })
    })
    
    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoginLoading).toBe(false)
    })
  })

  it('handles logout', async () => {
    mockAuthService.logout.mockResolvedValue()
    
    const wrapper = createWrapper()
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // Set initial user state
    act(() => {
      result.current.setUser({ id: '1', name: 'John', token: 'abc123' })
    })
    
    act(() => {
      result.current.logout()
    })
    
    await waitFor(() => {
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
```

## Integration Testing

### API Integration Testing with MSW
```typescript
// src/tests/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body as any
    
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            token: 'mock-token',
          },
        })
      )
    }
    
    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    )
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200))
  }),

  rest.get('/api/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization')
    
    if (authHeader === 'Bearer mock-token') {
      return res(
        ctx.status(200),
        ctx.json({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        })
      )
    }
    
    return res(ctx.status(401))
  }),

  // Users endpoints
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
      ])
    )
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params
    
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
      })
    )
  }),

  rest.post('/api/users', (req, res, ctx) => {
    const user = req.body as any
    
    return res(
      ctx.status(201),
      ctx.json({
        id: Date.now().toString(),
        ...user,
      })
    )
  }),
]
```

```typescript
// src/tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

```typescript
// src/tests/setup.ts (addition to existing setup)
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that are declared in individual tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())
```

### Component Integration Testing
```typescript
// src/components/UserList/UserList.integration.test.tsx
import { render, screen, waitFor } from '@/tests/utils'
import { server } from '@/tests/mocks/server'
import { rest } from 'msw'
import { UserList } from './UserList'

describe('UserList Integration', () => {
  it('loads and displays users', async () => {
    render(<UserList />)
    
    // Should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    // Should show users after loading
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.getByText('User 2')).toBeInTheDocument()
    })
    
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    // Override the handler to return an error
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }))
      })
    )
    
    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
    })
  })

  it('supports search functionality', async () => {
    render(<UserList />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })
    
    // Search for specific user
    const searchInput = screen.getByPlaceholderText(/search users/i)
    await userEvent.type(searchInput, 'User 1')
    
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
      expect(screen.queryByText('User 2')).not.toBeInTheDocument()
    })
  })

  it('allows creating new users', async () => {
    const user = userEvent.setup()
    render(<UserList />)
    
    // Click add user button
    await user.click(screen.getByText(/add user/i))
    
    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'New User')
    await user.type(screen.getByLabelText(/email/i), 'new@example.com')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Should see success message
    await waitFor(() => {
      expect(screen.getByText(/user created successfully/i)).toBeInTheDocument()
    })
    
    // Should refresh user list
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument()
    })
  })
})
```

## End-to-End Testing with Playwright

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

### Page Object Model
```typescript
// tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.loginButton = page.getByRole('button', { name: 'Login' })
    this.errorMessage = page.getByTestId('error-message')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent()
  }
}
```

```typescript
// tests/e2e/pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly welcomeMessage: Locator
  readonly userMenu: Locator
  readonly logoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.welcomeMessage = page.getByTestId('welcome-message')
    this.userMenu = page.getByTestId('user-menu')
    this.logoutButton = page.getByRole('button', { name: 'Logout' })
  }

  async isVisible() {
    return await this.welcomeMessage.isVisible()
  }

  async logout() {
    await this.userMenu.click()
    await this.logoutButton.click()
  }
}
```

### E2E Test Examples
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

test.describe('Authentication', () => {
  test('successful login flow', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.login('test@example.com', 'password')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(dashboardPage.welcomeMessage).toBeVisible()
  })

  test('login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.goto()
    await loginPage.login('test@example.com', 'wrongpassword')

    // Should show error message
    await expect(loginPage.errorMessage).toBeVisible()
    const errorText = await loginPage.getErrorMessage()
    expect(errorText).toContain('Invalid credentials')
  })

  test('logout flow', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    // Login first
    await loginPage.goto()
    await loginPage.login('test@example.com', 'password')
    await expect(page).toHaveURL('/dashboard')

    // Logout
    await dashboardPage.logout()
    await expect(page).toHaveURL('/login')
  })

  test('protected route redirect', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})
```

```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('view user list', async ({ page }) => {
    await page.goto('/users')
    
    // Should show user list
    await expect(page.getByTestId('user-list')).toBeVisible()
    await expect(page.getByText('User 1')).toBeVisible()
    await expect(page.getByText('User 2')).toBeVisible()
  })

  test('create new user', async ({ page }) => {
    await page.goto('/users')
    
    // Click add user button
    await page.getByRole('button', { name: 'Add User' }).click()
    
    // Fill out form
    await page.getByLabel('Name').fill('New User')
    await page.getByLabel('Email').fill('newuser@example.com')
    await page.getByLabel('Role').selectOption('user')
    
    // Submit form
    await page.getByRole('button', { name: 'Save' }).click()
    
    // Should show success message
    await expect(page.getByText('User created successfully')).toBeVisible()
    
    // Should appear in user list
    await expect(page.getByText('New User')).toBeVisible()
  })

  test('search users', async ({ page }) => {
    await page.goto('/users')
    
    // Search for specific user
    await page.getByPlaceholder('Search users...').fill('User 1')
    
    // Should filter results
    await expect(page.getByText('User 1')).toBeVisible()
    await expect(page.getByText('User 2')).not.toBeVisible()
  })

  test('edit user', async ({ page }) => {
    await page.goto('/users')
    
    // Click edit button for first user
    await page.getByTestId('edit-user-1').click()
    
    // Update name
    await page.getByLabel('Name').fill('Updated User')
    await page.getByRole('button', { name: 'Save' }).click()
    
    // Should show success message
    await expect(page.getByText('User updated successfully')).toBeVisible()
    
    // Should show updated name
    await expect(page.getByText('Updated User')).toBeVisible()
  })

  test('delete user', async ({ page }) => {
    await page.goto('/users')
    
    // Click delete button
    await page.getByTestId('delete-user-2').click()
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Delete' }).click()
    
    // Should show success message
    await expect(page.getByText('User deleted successfully')).toBeVisible()
    
    // Should not appear in list
    await expect(page.getByText('User 2')).not.toBeVisible()
  })
})
```

## Visual Testing

### Visual Regression Testing with Playwright
```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('homepage visual test', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage.png')
  })

  test('login page visual test', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveScreenshot('login-page.png')
  })

  test('dashboard visual test', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Login' }).click()
    
    await page.goto('/dashboard')
    await expect(page).toHaveScreenshot('dashboard.png')
  })

  test('mobile responsive test', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page).toHaveScreenshot('homepage-mobile.png')
  })

  test('dark mode visual test', async ({ page }) => {
    await page.goto('/')
    
    // Enable dark mode
    await page.getByTestId('theme-toggle').click()
    
    await expect(page).toHaveScreenshot('homepage-dark.png')
  })
})
```

## Performance Testing

### Performance Testing with Playwright
```typescript
// tests/e2e/performance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('page load performance', async ({ page }) => {
    // Start navigation
    const navigationStart = Date.now()
    await page.goto('/')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    const navigationEnd = Date.now()
    
    const loadTime = navigationEnd - navigationStart
    console.log(`Page load time: ${loadTime}ms`)
    
    // Assert reasonable load time
    expect(loadTime).toBeLessThan(3000) // 3 seconds
  })

  test('web vitals', async ({ page }) => {
    await page.goto('/')
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              vitals.fid = entry.processingStart - entry.startTime
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = entry.value
            }
          })
          
          resolve(vitals)
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
        
        // Timeout after 10 seconds
        setTimeout(() => resolve({}), 10000)
      })
    })
    
    console.log('Web Vitals:', vitals)
    
    // Assert good Core Web Vitals scores
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2500) // LCP < 2.5s
    if (vitals.fid) expect(vitals.fid).toBeLessThan(100)  // FID < 100ms
    if (vitals.cls) expect(vitals.cls).toBeLessThan(0.1)  // CLS < 0.1
  })

  test('bundle size check', async ({ page }) => {
    const response = await page.goto('/')
    
    // Get network requests
    const requests = []
    page.on('response', (response) => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        requests.push({
          url: response.url(),
          size: response.headers()['content-length']
        })
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Calculate total bundle size
    const totalSize = requests.reduce((sum, req) => {
      return sum + (parseInt(req.size) || 0)
    }, 0)
    
    console.log(`Total bundle size: ${totalSize} bytes`)
    
    // Assert reasonable bundle size (500KB)
    expect(totalSize).toBeLessThan(500 * 1024)
  })
})
```

## Accessibility Testing

### Automated Accessibility Testing
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage accessibility', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('login form accessibility', async ({ page }) => {
    await page.goto('/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/login')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Password')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Login' })).toBeFocused()
  })

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/users')
    
    // Check for proper ARIA labels
    const addButton = page.getByRole('button', { name: 'Add User' })
    await expect(addButton).toHaveAttribute('aria-label', 'Add new user')
    
    // Check for proper headings structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingLevels = await headings.evaluateAll((elements) =>
      elements.map(el => parseInt(el.tagName.substring(1)))
    )
    
    // Ensure heading levels are logical (no skipping)
    for (let i = 1; i < headingLevels.length; i++) {
      expect(headingLevels[i] - headingLevels[i-1]).toBeLessThanOrEqual(1)
    }
  })
})
```

## Quality Assurance Scripts

### Automated QA Script
```bash
#!/bin/bash
# scripts/qa-check.sh - Comprehensive quality assurance check

set -euo pipefail

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Check if project is a React project
check_project_type() {
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found. Not a Node.js project."
        exit 1
    fi
    
    if ! grep -q '"react"' package.json; then
        log_error "React not found in dependencies. Not a React project."
        exit 1
    fi
    
    log_info "React project detected"
}

# Install dependencies if needed
install_dependencies() {
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm ci
    fi
}

# Run linting
run_linting() {
    log_info "Running ESLint..."
    
    if npm run lint 2>/dev/null; then
        log_info "✅ Linting passed"
    else
        log_error "❌ Linting failed"
        return 1
    fi
}

# Run type checking
run_type_checking() {
    log_info "Running TypeScript type checking..."
    
    if npm run type-check 2>/dev/null; then
        log_info "✅ Type checking passed"
    else
        log_error "❌ Type checking failed"
        return 1
    fi
}

# Run unit tests
run_unit_tests() {
    log_info "Running unit tests..."
    
    if npm run test -- --run 2>/dev/null; then
        log_info "✅ Unit tests passed"
    else
        log_error "❌ Unit tests failed"
        return 1
    fi
}

# Run unit tests with coverage
run_coverage() {
    log_info "Running test coverage..."
    
    if npm run test:coverage 2>/dev/null; then
        log_info "✅ Coverage check completed"
    else
        log_error "❌ Coverage check failed"
        return 1
    fi
}

# Build project
run_build() {
    log_info "Building project..."
    
    if npm run build 2>/dev/null; then
        log_info "✅ Build successful"
    else
        log_error "❌ Build failed"
        return 1
    fi
}

# Run E2E tests
run_e2e_tests() {
    log_info "Running E2E tests..."
    
    if command -v playwright >/dev/null 2>&1; then
        if npm run test:e2e 2>/dev/null; then
            log_info "✅ E2E tests passed"
        else
            log_error "❌ E2E tests failed"
            return 1
        fi
    else
        log_warn "Playwright not found, skipping E2E tests"
    fi
}

# Check bundle size
check_bundle_size() {
    log_info "Checking bundle size..."
    
    if [[ -d "dist" ]]; then
        local bundle_size
        bundle_size=$(du -sh dist | cut -f1)
        log_info "Bundle size: $bundle_size"
        
        # Check if bundle is too large (> 5MB)
        local size_bytes
        size_bytes=$(du -s dist | cut -f1)
        if [[ $size_bytes -gt 5120 ]]; then # 5MB in KB
            log_warn "Bundle size is large (> 5MB). Consider optimization."
        fi
    else
        log_warn "Dist directory not found. Run build first."
    fi
}

# Security audit
run_security_audit() {
    log_info "Running security audit..."
    
    if npm audit --audit-level=high 2>/dev/null; then
        log_info "✅ Security audit passed"
    else
        log_error "❌ Security vulnerabilities found"
        return 1
    fi
}

# Check for outdated dependencies
check_outdated_deps() {
    log_info "Checking for outdated dependencies..."
    
    local outdated
    outdated=$(npm outdated --json 2>/dev/null || echo "{}")
    
    if [[ "$outdated" == "{}" ]]; then
        log_info "✅ All dependencies are up to date"
    else
        log_warn "Some dependencies are outdated:"
        echo "$outdated" | jq -r 'to_entries[] | "  \(.key): \(.value.current) -> \(.value.latest)"'
    fi
}

# Performance check
check_performance() {
    log_info "Checking performance metrics..."
    
    if command -v lighthouse >/dev/null 2>&1; then
        # Start dev server in background
        npm run dev &
        local dev_pid=$!
        
        # Wait for server to start
        sleep 10
        
        # Run Lighthouse
        lighthouse http://localhost:3000 --output=json --output-path=lighthouse-report.json --quiet
        
        # Kill dev server
        kill $dev_pid
        
        # Parse results
        local performance_score
        performance_score=$(jq '.categories.performance.score * 100' lighthouse-report.json)
        log_info "Performance score: ${performance_score}%"
        
        if (( $(echo "$performance_score < 80" | bc -l) )); then
            log_warn "Performance score is below 80%"
        fi
        
        rm -f lighthouse-report.json
    else
        log_warn "Lighthouse not found, skipping performance check"
    fi
}

# Generate QA report
generate_report() {
    local report_file="qa-report.json"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > "$report_file" << EOF
{
  "timestamp": "$timestamp",
  "project": "$(jq -r '.name' package.json)",
  "version": "$(jq -r '.version' package.json)",
  "checks": {
    "linting": $LINT_RESULT,
    "typeCheck": $TYPE_CHECK_RESULT,
    "unitTests": $UNIT_TEST_RESULT,
    "coverage": $COVERAGE_RESULT,
    "build": $BUILD_RESULT,
    "e2eTests": $E2E_RESULT,
    "security": $SECURITY_RESULT
  },
  "bundleSize": "$BUNDLE_SIZE",
  "performanceScore": $PERFORMANCE_SCORE
}
EOF
    
    log_info "QA report generated: $report_file"
}

# Main execution
main() {
    local run_all=true
    local skip_e2e=false
    local skip_performance=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-e2e)
                skip_e2e=true
                shift
                ;;
            --skip-performance)
                skip_performance=true
                shift
                ;;
            --fast)
                skip_e2e=true
                skip_performance=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    log_info "Starting QA checks..."
    
    # Initialize result variables
    LINT_RESULT=false
    TYPE_CHECK_RESULT=false
    UNIT_TEST_RESULT=false
    COVERAGE_RESULT=false
    BUILD_RESULT=false
    E2E_RESULT=false
    SECURITY_RESULT=false
    BUNDLE_SIZE="unknown"
    PERFORMANCE_SCORE=0
    
    check_project_type
    install_dependencies
    
    # Run checks
    run_linting && LINT_RESULT=true
    run_type_checking && TYPE_CHECK_RESULT=true
    run_unit_tests && UNIT_TEST_RESULT=true
    run_coverage && COVERAGE_RESULT=true
    run_build && BUILD_RESULT=true
    
    if [[ -d "dist" ]]; then
        check_bundle_size
        BUNDLE_SIZE=$(du -sh dist | cut -f1)
    fi
    
    run_security_audit && SECURITY_RESULT=true
    check_outdated_deps
    
    if [[ "$skip_e2e" != "true" ]]; then
        run_e2e_tests && E2E_RESULT=true
    fi
    
    if [[ "$skip_performance" != "true" ]]; then
        check_performance
    fi
    
    # Summary
    echo
    log_info "QA Check Summary:"
    echo "  Linting: $([ "$LINT_RESULT" = true ] && echo "✅" || echo "❌")"
    echo "  Type Check: $([ "$TYPE_CHECK_RESULT" = true ] && echo "✅" || echo "❌")"
    echo "  Unit Tests: $([ "$UNIT_TEST_RESULT" = true ] && echo "✅" || echo "❌")"
    echo "  Coverage: $([ "$COVERAGE_RESULT" = true ] && echo "✅" || echo "❌")"
    echo "  Build: $([ "$BUILD_RESULT" = true ] && echo "✅" || echo "❌")"
    echo "  Security: $([ "$SECURITY_RESULT" = true ] && echo "✅" || echo "❌")"
    
    if [[ "$skip_e2e" != "true" ]]; then
        echo "  E2E Tests: $([ "$E2E_RESULT" = true ] && echo "✅" || echo "❌")"
    fi
    
    echo "  Bundle Size: $BUNDLE_SIZE"
    
    # Exit with error if any check failed
    if [[ "$LINT_RESULT" != "true" || "$TYPE_CHECK_RESULT" != "true" || "$UNIT_TEST_RESULT" != "true" || "$BUILD_RESULT" != "true" || "$SECURITY_RESULT" != "true" ]]; then
        log_error "Some QA checks failed"
        exit 1
    fi
    
    if [[ "$skip_e2e" != "true" && "$E2E_RESULT" != "true" ]]; then
        log_error "E2E tests failed"
        exit 1
    fi
    
    log_info "All QA checks passed! 🎉"
}

# Run main function
main "$@"
```

This comprehensive testing and QA workflow provides multiple layers of quality assurance for React applications, from unit tests to end-to-end testing, performance monitoring, and accessibility checks.