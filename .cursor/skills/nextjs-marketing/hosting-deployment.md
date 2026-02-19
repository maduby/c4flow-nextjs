# Hostinger Deployment

Deploy Next.js to Hostinger with either static export or Node.js on VPS.

## Option A: Static Export (Shared Hosting / Static Site)

Best for: marketing sites where all content is known at build time. No server-side features.

### next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Produces /about/index.html instead of /about.html
}

export default nextConfig
```

### Build and Deploy

```bash
npm run build    # Generates out/ directory
```

Upload the `out/` directory contents to Hostinger via:
- **File Manager**: Upload zip, extract in `public_html/`
- **FTP/SFTP**: Upload directly to `public_html/`
- **Git**: Set up auto-deploy from repository

### Redirects and Rewrites

Static export does not support Next.js middleware or server-side redirects. Use Hostinger's `.htaccess`:

```apache
# .htaccess in public_html/
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\.html -f
RewriteRule ^(.*)$ $1.html [L]

# Custom 404
ErrorDocument 404 /404/index.html
```

### CMS Content Updates

Since static export requires a rebuild for new content:

1. Set up a webhook in Sanity/Payload that triggers on content publish
2. Webhook calls a CI/CD pipeline (GitHub Actions) to rebuild and deploy
3. GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger

on:
  repository_dispatch:
    types: [cms-content-update]
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_CMS_URL: ${{ secrets.CMS_URL }}
      - name: Deploy via SFTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          password: ${{ secrets.HOSTINGER_PASS }}
          local-dir: ./out/
          server-dir: /public_html/
```

### Limitations of Static Export

| Feature | Available? | Alternative |
|---------|-----------|-------------|
| SSR | No | Pre-render everything at build |
| ISR | No | Rebuild via webhook |
| Middleware | No | `.htaccess` rules |
| Image Optimization | No | Cloudinary/Imgix loader or pre-optimize |
| API Routes | No | External API or serverless functions |
| Draft Mode | No | Use CMS preview URL directly |

## Option B: Node.js on Hostinger VPS

Best for: sites needing ISR, middleware, image optimization, or preview mode.

### next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Add CMS image CDN patterns
    ],
  },
}

export default nextConfig
```

### Docker Deployment

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### PM2 Deployment (Without Docker)

```bash
# On Hostinger VPS
npm install -g pm2
```

```js
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'c4flow',
    script: '.next/standalone/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}
```

```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-restart on server reboot
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/c4flow
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

Enable HTTPS with Certbot:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Health Check

```tsx
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString() })
}
```

### On-Demand Revalidation Webhook

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()

  if (body.tag) {
    revalidateTag(body.tag)
  } else if (body.path) {
    revalidatePath(body.path)
  } else {
    revalidatePath('/', 'layout') // Revalidate everything
  }

  return Response.json({ revalidated: true })
}
```

## Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CMS_API_TOKEN=your-cms-token
REVALIDATION_SECRET=your-webhook-secret

# .env.production (Hostinger)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CMS_API_TOKEN=your-production-cms-token
REVALIDATION_SECRET=your-production-webhook-secret
```

Never commit `.env.local` or `.env.production`. Add them to `.gitignore`.

## Choosing Between Options

| Criteria | Static Export | Node.js VPS |
|----------|-------------|-------------|
| Hostinger plan | Business / Premium | VPS |
| Cost | Lower | Higher |
| Performance | Excellent (CDN-cacheable) | Very good |
| Content updates | Rebuild required | Instant (ISR) |
| Preview mode | Not available | Supported |
| Image optimization | External service | Built-in |
| Complexity | Simpler | More setup |

**Recommendation**: Start with **static export** for a marketing site. Move to VPS if you need ISR, preview mode, or server-side features.
