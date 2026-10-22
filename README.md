# CF-ERP Next.js Frontend

Next.js 14+ frontend for CF-ERP with Supabase backend.

## Quick Start

### 1. Environment Setup
```bash
cp .env.example .env.local
# Fill in your Supabase credentials
```

### 2. Development
```bash
npm run dev
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `NEXTAUTH_SECRET` | 32-char random string |
| `NEXTAUTH_URL` | Your app URL (e.g. https://app.example.com) |

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Database Setup (Supabase)
1. Create project at https://supabase.com
2. Run migrations from original CF-ERP prisma schemas
3. Enable Row Level Security with `tenant_id` policies

## API Routes Structure
```
src/app/api/
├── auth/[...nextauth]/     # NextAuth endpoints
├── customers/              # Customer CRUD
├── suppliers/              # Supplier CRUD
├── shipments/              # Shipment management
├── invoices/               # Invoice management
├── quotes/                 # Quote management
├── warehouse/              # Warehouse operations
├── containers/             # Container tracking
├── tracking/               # Shipment tracking
└── auth/                   # Custom auth endpoints
```

## Available Scripts
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests