# React + Vite Project Templates and Generators

## Project Initialization Scripts

### Automated Project Setup Script
```bash
#!/bin/bash
# scripts/create-react-app.sh - Modern React project generator

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS] PROJECT_NAME

Create a new React + Vite project with modern tooling and best practices.

Options:
  -h, --help              Show this help
  -t, --template TYPE     Project template (default: full)
                          - minimal: Basic React + TypeScript + Vite
                          - standard: + Tailwind + Router + Forms
                          - full: + State management + Testing + Storybook
  -p, --package-manager   Package manager (npm, yarn, pnpm)
  -g, --git              Initialize git repository
  --auth                 Include authentication setup
  --api                  Include API integration setup
  --testing              Include comprehensive testing setup
  --storybook            Include Storybook setup
  --deploy               Include deployment configuration

Examples:
  $0 my-app
  $0 my-app -t standard --auth --api
  $0 my-app -t full -p pnpm --git
EOF
}

# Create project directory structure
create_directory_structure() {
    local project_name="$1"
    local template="$2"
    
    log_step "Creating directory structure for $project_name"
    
    mkdir -p "$project_name"
    cd "$project_name"
    
    # Basic structure
    mkdir -p src/{components/{ui,forms,layout,feature},pages,hooks,services,stores,utils,types,styles,assets/{images,icons,fonts},lib,tests/{setup,utils,mocks}}
    
    # Template-specific directories
    case "$template" in
        "full")
            mkdir -p src/components/ui/{Button,Input,Modal,Card,Table,Form}
            mkdir -p src/pages/{Home,Dashboard,Settings,Profile,Auth}
            mkdir -p .storybook
            mkdir -p docs
            ;;
        "standard")
            mkdir -p src/components/ui/{Button,Input,Modal}
            mkdir -p src/pages/{Home,Dashboard}
            ;;
        "minimal")
            mkdir -p src/components/ui
            mkdir -p src/pages
            ;;
    esac
    
    log_info "Directory structure created"
}

# Initialize Vite project
init_vite_project() {
    local project_name="$1"
    local package_manager="$2"
    
    log_step "Initializing Vite React TypeScript project"
    
    # Create package.json
    cat > package.json << EOF
{
  "name": "$project_name",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \\"src/**/*.{ts,tsx,css,md}\\"",
    "format:check": "prettier --check \\"src/**/*.{ts,tsx,css,md}\\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF
    
    log_info "Basic Vite project initialized"
}

# Install dependencies based on template
install_dependencies() {
    local template="$1"
    local package_manager="$2"
    local include_auth="$3"
    local include_api="$4"
    local include_testing="$5"
    local include_storybook="$6"
    
    log_step "Installing dependencies for template: $template"
    
    local deps=()
    local dev_deps=()
    
    # Core dependencies
    deps+=("@types/node")
    dev_deps+=("prettier" "prettier-plugin-tailwindcss")
    
    # Template-specific dependencies
    case "$template" in
        "minimal")
            ;;
        "standard")
            deps+=("react-router-dom" "react-hook-form" "@hookform/resolvers" "zod")
            deps+=("tailwindcss" "autoprefixer" "postcss")
            dev_deps+=("@tailwindcss/forms" "@tailwindcss/typography")
            ;;
        "full")
            deps+=("react-router-dom" "react-hook-form" "@hookform/resolvers" "zod")
            deps+=("@tanstack/react-query" "@tanstack/react-query-devtools")
            deps+=("zustand" "tailwindcss" "autoprefixer" "postcss")
            deps+=("@headlessui/react" "@heroicons/react" "clsx" "class-variance-authority")
            dev_deps+=("@tailwindcss/forms" "@tailwindcss/typography" "@tailwindcss/aspect-ratio")
            ;;
    esac
    
    # Authentication dependencies
    if [[ "$include_auth" == "true" ]]; then
        deps+=("@auth0/auth0-react" "js-cookie")
        dev_deps+=("@types/js-cookie")
    fi
    
    # API dependencies
    if [[ "$include_api" == "true" ]]; then
        deps+=("axios")
    fi
    
    # Testing dependencies
    if [[ "$include_testing" == "true" ]]; then
        dev_deps+=("vitest" "@vitest/ui" "@testing-library/react" "@testing-library/jest-dom")
        dev_deps+=("@testing-library/user-event" "jsdom" "@playwright/test" "msw")
    fi
    
    # Storybook dependencies
    if [[ "$include_storybook" == "true" ]]; then
        dev_deps+=("@storybook/react-vite" "@storybook/addon-essentials")
        dev_deps+=("@storybook/addon-interactions" "@storybook/testing-library")
    fi
    
    # Git hooks
    dev_deps+=("husky" "lint-staged")
    
    # Install dependencies
    if [[ ${#deps[@]} -gt 0 ]]; then
        case "$package_manager" in
            "npm")
                npm install "${deps[@]}"
                ;;
            "yarn")
                yarn add "${deps[@]}"
                ;;
            "pnpm")
                pnpm add "${deps[@]}"
                ;;
        esac
    fi
    
    if [[ ${#dev_deps[@]} -gt 0 ]]; then
        case "$package_manager" in
            "npm")
                npm install --save-dev "${dev_deps[@]}"
                ;;
            "yarn")
                yarn add --dev "${dev_deps[@]}"
                ;;
            "pnpm")
                pnpm add -D "${dev_deps[@]}"
                ;;
        esac
    fi
    
    log_info "Dependencies installed"
}

# Create configuration files
create_config_files() {
    local template="$1"
    local include_testing="$2"
    local include_storybook="$3"
    
    log_step "Creating configuration files"
    
    # Vite config
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
EOF
    
    # TypeScript config
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
    
    cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF
    
    # ESLint config
    cat > eslint.config.js << 'EOF'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist', 'node_modules', 'storybook-static'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsparser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
EOF
    
    # Prettier config
    cat > .prettierrc << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF
    
    # Tailwind config (if included)
    if [[ "$template" != "minimal" ]]; then
        cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
EOF
        
        cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    fi
    
    # Testing config
    if [[ "$include_testing" == "true" ]]; then
        cat > vitest.config.ts << 'EOF'
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF
        
        cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
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
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
EOF
    fi
    
    # Storybook config
    if [[ "$include_storybook" == "true" ]]; then
        mkdir -p .storybook
        cat > .storybook/main.ts << 'EOF'
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
EOF
        
        cat > .storybook/preview.ts << 'EOF'
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
EOF
    fi
    
    log_info "Configuration files created"
}

# Create source files
create_source_files() {
    local template="$1"
    local include_auth="$2"
    local include_api="$3"
    
    log_step "Creating source files"
    
    # HTML template
    cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
    
    # Main entry point
    cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF
    
    # Global styles
    if [[ "$template" != "minimal" ]]; then
        cat > src/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF
    else
        cat > src/styles/globals.css << 'EOF'
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF
    fi
    
    # Utility functions
    if [[ "$template" != "minimal" ]]; then
        cat > src/utils/cn.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF
    fi
    
    # Create App component based on template
    case "$template" in
        "minimal")
            create_minimal_app
            ;;
        "standard")
            create_standard_app "$include_auth" "$include_api"
            ;;
        "full")
            create_full_app "$include_auth" "$include_api"
            ;;
    esac
    
    log_info "Source files created"
}

# Create minimal App component
create_minimal_app() {
    cat > src/App.tsx << 'EOF'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Vite App</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </header>
    </div>
  )
}

export default App
EOF
}

# Create standard App component
create_standard_app() {
    local include_auth="$1"
    local include_api="$2"
    
    # Create router setup
    cat > src/lib/router.tsx << 'EOF'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
])
EOF
    
    # Create basic components
    create_basic_components "standard"
    
    # Create App with router
    cat > src/App.tsx << 'EOF'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/lib/router'

function App() {
  return <RouterProvider router={router} />
}

export default App
EOF
}

# Create full App component
create_full_app() {
    local include_auth="$1"
    local include_api="$2"
    
    # Create query client setup
    cat > src/lib/queryClient.ts << 'EOF'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        if (failureCount < 2) return true
        return false
      },
    },
  },
})
EOF
    
    # Create router setup
    cat > src/lib/router.tsx << 'EOF'
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Settings = lazy(() => import('@/pages/Settings'))
const Profile = lazy(() => import('@/pages/Profile'))

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyWrapper>
            <Settings />
          </LazyWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <LazyWrapper>
            <Profile />
          </LazyWrapper>
        ),
      },
    ],
  },
])
EOF
    
    # Create basic components
    create_basic_components "full"
    
    # Create App with providers
    cat > src/App.tsx << 'EOF'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { router } from '@/lib/router'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
EOF
}

# Create basic components based on template
create_basic_components() {
    local template="$1"
    
    # Button component
    cat > src/components/ui/Button/Button.tsx << 'EOF'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    }
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
EOF
    
    cat > src/components/ui/Button/index.ts << 'EOF'
export { Button } from './Button'
export type { ButtonProps } from './Button'
EOF
    
    # Layout component
    cat > src/components/layout/Layout.tsx << 'EOF'
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">My App</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2024 My App. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
EOF
    
    # Pages
    cat > src/pages/Home/index.tsx << 'EOF'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to My App</h1>
      <p className="text-lg text-muted-foreground">
        This is a modern React application built with Vite and TypeScript.
      </p>
      <div className="space-x-4">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  )
}
EOF
    
    cat > src/pages/Dashboard/index.tsx << 'EOF'
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard.
      </p>
    </div>
  )
}
EOF
    
    # Additional components for full template
    if [[ "$template" == "full" ]]; then
        # Loading spinner
        cat > src/components/ui/LoadingSpinner/index.tsx << 'EOF'
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
EOF
        
        # Error boundary
        cat > src/components/ErrorBoundary.tsx << 'EOF'
import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            We're sorry for the inconvenience. Please try again.
          </p>
          <div className="space-x-4">
            <Button onClick={this.handleReset}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
EOF
        
        # Additional pages
        cat > src/pages/Settings/index.tsx << 'EOF'
export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Manage your application settings.
      </p>
    </div>
  )
}
EOF
        
        cat > src/pages/Profile/index.tsx << 'EOF'
export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground">
        View and edit your profile information.
      </p>
    </div>
  )
}
EOF
    fi
}

# Setup git repository
setup_git() {
    local project_name="$1"
    
    log_step "Setting up git repository"
    
    # Initialize git
    git init
    
    # Create .gitignore
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# Build outputs
dist/
build/
storybook-static/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/
*.lcov

# Test results
test-results/
playwright-report/

# Temporary files
*.tmp
*.temp
EOF
    
    # Setup git hooks
    npx husky install
    
    # Create lint-staged config in package.json
    local package_json_content
    package_json_content=$(cat package.json)
    echo "$package_json_content" | jq '. + {
      "lint-staged": {
        "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
        "*.{css,md,json}": ["prettier --write"]
      }
    }' > package.json
    
    # Add pre-commit hook
    npx husky add .husky/pre-commit "npx lint-staged"
    
    # Initial commit
    git add .
    git commit -m "Initial commit: $project_name setup"
    
    log_info "Git repository initialized"
}

# Main function
main() {
    # Default values
    local project_name=""
    local template="full"
    local package_manager="npm"
    local init_git="false"
    local include_auth="false"
    local include_api="false"
    local include_testing="false"
    local include_storybook="false"
    local include_deploy="false"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -t|--template)
                template="$2"
                shift 2
                ;;
            -p|--package-manager)
                package_manager="$2"
                shift 2
                ;;
            -g|--git)
                init_git="true"
                shift
                ;;
            --auth)
                include_auth="true"
                shift
                ;;
            --api)
                include_api="true"
                shift
                ;;
            --testing)
                include_testing="true"
                shift
                ;;
            --storybook)
                include_storybook="true"
                shift
                ;;
            --deploy)
                include_deploy="true"
                shift
                ;;
            -*)
                echo "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                if [[ -z "$project_name" ]]; then
                    project_name="$1"
                else
                    echo "Unexpected argument: $1"
                    usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Validate project name
    if [[ -z "$project_name" ]]; then
        echo "Project name is required"
        usage
        exit 1
    fi
    
    # Validate template
    if [[ ! "$template" =~ ^(minimal|standard|full)$ ]]; then
        echo "Invalid template: $template"
        echo "Valid templates: minimal, standard, full"
        exit 1
    fi
    
    # Validate package manager
    if [[ ! "$package_manager" =~ ^(npm|yarn|pnpm)$ ]]; then
        echo "Invalid package manager: $package_manager"
        echo "Valid package managers: npm, yarn, pnpm"
        exit 1
    fi
    
    # Auto-enable features for full template
    if [[ "$template" == "full" ]]; then
        include_testing="true"
        include_storybook="true"
    fi
    
    log_info "Creating React + Vite project: $project_name"
    log_info "Template: $template"
    log_info "Package manager: $package_manager"
    
    # Execute setup steps
    create_directory_structure "$project_name" "$template"
    init_vite_project "$project_name" "$package_manager"
    install_dependencies "$template" "$package_manager" "$include_auth" "$include_api" "$include_testing" "$include_storybook"
    create_config_files "$template" "$include_testing" "$include_storybook"
    create_source_files "$template" "$include_auth" "$include_api"
    
    if [[ "$init_git" == "true" ]]; then
        setup_git "$project_name"
    fi
    
    log_info "Project created successfully!"
    log_info ""
    log_info "Next steps:"
    log_info "  cd $project_name"
    log_info "  $package_manager run dev"
    log_info ""
    log_info "Available scripts:"
    log_info "  $package_manager run dev          - Start development server"
    log_info "  $package_manager run build        - Build for production"
    log_info "  $package_manager run preview      - Preview production build"
    log_info "  $package_manager run lint         - Lint code"
    log_info "  $package_manager run test         - Run tests"
    
    if [[ "$include_storybook" == "true" ]]; then
        log_info "  $package_manager run storybook    - Start Storybook"
    fi
}

# Check dependencies
for cmd in node npm; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Required command not found: $cmd"
        exit 1
    fi
done

# Run main function
main "$@"
```

