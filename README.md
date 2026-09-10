# CampusIQ AI — Premium AI College Discovery Platform

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-6.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4_Aurora-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**CampusIQ AI** is a production-grade, design-forward College Discovery Platform built to solve the core student dilemma:
> *"I don't know which college is best for my rank, budget, location, placements, and interests."*

Engineered with the **GlassMorph AI + Aurora Premium** design system (inspired by Apple VisionOS, Arc Browser, Linear, Stripe, and Notion AI), CampusIQ AI delivers an ultra-premium experience powered by deterministic admission intelligence, audited 3-year salary analytics, and multi-metric comparison.

---

## 💎 Design System: GlassMorph AI + Aurora Premium

* **Curated Aurora Palette:**
  * Backgrounds: Deep Cosmos (`#060816`), Slate Navy (`#0F172A`), Surface Void (`#131C31`)
  * Accents: Electric Blue (`#3B82F6`), Neon Cyan (`#06B6D4`), Royal Violet (`#8B5CF6`), Emerald Green (`#10B981`), Amber (`#F59E0B`)
* **Glassmorphism Layers:** `backdrop-blur-xl`, `bg-white/[0.03]` translucent surfaces, 24px corner radius (`rounded-3xl`), border stroke highlights, and micro-animations.
* **Navigation:** Floating frosted glass navbar with `Cmd+K` global quick launcher, and a VisionOS-inspired floating dock on mobile viewports.

---

## 🚀 Key Features

### 1. Advanced Multi-Faceted College Explorer (`/search`)
* Real-time search with debounce, fuzzy matching, and text highlighting.
* Filter across **1,000+ realistic colleges** by:
  * Location (22 Indian States & 99 Educational Hub Cities)
  * Institution Tier (IIT, NIT, IIIT, BITS, Premier State, Top Private, Central)
  * Ownership (Public vs. Private)
  * NIRF National Ranking Brackets (Top 50, Top 100, Top 200)
  * Tuition Fees Range Slider
  * Minimum Average CTC Slider (up to ₹25+ LPA)
  * Entrance Exams & Branch Specializations
  * Mandatory Hostel Accommodations
* Dynamic sorting by NIRF Rank, Average CTC, Lowest Fees, or Student Ratings.

### 2. Comprehensive College Profile (`/college/[slug]`)
* 3D CampusIQ Index circular score gauge with dynamic color grading.
* Sticky animated tabs:
  * **Overview:** Institutional mission, campus acreage, and highlights.
  * **Degrees & Cutoffs:** Cutoff ranks for General, OBC, SC, ST across 8,500+ courses.
  * **Placement CTC Trends:** Recharts Area & Bar charts depicting 3-year salary growth and batch placement rates.
  * **Top Recruiters:** Tier-1 and Tier-2 recruiting partners (Google, Microsoft, Amazon, Nvidia, Goldman Sachs).
  * **Scholarships:** Merit-cum-means waivers and STEM grants.
  * **Verified Student Reviews:** Granular ratings for Academics, Infrastructure, Campus Life, and Placements with helpful voting.
  * **Admissions FAQs & Similar Colleges.**

### 3. Side-by-Side 3-Way Compare Matrix (`/compare`)
* Persistent **Compare Tray** dock at the bottom of the screen.
* Side-by-side comparison of up to 3 colleges.
* Interactive **Recharts Radar Chart** comparing Academics, Placements, Infrastructure, ROI Value, Campus Life, and Brand Equity.
* Feature-by-feature diff table highlighting winning metrics in green.
* One-click PDF export summary and shareable comparison URLs.

### 4. Deterministic AI Admission Predictor (`/predictor`)
* Standout admissions calculator without black-box hallucinations.
* Inputs: Entrance Exam, Candidate Rank, Reservation Category (General, OBC-NCL, SC, ST, EWS), Home State, Gender, Budget, and Branch.
* Algorithmic reconciliation against historical closing ranks, 50% State Quota bonuses for NITs/State colleges, and Category multipliers.
* Results segmented into:
  * **Safe (75% - 99% probability)**
  * **Target (45% - 74% probability)**
  * **Dream (15% - 44% probability)**
* **AI Decision Summary Card** explaining *why* each college was recommended with transparent matching criteria.

### 5. Saved Collections (`/saved`)
* Organize shortlisted institutions into distinct buckets: *Dream Colleges*, *Shortlisted*, *Applied*, *Visited*, and *Compare Later*.
* Shortlist export utility.

