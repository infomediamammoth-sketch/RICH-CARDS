# Implementation Plan - RichCards India Web Application

We are building a premium, luxury digital wedding invitation marketplace for **RichCards**. The application consists of a public business website, a lead capture system, a WhatsApp inquiry workflow, and a fully featured admin panel.

To fulfill the tech stack requirements while ensuring easy local setup and development, we will build a **Monorepo** structure:
- **`backend/`**: NestJS backend, Node.js, Prisma, PostgreSQL (with Redis for caching, JWT for authentication, and AWS S3 for storage).
- **`frontend/`**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, and Framer Motion.
- **Root Workspace**: To manage and run both services concurrently with ease.

---

## User Review Required

> [!IMPORTANT]
> **Database & Infrastructure Setup**
> - For local development, we will provide a `docker-compose.yml` file that spins up local PostgreSQL and Redis services. This ensures a zero-configuration database setup if Docker is installed.
> - For media uploads, we will build an upload provider in NestJS that defaults to **Local File Storage** (saving to a public folder) for ease of local testing, but seamlessly switches to **AWS S3** when AWS credentials are provided in the `.env` file.

> [!TIP]
> **Watermark Processing**
> - Applying watermarks dynamically on the fly can be CPU-intensive. We will implement static watermarking during media upload (using `sharp` in NestJS) to overlay watermarks on images, which optimizes page speed scores and ensures the user always downloads watermarked invitations unless authenticated/purchased.

---

## Open Questions

1. **Authentication Mode**: For the admin panel login, we will use JWT with HTTP-only cookies for maximum security. Is this aligned with your security needs, or do you have a preferred auth library (like NextAuth/Auth.js)?
2. **Search Integration**: The stack mentions Algolia/Elasticsearch. For local testing and initial rollout, we can implement high-performance PostgreSQL full-text search with indexes. Do you want to configure Algolia credentials immediately, or should we use the PostgreSQL search backend as a default fallback?
3. **WhatsApp API Integration**: Do you want a direct link-based inquiry (`https://wa.me/...` with pre-filled text) or do you plan to use an official WhatsApp Business API provider? We propose the direct link-based inquiry as it is free, instant, and matches the specified "Floating WhatsApp Button" and "Inquiry Button" requirements.

---

## Proposed Changes

We will create a monorepo workspace.

```
richcards/
├── package.json                   # Root package.json with workspace settings
├── docker-compose.yml             # Postgres + Redis dev containers
├── backend/                       # NestJS Application
│   ├── src/
│   │   ├── auth/                  # JWT auth module & guards
│   │   ├── prisma/                # Prisma service wrapper
│   │   ├── templates/             # Templates CRUD, filters & watermarks
│   │   ├── categories/            # Category management & hierarchy
│   │   ├── tags/                  # Tag management
│   │   ├── media/                 # Media library, drag-drop upload, sharp compression
│   │   ├── blogs/                 # Blog post CRUD
│   │   ├── leads/                 # Lead CRM and capturing
│   │   ├── testimonials/          # Testimonials management
│   │   ├── banners/               # Hero banner management
│   │   ├── settings/              # Brand color & website settings
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma          # PostgreSQL DB schema
│   └── package.json
└── frontend/                      # Next.js 15 Application
    ├── src/
    │   ├── app/                   # App Router pages (Home, Gallery, Details, Blog, Admin)
    │   ├── components/            # UI components (Serif headings, glassmorphic grids, sliders)
    │   ├── lib/                   # API clients & utilities
    │   └── styles/
    └── package.json
```

---

### Database Schema (Prisma)

We will define a comprehensive PostgreSQL schema in `backend/prisma/schema.prisma` with the following relations:

- **`User`** & **`Role`**: Managing admins, staff, and editors with custom permissions.
- **`Template`**: Rich fields for `title`, `description`, `slug`, `price`, `videoUrl`, `imageUrls`, `watermarked`, format details (MP4/PDF/JPG), and SEO metadata relation.
- **`Category`**: Parent-child relationship (`parentCategoryId`) for sub-categories, order, icon, and SEO metadata.
- **`Tag`**: Direct relation to templates.
- **`Media`**: File records, categories, size, format, compression, and folder names.
- **`Blog`**: Content, featured image, reading time, author, categories, tags, and SEO metadata.
- **`Lead`**: CRM table with columns `name`, `phone`, `email`, `templateId` (optional), `status` (New, Contacted, Interested, Closed, Rejected), `notes`, and source metadata.
- **`Testimonial`**: Name, message, video testimonial link, image, isApproved, and rating.
- **`HeroBanner`**: Banner details, image/video asset link, CTA text, CTA link, display order, schedules, and active status.
- **`SeoMetadata`**: Polymorphic or direct relations to Template, Category, Tag, and Blog, storing meta title, description, keywords, canonical URLs, OG images, and JSON-LD schema markup.
- **`Setting`**: Key-value store for global settings (brand color, typography, WhatsApp number, site name, social links).

---

### Backend Components (`backend/`)

#### 1. Setup & Config
Initialize NestJS, configure TypeScript, and integrate Prisma ORM.

#### 2. Auth Module
JWT token-based auth with HTTP-only cookies, Rate Limiting (`@nestjs/throttler`), and Guards to enforce Roles (Super Admin, Staff Admin, Editor).

#### 3. Media Service with Sharp Compression
A media library controller supporting drag-and-drop file ingestion, file compression (converting PNG/JPG to WebP/AVIF, compressing MP4s), and automatic watermark application.

#### 4. Advanced Filter Query Engine
A service in `templates` to perform compound queries filtering by Category, Format, Style, Language, Theme, and Color Palette with PostgreSQL pagination.

---

### Frontend Components (`frontend/`)

#### 1. Design System & Theme
Create a luxury theme in `index.css` and Tailwind configuration using champagne gold accents (`#D4AF37`), deep black surfaces (`#0B0B0B`), and clean ivory white backgrounds (`#FDFBF7`), styled with Serif headings (e.g., *Playfair Display* or *Cinzel*) and Sans-Serif body text (*Inter* or *Montserrat*).

#### 2. Public Pages
- **Home Page**: Hero banner slider (managed from admin panel), categories section, why choose section, testimonials slider, Instagram mock-feed, FAQ accordion, and floating WhatsApp CTA.
- **Template Gallery**: Multi-sidebar filter system, search query, responsive templates grid with lazy loading, and instant details previews.
- **Template Details**: High-resolution image carousels, embedded MP4 video preview, features checklist, share widgets, and a WhatsApp Inquiry Button.
- **Blog Section**: SEO-friendly article viewer with reading time calculators and schema markup.

#### 3. Admin Dashboard
- **Analytics View**: Total leads, popular templates, template views, traffic chart, and conversion rate.
- **Lead CRM**: Clean spreadsheet interface to track inquiry status, add notes, and assign owners.
- **Template Builder**: Dynamic forms to upload templates, manage multiple screenshots, toggle watermarks, write custom SEO headers, and assign tags/categories.
- **Media Library**: Directory-like folder view supporting drag-and-drop multi-file uploads.

---

## Verification Plan

### Automated Verification
We will set up Jest unit tests and integration tests in the backend, and check builds in the frontend:
- Run `npm run test` inside the backend.
- Run `npm run build` inside both frontend and backend to verify TypeScript compilations.

### Manual Verification
1. **WhatsApp Inquiry Flow**:
   - Go to a template details page, click "Inquire on WhatsApp".
   - Verify it redirects to `https://wa.me/919016705775?text=...` with the template name and details correctly formatted.
   - Verify a new record is added to the CRM database with status `NEW`.
2. **Media & Watermark Flow**:
   - Upload a new wedding image in the Admin Media Library.
   - Verify the image is optimized and watermarked (if enabled).
3. **Role Restrictions**:
   - Log in as an "Editor". Verify that Template and Blog editing is allowed, but Settings and User Management are blocked.
