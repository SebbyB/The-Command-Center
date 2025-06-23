# Frontend Deployment and Build Automation

## Build Optimization and Deployment Strategies

### Vite Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      react(),
      // Gzip compression for production
      isProduction && compression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // Brotli compression for production
      isProduction && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
      // Bundle analyzer
      isProduction && visualizer({
        filename: 'dist/bundle-analysis.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: isProduction ? false : true,
      
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            // Vendor chunk for React ecosystem
            'react-vendor': ['react', 'react-dom'],
            
            // Router chunk
            'router': ['react-router-dom'],
            
            // UI library chunk
            'ui-vendor': [
              '@headlessui/react',
              '@heroicons/react',
              'clsx',
              'class-variance-authority'
            ],
            
            // Query and state management
            'state-vendor': [
              '@tanstack/react-query',
              'zustand'
            ],
            
            // Form handling
            'form-vendor': [
              'react-hook-form',
              '@hookform/resolvers',
              'zod'
            ],
            
            // Utils and smaller libraries
            'utils': [
              'date-fns',
              'lodash-es'
            ]
          },
          
          // Naming convention for chunks
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              return 'assets/[name]-[hash].js'
            }
            return 'assets/chunk-[hash].js'
          },
          
          // Asset naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`
            }
            return `assets/[name]-[hash][extname]`
          },
        },
      },
      
      // Optimize dependencies
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          '@tanstack/react-query'
        ],
      },
      
      // Set chunk size warnings
      chunkSizeWarningLimit: 1000,
    },
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    // Preview server configuration (for production builds)
    preview: {
      port: 3000,
      open: true,
    },
    
    // Environment configuration
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  }
})
```

### Environment Configuration
```typescript
// src/config/env.ts
interface Config {
  apiUrl: string
  appName: string
  version: string
  environment: 'development' | 'staging' | 'production'
  features: {
    analytics: boolean
    errorReporting: boolean
    debug: boolean
  }
  external: {
    sentryDsn?: string
    googleAnalyticsId?: string
    hotjarId?: string
  }
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  appName: import.meta.env.VITE_APP_NAME || 'My App',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: (import.meta.env.MODE as Config['environment']) || 'development',
  
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    debug: import.meta.env.DEV,
  },
  
  external: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    googleAnalyticsId: import.meta.env.VITE_GA_ID,
    hotjarId: import.meta.env.VITE_HOTJAR_ID,
  },
}

export default config
```

```bash
# .env.development
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=My App (Dev)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# .env.staging
VITE_API_URL=https://api-staging.example.com
VITE_APP_NAME=My App (Staging)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_SENTRY_DSN=https://staging-dsn@sentry.io/project

# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_SENTRY_DSN=https://production-dsn@sentry.io/project
VITE_GA_ID=GA_MEASUREMENT_ID
```

## Deployment Platforms

### Vercel Deployment
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com"
        }
      ]
    }
  ],
  "env": {
    "VITE_APP_VERSION": "@vercel-env-app-version"
  },
  "build": {
    "env": {
      "VITE_API_URL": "@vercel-env-api-url",
      "VITE_SENTRY_DSN": "@vercel-env-sentry-dsn"
    }
  }
}
```

### Netlify Deployment
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Redirect rules for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and caching
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Environment-specific configurations
[context.production.environment]
  VITE_API_URL = "https://api.example.com"
  VITE_ENABLE_ANALYTICS = "true"

[context.deploy-preview.environment]
  VITE_API_URL = "https://api-staging.example.com"
  VITE_ENABLE_ANALYTICS = "false"

[context.branch-deploy.environment]
  VITE_API_URL = "https://api-dev.example.com"
  VITE_ENABLE_ANALYTICS = "false"
```

### AWS S3 + CloudFront Deployment
```bash
#!/bin/bash
# scripts/deploy-aws.sh - Deploy to AWS S3 + CloudFront

set -euo pipefail