### 6. Campus Community Q&A (`/community`)
* Student discussion forum for unfiltered senior insights.
* Filter questions by topic tags (`#admissions`, `#placements`, `#hostellife`, `#branchchange`).
* Post questions and verified senior answers with upvote mechanics.

### 7. Student Cockpit Dashboard & Profile (`/dashboard`, `/profile`)
* Profile readiness score gauge.
* JoSAA / CSAB admission timeline milestone tracker.
* Personalized recommendation feed based on candidate's target scores.

### 8. Admin Control Room (`/admin`)
* Real-time metrics: Total Colleges, Verified Reviews, Active Q&A threads, and Users.
* Searchable college directory table with inline creation of new college records.

---

## 🛠️ Mandatory Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS v4, Custom GlassMorph AI System |
| **Animation** | Framer Motion & Micro-animations |
| **State Management** | Zustand (Compare Tray, Filters) |
| **Data Fetching** | TanStack React Query v5 |
| **Visualizations** | Recharts (Area, Bar, Radar) |
| **Database** | PostgreSQL 16 (Neon / Supabase / Docker) |
| **ORM** | Prisma ORM 6.4.1 |
| **Authentication** | NextAuth.js (JWT Strategy) + bcryptjs |
| **Icons** | Lucide Icons |

---

## 🗄️ Normalized Database Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Models
User               // Accounts, Roles (STUDENT, ADMIN, MODERATOR)
Profile            // Academic credentials, category, target exams
College            // 1,025+ colleges with NIRF rank, fees, placements, ratings
Course             // 8,560+ branch specializations with category cutoffs
Placement          // 3-year historical CTC records (avg, median, highest)
Recruiter          // Global tech & finance recruiters (Google, Microsoft, etc.)
CollegeRecruiter   // Relational link between colleges and recruiters
Review             // Verified student reviews, sub-ratings, pros & cons
Scholarship        // Financial aid schemes, waivers, eligibility
Bookmark           // User saved collections (DREAM, SHORTLISTED, APPLIED, etc.)
Question & Answer  // Community Q&A threads with accepted answer pins
State & City       // Educational geography hierarchy
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
* Node.js v18+ (Node 20+ recommended)
* Docker (for local PostgreSQL) or a Neon PostgreSQL connection string

### 2. Clone and Install Dependencies
```bash
git clone <repository-url>
cd track1
npm install
```

### 3. Setup PostgreSQL Database
Start a local PostgreSQL container using Docker:
```bash
docker run -d --name campusiq-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=campusiq -p 5432:5432 postgres:16-alpine
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusiq?schema=public"
NEXTAUTH_SECRET="campusiq_super_secret_jwt_key_9918237198273"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Run Database Migrations & Seed 1,000+ Colleges
```bash
# Push schema tables and indexes to PostgreSQL
npx prisma db push

# Seed 1,025 colleges, 8,560 courses, placements, and reviews
npx prisma db seed
```

### 6. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Test Accounts

| Role | Email | Password |
|---|---|---|
| **Student** | `student@campusiq.ai` | `student123` |
| **Admin** | `admin@campusiq.ai` | `admin123` |

---

## 🚢 Deployment Guide (Vercel + Neon)

1. Provision a free PostgreSQL database on [Neon](https://neon.tech).
2. Set the `DATABASE_URL` in your Vercel project environment variables to your Neon connection string (`postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
3. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Vercel.
4. Set build command:
   ```bash
   npx prisma db push && npm run build
   ```
5. Deploy!

---

## 📈 Engineering Decisions & Tradeoffs

1. **Deterministic Prediction Algorithm vs. LLM:**
   * *Decision:* Used a multi-factor algorithmic scoring model that correlates candidate rank with historical opening/closing ranks, category multipliers, and 50% state quotas.
   * *Rationale:* LLMs frequently hallucinate rank cutoffs and fail basic arithmetic checks. Deterministic scoring guarantees 100% mathematical consistency, zero API latency, and transparent decision summaries.

2. **Server Components + TanStack Query Hybrid:**
   * *Decision:* Critical search, filter drawers, and comparison state utilize client components with TanStack Query caching and Zustand, while API routes leverage Prisma index lookups.
   * *Rationale:* Provides instant client-side interaction without full page reloads while maintaining optimized database queries.

---

Built with ❤️ by the CampusIQ Engineering Team.
