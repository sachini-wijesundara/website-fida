# FIDA Global Website Structure & Architecture

This document provides a detailed overview of the folder structure and the website content structure for the **FIDA Global Site**. 

---

## 1. Folder Structure

The project is built on **Next.js 14 (App Router)** with **TypeScript**, **Tailwind CSS**, and **Prisma/SQL** (via custom DB logic). Below is the comprehensive folder hierarchy:

```
FIDA-global-site/
├── .github/                   # GitHub configurations (CI/CD workflows, templates)
├── public/                    # Static assets accessible directly via URL
│   ├── images/
│   │   ├── blog/              # Blog-related image assets
│   │   └── projects/          # Case studies/project imagery
│   ├── Fidalong.png           # Extended company logo
│   ├── logo.png               # Main square logo
│   ├── vercel.svg             # Vercel SVG
│   ├── next.svg               # Next.js logo SVG
│   ├── team-*.jpg             # Team member headshots
│   └── project_*.png          # Large project preview assets
├── src/                       # Main source directory
│   ├── middleware.ts          # Authentication/route-guard middleware
│   ├── lib/                   # Shared libraries
│   │   └── db.ts              # Database connection helper (Prisma/SQL client)
│   ├── components/            # Reusable UI components
│   │   ├── navbar.tsx         # Responsive header navigation
│   │   ├── footer.tsx         # Global page footer
│   │   ├── hero.tsx           # Homepage premium hero section
│   │   ├── particle-canvas.tsx# Canvas-based interactive particle background
│   │   ├── robot-arm.tsx      # SVG/Canvas-based custom animated robot arm
│   │   ├── team-showcase.tsx  # Dynamic grid/carousel of the team
│   │   ├── stats-section.tsx  # Animated counters of metrics
│   │   ├── chat-bot.tsx       # AI chatbot helper
│   │   └── ... (see UI Components section below)
│   └── app/                   # App Router Directory (Pages, Layouts & APIs)
│       ├── layout.tsx         # Root layout (Html, Body, Font, Styles)
│       ├── page.tsx           # Homepage route (/)
│       ├── globals.css        # Main Tailwind and custom global stylesheets
│       ├── robots.ts          # SEO: Dynamic robots.txt generation
│       ├── sitemap.ts         # SEO: Dynamic sitemap.xml generator
│       ├── about/             # About Page (/about)
│       │   ├── about-client.tsx
│       │   └── page.tsx
│       ├── blog/              # Blog Section (/blog & /blog/[id])
│       │   ├── [id]/          # Dynamic single blog post page
│       │   ├── blog-client.tsx
│       │   └── page.tsx
│       ├── careers/           # Careers Page (/careers)
│       │   ├── careers-client.tsx
│       │   └── page.tsx
│       ├── contact/           # Contact Page (/contact)
│       │   ├── contact-client.tsx
│       │   └── page.tsx
│       ├── projects/          # Case Studies (/projects & /projects/[id])
│       │   ├── [id]/          # Dynamic single project details page
│       │   ├── projects-client.tsx
│       │   └── page.tsx
│       ├── services/          # Services Catalog (/services)
│       │   ├── services-client.tsx
│       │   └── page.tsx
│       ├── solutions/         # Solutions Overview (/solutions)
│       │   ├── solutions-client.tsx
│       │   └── page.tsx
│       ├── admin/             # Admin Dashboard (Protected Route Panel)
│       │   ├── page.tsx       # Main admin analytics/status dashboard
│       │   ├── layout.tsx     # Sidebar layout for administrative dashboard
│       │   ├── login/         # Admin login authentication screen
│       │   ├── blog/          # CRUD management for blog articles
│       │   ├── projects/      # CRUD management for projects & case studies
│       │   ├── solutions/     # CRUD management for solution pages
│       │   ├── services/      # CRUD management for service items
│       │   ├── expertise/     # CRUD management for areas of expertise
│       │   ├── timeline/      # CRUD management for company milestones/history
│       │   ├── testimonials/  # CRUD management for customer reviews
│       │   ├── job-applications/# Review submitted candidate applications
│       │   ├── inquiries/     # View submitted contact/inquiry forms
│       │   ├── ai-knowledge/  # Manage chatbot settings & system instructions
│       │   ├── settings/      # Edit site metadata and key info
│       │   ├── users/         # Manage administration accounts
│       │   └── teams/         # Manage team member listings
│       └── api/               # Backend API Endpoints (/api/...)
│           ├── blogs/         # Blog-related routes (GET, POST, PUT, DELETE)
│           ├── projects/      # Project-related routes
│           ├── contact/       # Contact submission router
│           ├── careers/       # Job opening & application submission handler
│           ├── admin/         # Admin auth, login, register, stats endpoints
│           └── ... (all CRUD models)
├── tsconfig.json              # TypeScript compilation rules
├── tailwind.config.ts         # Tailwind style customizations
├── postcss.config.mjs         # PostCSS configuration
├── next.config.mjs            # Next.js project settings
├── package.json               # Package dependencies & npm scripts
├── Dockerfile                 # Container packaging config
├── docker-compose.yml         # Local orchestration profile
├── ecosystem.config.js        # PM2 process file for server deployment
├── eslint.config.mjs          # JavaScript/TypeScript linting settings
├── fix_db.js                  # Database setup/migration verification utility
└── web.config                 # IIS hosting configuration
```

---

## 2. Website Content Structure

The FIDA website acts as a dual-purpose portal: a modern, interactive public-facing portfolio showcasing services and capabilities, and a comprehensive admin panel for content management.

### A. Public Pages (User-Facing Portal)

```
[Homepage /] 
  ├── [About Us /about]
  ├── [Services /services]
  ├── [Solutions /solutions]
  ├── [Projects /projects]
  ├── [Blog /blog]
  ├── [Careers /careers]
  └── [Contact /contact]
```

1. **Homepage (`/`)**
   - **Hero Section**: Sleek interactive landing header with particle/3D background, high-converting copy, and main Call-to-Actions (CTAs).
   - **Marquee Ticker**: Endless moving loop highlighting partners, awards, or key tech terms.
   - **Stats Panel**: Dynamic counter displaying achievements (e.g., *Projects completed, clients served, code lines written*).
   - **Products Section**: Previews of highlight proprietary applications and platforms.
   - **Expertise Grid**: Cards representing specialized skill areas (e.g., Cloud, AI, Security).
   - **Marvelous Items**: A visually striking showcase of core concepts.
   - **Featured Projects**: Highlights of top client success stories.
   - **Company Logos**: Ticker showing trust badges of major partners.
   - **Testimonials Section**: Quotes and reviews from partners and clients.
   - **Recent Blogs**: Grid of the latest news and industry insights.
   - **Final Call to Action (CTA)**: High-impact closure inviting visitors to start their project journey.
   - **Interactive Chatbot**: Floating AI assistant to address queries instantly.

2. **About Page (`/about`)**
   - **Company Identity**: Mission, vision, core values.
   - **Timeline/History**: Interactive chronological path mapping the company's evolution.
   - **Team Showcase**: Grid of leadership and developers with hover bios.

3. **Services (`/services`)**
   - Structured menu of core technology services (e.g., Custom Development, Consulting, QA, Support).

4. **Solutions (`/solutions`)**
   - Industry-vertical specific offerings (e.g., Fintech, Healthcare, E-Commerce).

5. **Projects (`/projects`)**
   - **Project Grid**: Filterable index page displaying case studies.
   - **Detail Page (`/projects/[id]`)**: Full breakdown of a single client engagement (challenge, solution, results, tech stack used, media showcase).

6. **Blog (`/blog`)**
   - **Blog Index**: List of published articles with pagination, category filter, and search.
   - **Detail Page (`/blog/[id]`)**: Text article body, social sharing icons, author bio, and related articles suggestion.

7. **Careers (`/careers`)**
   - **Employer Value Proposition**: Why join the team, benefits, work culture description.
   - **Job Board**: Active postings grid with job descriptions.
   - **Application Form**: Upload fields for CVs, portfolios, and candidate details.

8. **Contact (`/contact`)**
   - **Inquiry Form**: Structured fields (Name, email, message type, details) to capture leads.
   - **Office Details**: Interactive map integration, office addresses, phone numbers, and social media handles.

---

## 3. Administrative Portal (Management Dashboard)

The administrative portal allows content managers and administrators to view database statistics, process forms, and manage content on the public site without touching the codebase.

* **Authentication (`/admin/login`)**: Protected secure doorway requiring validation.
* **Dashboard Summary (`/admin/page.tsx`)**: High-level telemetry of inquiries, applications, and article counts.
* **Leads Managers**:
  * **Inquiries Panel**: Review contact form queries, mark as resolved, or view details.
  * **Job Applications**: View applicants, resume links, and status.
* **Content Publishers**:
  * **Blog Manager**: Write, edit, publish, or draft articles.
  * **Projects & Solutions Manager**: Manage dynamic case study pages.
  * **Teams & Settings**: Update team members, change contact email, modify SEO descriptions, or tune the AI Knowledge Base context.

---

## 4. Components Ecosystem

To enforce visual excellence, the application abstracts UI code into components:

| Component | Description | Visual / Interactive Effects |
| :--- | :--- | :--- |
| `navbar.tsx` / `footer.tsx` | Global layout framing | Floating layout, frosted-glass header, smooth hover linkages |
| `particle-canvas.tsx` | Dynamic backdrop | Animated particle interactions responding to mouse movements |
| `robot-arm.tsx` | Illustrative layout animation | Tech-focused automated visual animation |
| `cursor.tsx` | Client enhancement | Custom-styled pointer trailing cursor behavior |
| `chat-bot.tsx` | Dynamic AI agent component | Chat drawer with streaming text responses from API |
| `page-loader.tsx` | UX polish | Custom transition overlay during page initialization |
| `page-transition.tsx` | Visual consistency | Smooth slide/fade transitions on route movements |
| `animated-counter.tsx` | Graphic numbers | Counter ticker animating digits to destination value |
| `seasonal-decor.tsx` | Dynamic overlays | Optional holiday/seasonal themes (e.g., snowflakes, leaves) |
