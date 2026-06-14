# RichCards India — Premium Digital Wedding Invitation Platform

RichCards India is a luxury digital wedding invitation design studio specializing in premium wedding monograms, save-the-dates, invitation videos, itinerary cards, PDFs, and bespoke wedding stationery.

This monorepo contains the complete, production-ready web application consisting of a high-performance **Next.js 15 frontend** (client portal + public storefront + admin dashboard) and a robust **NestJS backend** powered by **Prisma ORM** and **PostgreSQL**.

---

## 🏗️ Architecture & Project Structure

The project is structured as a monorepo using npm workspaces:

```text
richcards-monorepo/
│
├── backend/                   # NestJS API Backend
│   ├── prisma/                # Prisma ORM schema & seed scripts
│   ├── src/                   # Source files (Auth, Media, Templates, Leads, Blogs, etc.)
│   └── tsconfig.json          # TypeScript Configuration
│
├── frontend/                  # Next.js 15 Client Portal & Storefront
│   ├── public/                # Static assets
│   ├── src/app/               # Next.js App Router (Storefront & Admin Dashboard)
│   ├── src/components/        # Reusable Tailwind + Framer Motion components
│   └── tailwind.config.ts     # Tailwind & Brand Theme configurations
│
├── docker-compose.yml         # Container configuration for PostgreSQL & Redis
├── package.json               # Monorepo workspaces configuration
└── .env.example               # Environment variables template
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS & Vanilla CSS custom variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Fetching**: Native Fetch client with pre-configured headers

### Backend
- **Framework**: NestJS (Node.js)
- **ORM**: Prisma ORM v6
- **Database**: PostgreSQL (Prisma Client)
- **Cache**: Redis (BullMQ / general caching)
- **Image Processing**: Sharp (automatic WebP conversion, watermarking)
- **Auth**: Passport-JWT, Bcrypt role-based guards

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker & Docker Compose](https://www.docker.com/) (for running database & cache containers locally)

### 1. Setup Environment Variables
Clone `.env.example` in the root directory to `.env` and fill in the values:
```bash
cp .env.example .env
```

Default local database connection values are configured to match the local Docker container.

### 2. Run Database & Cache (Docker)
Start the PostgreSQL and Redis containers:
```bash
docker-compose up -d
```

### 3. Install Dependencies
Run the install script from the root directory to install dependencies across the monorepo:
```bash
npm run install:all
```

### 4. Run Prisma Migrations & Seed Database
Generate the Prisma client, run the migrations, and seed the database with initial luxury templates, categories, and tags:
```bash
# Navigate to backend
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### 5. Launch Development Servers
Run both backend (port 4000) and frontend (port 3000) concurrently using:
```bash
# In the root directory
npm run dev
```

---

## 📦 Production Builds

To verify clean production compilations of both services, you can run:

```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend

# Build both services concurrently
npm run build
```

---

## 🌐 Deployment Guide

### Backend (NestJS + Prisma + Postgres)
You can deploy the backend to platforms like **Render**, **Railway**, **Heroku**, or **AWS ECS/Elastic Beanstalk**:
1. Connect your repository to the hosting platform.
2. Set the build command to `npm run build:backend` (or run it in the sub-folder).
3. Set the start command to `node backend/dist/src/main.js`.
4. Run `npx prisma migrate deploy` in your build/release phase.
5. Provide a production PostgreSQL connection string as `DATABASE_URL`.
6. Setup environment variables (e.g., `JWT_SECRET`, `REDIS_URL`, `PORT`).

### Frontend (Next.js 15)
The frontend is fully optimized for **Vercel**:
1. Create a new project on Vercel and import your repository.
2. Set the **Root Directory** settings to `frontend`.
3. Vercel will automatically detect the Next.js setup.
4. Set the environment variable `NEXT_PUBLIC_API_URL` to point to your deployed NestJS API (e.g., `https://api.richcards.in/api`).
5. Trigger the deployment.

---

## 📞 Business Info & Contact
- **Brand Name**: RichCards India
- **Instagram**: [richcardsindia](https://www.instagram.com/richcardsindia)
- **WhatsApp Support**: [+91 9016705775](https://wa.me/919016705775)