# Configuration
BUCKET_NAME="${AWS_S3_BUCKET}"
DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID}"
REGION="${AWS_REGION:-us-east-1}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check dependencies
check_dependencies() {
    log_step "Checking dependencies..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install AWS CLI."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi
    
    log_info "Dependencies checked"
}

# Build the application
build_app() {
    log_step "Building application..."
    
    npm run build
    
    if [[ ! -d "dist" ]]; then
        log_error "Build failed - dist directory not found"
        exit 1
    fi
    
    log_info "Application built successfully"
}

# Upload to S3
upload_to_s3() {
    log_step "Uploading to S3..."
    
    # Upload static assets with long cache headers
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --region "$REGION" \
        --delete \
        --exclude "*.html" \
        --exclude "service-worker.js" \
        --cache-control "public, max-age=31536000, immutable"
    
    # Upload HTML files with short cache headers
    aws s3 sync dist/ s3://"$BUCKET_NAME"/ \
        --region "$REGION" \
        --include "*.html" \
        --cache-control "public, max-age=0, must-revalidate"
    
    # Upload service worker with no cache
    if [[ -f "dist/service-worker.js" ]]; then
        aws s3 cp dist/service-worker.js s3://"$BUCKET_NAME"/service-worker.js \
            --region "$REGION" \
            --cache-control "public, max-age=0, no-cache, no-store, must-revalidate"
    fi
    
    log_info "Files uploaded to S3"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        log_step "Invalidating CloudFront cache..."
        
        aws cloudfront create-invalidation \
            --distribution-id "$DISTRIBUTION_ID" \
            --paths "/*" \
            --region "$REGION"
        
        log_info "CloudFront invalidation initiated"
    else
        log_info "No CloudFront distribution ID provided, skipping invalidation"
    fi
}

# Main deployment function
main() {
    log_info "Starting AWS deployment..."
    
    check_dependencies
    build_app
    upload_to_s3
    invalidate_cloudfront
    
    log_info "Deployment completed successfully! 🚀"
    
    if [[ -n "$DISTRIBUTION_ID" ]]; then
        echo "Your app is available at: https://$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text --region "$REGION")"
    fi
}

