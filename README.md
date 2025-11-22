# Info-QR - QR Code Management Platform

A full-stack Next.js application for creating, managing, and scanning QR codes for products.

## Features

- **QR Code Generation**: Automatically generate unique QR codes for each product
- **QR Code Scanning**: Scan QR codes with camera or upload images
- **Product Management**: Full CRUD operations for products
- **Admin Authentication**: Secure email/password authentication via Supabase
- **Product Storage**: Store QR codes in Supabase Storage
- **Public Product Display**: Browse and view products publicly
- **Modern UI**: Built with Next.js, TailwindCSS, and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **QR Code**: qrcode library for generation
- **Scanning**: html5-qrcode for camera scanning

## Project Structure

```
app/
├── admin/
│   ├── login/          # Admin login page
│   └── products/       # Admin dashboard
│       ├── new/        # Add product page
│       ├── [id]/       # Edit product page
│       └── [id]/view/  # Admin product detail view
├── api/
│   └── products/       # REST API endpoints
├── p/
│   └── [id]/          # Public product detail page
├── products/          # Public products listing
├── scan/              # QR scanner page
└── page.tsx           # Landing page

components/
├── admin-navbar.tsx
├── login-form.tsx
├── product-card.tsx
├── product-form.tsx
├── product-table.tsx
└── qr-scanner.tsx

lib/
├── auth/
│   └── actions.ts
├── supabase/
│   ├── admin.ts
│   ├── browser.ts
│   ├── server.ts
│   └── storage.ts
├── types/
│   └── types.ts
└── utils/
    ├── qr-generator.ts
    └── utils.ts
```

## Setup

### Prerequisites

- Node.js 18+
- Supabase project
- npm or yarn

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPABASE_QR_BUCKET=product-qr
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
# Run the SQL script from scripts/01-init-schema.sql in your Supabase SQL editor
```

3. Create the required storage buckets in Supabase:
   - `product-qr` for QR codes

4. Create an admin user in Supabase Auth with the following credentials:
   - Email: admin@example.com
   - Password: pasword

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Admin Dashboard

1. Navigate to `/admin/login`
2. Sign in with the admin credentials (admin@infoqr.com / Admin@123456789)
3. Access the product dashboard at `/admin/products`
4. Create, edit, or delete products
5. QR codes are automatically generated and stored
6. Each product has its own QR code that can be downloaded

### Public Features

- **Landing Page**: `/` - Browse features and get started
- **Products**: `/products` - View all products
- **Product Details**: `/p/[id]` - View product details and download QR code
- **Scanner**: `/scan` - Scan QR codes with camera or upload images

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## Database Schema

### Products Table

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  labelId text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  qr_code_url text,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```