### Component Generator Script
```bash
#!/bin/bash
# scripts/generate-component.sh - React component generator

set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# Usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS] COMPONENT_NAME

Generate a new React component with TypeScript, tests, and stories.

Options:
  -h, --help              Show this help
  -t, --type TYPE         Component type (ui, form, layout, feature, page)
  -d, --directory DIR     Custom directory path
  --with-tests           Include test file
  --with-stories         Include Storybook stories
  --with-hooks           Generate as custom hook
  --functional           Create functional component (default)
  --class                Create class component

Examples:
  $0 Button -t ui --with-tests --with-stories
  $0 LoginForm -t form --with-tests
  $0 useAuth --with-hooks
EOF
}

# Generate functional component
generate_functional_component() {
    local component_name="$1"
    local component_path="$2"
    local component_type="$3"
    
    case "$component_type" in
        "ui")
            generate_ui_component "$component_name" "$component_path"
            ;;
        "form")
            generate_form_component "$component_name" "$component_path"
            ;;
        "layout")
            generate_layout_component "$component_name" "$component_path"
            ;;
        "feature")
            generate_feature_component "$component_name" "$component_path"
            ;;
        "page")
            generate_page_component "$component_name" "$component_path"
            ;;
        *)
            generate_basic_component "$component_name" "$component_path"
            ;;
    esac
}

# Generate UI component
generate_ui_component() {
    local component_name="$1"
    local component_path="$2"
    
    cat > "$component_path/$component_name.tsx" << EOF
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const ${component_name,,}Variants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ${component_name}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${component_name,,}Variants> {
  // Add component-specific props here
}

const $component_name = forwardRef<HTMLDivElement, ${component_name}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${component_name,,}Variants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

$component_name.displayName = '$component_name'

export { $component_name, ${component_name,,}Variants }
EOF
}

# Generate form component
generate_form_component() {
    local component_name="$1"
    local component_path="$2"
    
    cat > "$component_path/$component_name.tsx" << EOF
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const ${component_name,,}Schema = z.object({
  // Define your form schema here
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type ${component_name}Data = z.infer<typeof ${component_name,,}Schema>

export interface ${component_name}Props {
  onSubmit: (data: ${component_name}Data) => void
  isLoading?: boolean
}

export function $component_name({ onSubmit, isLoading }: ${component_name}Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<${component_name}Data>({
    resolver: zodResolver(${component_name,,}Schema),
  })

  const handleFormSubmit = (data: ${component_name}Data) => {
    onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          {...register('name')}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" loading={isLoading} className="w-full">
        Submit
      </Button>
    </form>
  )
}
EOF
}

# Generate basic component
generate_basic_component() {
    local component_name="$1"
    local component_path="$2"
    
    cat > "$component_path/$component_name.tsx" << EOF
import { cn } from '@/utils/cn'

export interface ${component_name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add component-specific props here
}

export function $component_name({ className, ...props }: ${component_name}Props) {
  return (
    <div className={cn('', className)} {...props}>
      {/* Component content */}
    </div>
  )
}
EOF
}

# Generate custom hook
generate_custom_hook() {
    local hook_name="$1"
    local hook_path="$2"
    
    cat > "$hook_path/$hook_name.ts" << EOF
import { useState, useEffect } from 'react'

export function $hook_name() {
  const [state, setState] = useState(null)

  useEffect(() => {
    // Hook logic here
  }, [])

  return {
    state,
    // Return hook interface
  }
}
EOF
}

# Generate test file
generate_test_file() {
    local component_name="$1"
    local component_path="$2"
    local is_hook="$3"
    
    if [[ "$is_hook" == "true" ]]; then
        cat > "$component_path/$component_name.test.ts" << EOF
import { renderHook, act } from '@testing-library/react'
import { $component_name } from './$component_name'

describe('$component_name', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() => $component_name())
    
    expect(result.current).toBeDefined()
  })
})
EOF
    else
        cat > "$component_path/$component_name.test.tsx" << EOF
import { render, screen } from '@testing-library/react'
import { $component_name } from './$component_name'

describe('$component_name', () => {
  it('renders correctly', () => {
    render(<$component_name />)
    
    // Add your test assertions here
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('handles props correctly', () => {
    const testProps = {
      className: 'test-class',
      'data-testid': 'test-component'
    }
    
    render(<$component_name {...testProps} />)
    
    const component = screen.getByTestId('test-component')
    expect(component).toHaveClass('test-class')
  })
})
EOF
    fi
}

# Generate Storybook stories
generate_stories_file() {
    local component_name="$1"
    local component_path="$2"
    
    cat > "$component_path/$component_name.stories.tsx" << EOF
import type { Meta, StoryObj } from '@storybook/react'
import { $component_name } from './$component_name'

const meta: Meta<typeof $component_name> = {
  title: 'Components/$component_name',
  component: $component_name,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for component props
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const Variant: Story = {
  args: {
    // Variant props
  },
}
EOF
}

# Generate index file
generate_index_file() {
    local component_name="$1"
    local component_path="$2"
    local is_hook="$3"
    
    if [[ "$is_hook" == "true" ]]; then
        cat > "$component_path/index.ts" << EOF
export { $component_name } from './$component_name'
EOF
    else
        cat > "$component_path/index.ts" << EOF
export { $component_name } from './$component_name'
export type { ${component_name}Props } from './$component_name'
EOF
    fi
}

# Main function
main() {
    local component_name=""
    local component_type=""
    local custom_directory=""
    local with_tests="false"
    local with_stories="false"
    local with_hooks="false"
    local is_class="false"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -t|--type)
                component_type="$2"
                shift 2
                ;;
            -d|--directory)
                custom_directory="$2"
                shift 2
                ;;
            --with-tests)
                with_tests="true"
                shift
                ;;
            --with-stories)
                with_stories="true"
                shift
                ;;
            --with-hooks)
                with_hooks="true"
                shift
                ;;
            --functional)
                is_class="false"
                shift
                ;;
            --class)
                is_class="true"
                shift
                ;;
            -*)
                echo "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                if [[ -z "$component_name" ]]; then
                    component_name="$1"
                else
                    echo "Unexpected argument: $1"
                    usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Validate component name
    if [[ -z "$component_name" ]]; then
        echo "Component name is required"
        usage
        exit 1
    fi
    
    # Determine component path
    local component_path
    if [[ -n "$custom_directory" ]]; then
        component_path="src/$custom_directory/$component_name"
    elif [[ "$with_hooks" == "true" ]]; then
        component_path="src/hooks"
    else
        case "$component_type" in
            "ui")
                component_path="src/components/ui/$component_name"
                ;;
            "form")
                component_path="src/components/forms/$component_name"
                ;;
            "layout")
                component_path="src/components/layout/$component_name"
                ;;
            "feature")
                component_path="src/components/feature/$component_name"
                ;;
            "page")
                component_path="src/pages/$component_name"
                ;;
            *)
                component_path="src/components/$component_name"
                ;;
        esac
    fi
    
    log_info "Generating component: $component_name"
    log_info "Type: ${component_type:-default}"
    log_info "Path: $component_path"
    
    # Create directory
    if [[ "$with_hooks" != "true" ]]; then
        mkdir -p "$component_path"
    fi
    
    # Generate files
    if [[ "$with_hooks" == "true" ]]; then
        log_step "Generating custom hook"
        generate_custom_hook "$component_name" "$component_path"
    else
        log_step "Generating component"
        generate_functional_component "$component_name" "$component_path" "$component_type"
        generate_index_file "$component_name" "$component_path" "false"
    fi
    
    # Generate test file
    if [[ "$with_tests" == "true" ]]; then
        log_step "Generating test file"
        generate_test_file "$component_name" "$component_path" "$with_hooks"
    fi
    
    # Generate stories file
    if [[ "$with_stories" == "true" && "$with_hooks" != "true" ]]; then
        log_step "Generating Storybook stories"
        generate_stories_file "$component_name" "$component_path"
    fi
    
    if [[ "$with_hooks" == "true" ]]; then
        generate_index_file "$component_name" "$component_path" "true"
    fi
    
    log_info "Component generated successfully!"
    log_info "Files created:"
    
    if [[ "$with_hooks" == "true" ]]; then
        echo "  $component_path/$component_name.ts"
        if [[ "$with_tests" == "true" ]]; then
            echo "  $component_path/$component_name.test.ts"
        fi
    else
        echo "  $component_path/$component_name.tsx"
        echo "  $component_path/index.ts"
        if [[ "$with_tests" == "true" ]]; then
            echo "  $component_path/$component_name.test.tsx"
        fi
        if [[ "$with_stories" == "true" ]]; then
            echo "  $component_path/$component_name.stories.tsx"
        fi
    fi
}

# Run main function
main "$@"
```

These project templates and generators provide a comprehensive starting point for modern React development with best practices, tooling, and scalable architecture patterns built-in.