# Run main function
main "$@"
```

### Docker Deployment
```dockerfile
# Dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log   warn;
    
    # Performance optimizations
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/atom+xml
        application/geo+json
        application/javascript
        application/x-javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rdf+xml
        application/rss+xml
        application/xhtml+xml
        application/xml
        font/eot
        font/otf
        font/ttf
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com" always;
        
        # Static assets with long cache
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # HTML files with no cache
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API proxy (if needed)
        location /api {
            proxy_pass http://api-backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## CI/CD Pipeline for Frontend

### GitHub Actions Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test -- --coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [staging, production]
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for ${{ matrix.environment }}
      run: npm run build
      env:
        VITE_API_URL: ${{ matrix.environment == 'production' && secrets.PROD_API_URL || secrets.STAGING_API_URL }}
        VITE_SENTRY_DSN: ${{ matrix.environment == 'production' && secrets.PROD_SENTRY_DSN || secrets.STAGING_SENTRY_DSN }}
        VITE_GA_ID: ${{ matrix.environment == 'production' && secrets.PROD_GA_ID || '' }}
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-${{ matrix.environment }}
        path: dist/
        retention-days: 7

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [test, build]
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-staging
        path: dist/
    
    - name: Deploy to Vercel (Staging)
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./
        scope: ${{ secrets.VERCEL_ORG_ID }}
    
    - name: Run E2E tests against staging
      run: |
        npm install -g @playwright/test
        npx playwright install
        npm run test:e2e
      env:
        PLAYWRIGHT_TEST_BASE_URL: ${{ steps.deploy.outputs.preview-url }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [test, build]
    runs-on: ubuntu-latest
    environment: production
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-production
        path: dist/
    
    - name: Deploy to Vercel (Production)
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./
        vercel-args: '--prod'
        scope: ${{ secrets.VERCEL_ORG_ID }}
    
    - name: Run smoke tests
      run: npm run test:smoke
      env:
        SMOKE_TEST_URL: https://myapp.com
    
    - name: Notify team
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        message: |
          🚀 Frontend deployed to production
          Environment: Production
          Version: ${{ github.sha }}
          URL: https://myapp.com

  lighthouse:
    if: github.event_name == 'pull_request'
    needs: [test, build]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-staging
        path: dist/
    
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true

  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    - name: Upload Snyk results
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: snyk.sarif
```

## Performance Monitoring and Analytics

### Lighthouse CI Configuration
```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Local:   http://localhost:3000",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}],
        "categories:pwa": ["warn", {"minScore": 0.5}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Bundle Analysis Script
```typescript
// scripts/analyze-bundle.ts
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface BundleStats {
  totalSize: number
  gzipSize: number
  brotliSize: number
  chunks: Array<{
    name: string
    size: number
    gzipSize: number
  }>
}

function analyzeBundleSize(): BundleStats {
  // Build the project first
  console.log('Building project for analysis...')
  execSync('npm run build', { stdio: 'inherit' })

  // Get bundle stats from the build
  const statsPath = join(process.cwd(), 'dist', 'bundle-analysis.html')
  
  // Parse bundle analyzer output (simplified)
  const stats: BundleStats = {
    totalSize: 0,
    gzipSize: 0,
    brotliSize: 0,
    chunks: []
  }

  // Calculate sizes from dist directory
  const distPath = join(process.cwd(), 'dist')
  const { execSync } = require('child_process')
  
  try {
    const sizeOutput = execSync('du -sb dist/', { encoding: 'utf8' })
    stats.totalSize = parseInt(sizeOutput.split('\t')[0])
    
    const gzipOutput = execSync('find dist -name "*.gz" -exec du -sb {} + | awk "{sum += $1} END {print sum}"', { encoding: 'utf8' })
    stats.gzipSize = parseInt(gzipOutput.trim()) || 0
    
    const brotliOutput = execSync('find dist -name "*.br" -exec du -sb {} + | awk "{sum += $1} END {print sum}"', { encoding: 'utf8' })
    stats.brotliSize = parseInt(brotliOutput.trim()) || 0
  } catch (error) {
    console.warn('Could not calculate exact sizes:', error.message)
  }

  return stats
}

function generateReport(stats: BundleStats) {
  const report = {
    timestamp: new Date().toISOString(),
    bundleSize: {
      total: `${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`,
      gzip: `${(stats.gzipSize / 1024 / 1024).toFixed(2)} MB`,
      brotli: `${(stats.brotliSize / 1024 / 1024).toFixed(2)} MB`
    },
    recommendations: []
  }

  // Add recommendations based on size thresholds
  if (stats.totalSize > 5 * 1024 * 1024) { // 5MB
    report.recommendations.push('Bundle size is large (>5MB). Consider code splitting and lazy loading.')
  }

  if (stats.gzipSize > 1 * 1024 * 1024) { // 1MB gzipped
    report.recommendations.push('Gzipped bundle is large (>1MB). Review dependencies and consider tree shaking.')
  }

  writeFileSync('bundle-report.json', JSON.stringify(report, null, 2))
  console.log('Bundle analysis report generated: bundle-report.json')
  console.log(`Total size: ${report.bundleSize.total}`)
  console.log(`Gzipped: ${report.bundleSize.gzip}`)
  console.log(`Brotli: ${report.bundleSize.brotli}`)
  
  if (report.recommendations.length > 0) {
    console.log('\nRecommendations:')
    report.recommendations.forEach(rec => console.log(`- ${rec}`))
  }
}

if (require.main === module) {
  const stats = analyzeBundleSize()
  generateReport(stats)
}
```

### Progressive Web App Configuration
```typescript
// vite-plugin-pwa configuration
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        description: 'A modern React application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

This comprehensive deployment automation setup provides production-ready workflows for modern React applications with performance monitoring, security scanning, and multiple deployment targets.