# FIDA Global Website: Codebase & Function Manifest

This guide provides a detailed map of all directories and files inside the project, along with the specific functions, React components, or API endpoints they define.

---

## 1. Project Configuration Files (Root Directory)

These files configure the build system, compilers, styles, containerization, and runtime environment of the Next.js application.

| File Path | Purpose | Key Configurations / Details |
| :--- | :--- | :--- |
| `package.json` | Project dependency manifest | Defines scripts (`dev`, `build`, `start`, `lint`) and dependencies (Next.js, React, Lucide-React, MSSQL, Tailwind CSS, etc.). |
| `tsconfig.json` | TypeScript compiler rules | Configures path aliases (e.g., `@/*` maps to `src/*`), strict type checking, and module resolution. |
| `tailwind.config.ts` | Tailwind CSS customizations | Configures theme extensions (colors, fonts, animations, keyframes, transitions). |
| `next.config.mjs` | Next.js server configuration | Standard Next.js config (standalone output, images remote patterns, headers, etc.). |
| `Dockerfile` | Multi-stage Docker build recipe | Packages the application into a lightweight, production-ready Alpine Node.js environment. |
| `docker-compose.yml` | Local orchestration profile | Defines containers and ports for running the app locally via Docker. |
| `ecosystem.config.js` | PM2 production process configuration | Defines application runtime parameters for PM2 process manager deployment. |
| `eslint.config.mjs` | ESLint rules configuration | Defines style standards and static analysis rules. |
| `web.config` | IIS Hosting Configuration | Custom configuration file for deployment under Windows IIS web servers. |
| `fix_db.js` | Database setup / validation script | Validates that SQL server connection, schema, and columns are ready. |

---

## 2. Public Client-Facing Routes (`src/app/`)

These files define the main public routing layout and customer views. Each directory matches a URL path (e.g., `/about` or `/blog`).

### 📂 About Section (`/about`)
* **[src/app/about/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/about/page.tsx)**: 
  * `AboutPage()` (Server Component): Renders the main entry shell for `/about`. It contains SEO `metadata` definitions.
* **[src/app/about/about-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/about/about-client.tsx)**:
  * `AboutClient()` (Client Component): Displays interactive segments, including the company story, interactive milestones timeline, and the grid of leadership/team showcase.

### 📂 Blog Section (`/blog`)
* **[src/app/blog/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/blog/page.tsx)**:
  * `BlogPage()` (Server Component): Renders the initial layout for `/blog`. Configures SEO metadata.
* **[src/app/blog/blog-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/blog/blog-client.tsx)**:
  * `BlogClient()` (Client Component): Renders search inputs, category filter tags, and pagination grids for reading articles.
* **[src/app/blog/[id]/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/blog/%5Bid%5D/page.tsx)**:
  * `BlogDetailPage()` (Server Component): Dynamically fetches article data by ID/slug and renders the reading interface and social sharing bar.

### 📂 Careers Section (`/careers`)
* **[src/app/careers/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/careers/page.tsx)**:
  * `CareersPage()` (Server Component): Main route view. Configures search and SEO metadata.
* **[src/app/careers/careers-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/careers/careers-client.tsx)**:
  * `CareersClient()` (Client Component): Renders open jobs, perks, and an application modal (name, email, resume files uploading).

### 📂 Contact Section (`/contact`)
* **[src/app/contact/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/contact/page.tsx)**:
  * `ContactPage()` (Server Component): SEO metadata wrapper.
* **[src/app/contact/contact-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/contact/contact-client.tsx)**:
  * `ContactClient()` (Client Component): Render lead-generation form inputs, handles validation, submissions, and maps out office locations.

### 📂 Projects / Case Studies Section (`/projects`)
* **[src/app/projects/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/projects/page.tsx)**:
  * `ProjectsPage()` (Server Component): SEO metadata container.
* **[src/app/projects/projects-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/projects/projects-client.tsx)**:
  * `ProjectsClient()` (Client Component): Allows visitors to filter completed projects by category (e.g., Cloud, Infrastructure, Security).
* **[src/app/projects/[id]/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/projects/%5Bid%5D/page.tsx)**:
  * `ProjectDetailPage()` (Server Component): Renders individual project specs, architecture details, key outcomes, and tech stacks.

### 📂 Services Catalog (`/services`)
* **[src/app/services/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/services/page.tsx)**:
  * `ServicesPage()` (Server Component): SEO wrapper.
* **[src/app/services/services-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/services/services-client.tsx)**:
  * `ServicesClient()` (Client Component): Renders interactive pricing cards, descriptions, and feature grids for consultancies and software plans.

### 📂 Solutions Page (`/solutions`)
* **[src/app/solutions/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/solutions/page.tsx)**:
  * `SolutionsPage()` (Server Component): SEO configuration wrapper.
* **[src/app/solutions/solutions-client.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/solutions/solutions-client.tsx)**:
  * `SolutionsClient()` (Client Component): Renders industry specific solutions (Enterprise, Government, SME, Startups).

---

## 3. Administrative Portal Views (`src/app/admin/`)

The back-office control panel uses a sub-routing system protected by authentication cookies.

* **[src/app/admin/layout.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/admin/layout.tsx)**:
  * `AdminLayout()`: Displays the layout shell containing a collapsible sidebar navigation menu, top bar notification tray, and main workspace area.
* **[src/app/admin/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/admin/page.tsx)**:
  * `AdminDashboard()`: The analytics landing page displaying statistics charts (total inquiries, job apps, active blog posts, system status).
* **[src/app/admin/login/page.tsx](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/app/admin/login/page.tsx)**:
  * `AdminLogin()`: Sign-in viewport requiring username/password to generate session cookies.

### Content Editing Sub-routes:
Each folder under `/admin` handles a specific database entity with listing grids, creation sheets, and editing forms:

| Route Path | View Component | Functionality |
| :--- | :--- | :--- |
| `admin/ai-knowledge` | `AiKnowledgePanel` | Edits system prompts, text chunks, and sources for the client chatbot. |
| `admin/analytics` | `AnalyticsAdmin` | Detailed logs, visitor telemetry, and click trackers. |
| `admin/blog` | `BlogManagement` | Displays published posts table; links to create/edit editors. |
| `admin/blog/create` | `CreateBlogPost` | Editor workspace (title, content, tags, banner image uploading). |
| `admin/blog/edit/[id]` | `EditBlogPost` | Updates existing blog records in the database. |
| `admin/careers` | `CareersAdminPanel` | Creates/deletes job openings. |
| `admin/customers` | `CustomerManagement` | Manages list of customer accounts. |
| `admin/expertise` | `ExpertiseManagement` | Creates/deletes capability blocks featured on the homepage. |
| `admin/features` | `SolutionManagement` | Manages highlight solution cards. |
| `admin/inquiries` | `InquiriesAdmin` | Reading pane to review contact messages and mark inquiries as resolved. |
| `admin/job-applications`| `JobApplicationsAdmin`| Displays applicant list; features links to download resumes/CVs. |
| `admin/projects` | `ProjectManagement` | List view for adding, editing, and deleting case studies. |
| `admin/services` | `ServiceManagement` | Manages corporate services content listings. |
| `admin/settings` | `SettingsPage` | Edits site metadata, contact phone, emails, and address headers. |
| `admin/teams` | `TeamManagement` | Edits profile photos, titles, and ordering of team listings. |
| `admin/testimonials` | `TestimonialManagement`| Manages client quotes, names, and ratings grids. |
| `admin/timeline` | `TimelineAdminPanel` | Adds history steps to the interactive timeline. |
| `admin/users` | `UsersAdmin` | Manage credentials for team administrators who can access this panel. |

---

## 4. Backend API Endpoints (`src/app/api/`)

HTTP route handlers processing requests from public forms and the administrative interfaces.

### 🔐 Administrative & System API (`src/app/api/admin/`)
* **`ai-knowledge/route.ts`**:
  * `GET`: Fetches current chatbot files/rules.
  * `POST`: Adds a custom knowledge chunk.
  * `DELETE`: Deletes custom knowledge.
* **`login/route.ts`**:
  * `POST`: Performs validation against user records and issues JWT auth cookies.
* **`logout/route.ts`**:
  * `POST`: Cleans session cookies to sign out admins.
* **`register/route.ts`**:
  * `POST`: Encrypts password and creates new administration user record.
* **`stats/route.ts`**:
  * `GET`: Counts inquiry, application, and content records for dashboard indicators.
* **`youtube-links/route.ts`**:
  * `GET` / `POST` / `DELETE`: Manages embedded video link arrays.
* **`users/route.ts`**:
  * `GET`: Lists registered admin accounts.

### 📝 Content Management API
* **`blogs/route.ts`**:
  * `GET`: Lists all articles (public).
  * `POST`: Creates a new article (requires admin auth).
  * `DELETE`: Deletes an article by ID.
* **`blogs/[id]/route.ts`**:
  * `GET`: Fetches a single article (public).
  * `PUT`: Updates an existing article (requires admin auth).
* **`projects/route.ts`**:
  * `GET`: Fetches case studies.
  * `POST` / `DELETE`: Adds or removes project case study records.
* **`projects/[id]/route.ts`**:
  * `GET` / `PUT`: Fetches or edits a specific project record.
* **`contact/route.ts`**:
  * `POST`: Saves contact submissions to the database and dispatches notifications via SMTP.
* **`careers/route.ts`**:
  * `GET` / `POST` / `PUT` / `DELETE`: Processes job listings and application forms.
* **`services/route.ts`** / **`products/route.ts`** / **`testimonials/route.ts`**:
  * `GET` / `POST` / `DELETE`: Standard CRUD handlers for public homepage components.

---

## 5. UI Component Ecosystem (`src/components/`)

Visual interface components assembled into the pages.

| Component File | Exported Item | Purpose & Details |
| :--- | :--- | :--- |
| `navbar.tsx` | `Navbar` | Navigation header supporting responsive mobile toggle drawers. |
| `footer.tsx` | `Footer` | Page-ending layout displaying site links, office address, and social vectors. |
| `hero.tsx` | `Hero` | Splash header using custom typography, buttons, and responsive shapes. |
| `particle-canvas.tsx` | `ParticleCanvas` | Renders a canvas background that updates node vectors based on mouse paths. |
| `space-background.tsx` | `SpaceBackground` | Stars, nebulae, and galaxy styling layouts for page backdrops. |
| `robot-arm.tsx` | `RobotArmHero` | Visual SVG automation representing tech/engineering. |
| `team-showcase.tsx` | `TeamShowcase` | Grid showcasing core staff list with LinkedIn/Twitter linkages. |
| `stats-section.tsx` | `StatsSection` | Container for numeric targets triggering custom digit increments on scroll. |
| `animated-counter.tsx` | `AnimatedCounter` | Utility that counts integers upward incrementally. |
| `marquee.tsx` | `MarqueeTicker` | Infinite horizontal scrolling panel showing client/tech labels. |
| `chat-bot.tsx` | `ChatBot` | Overlay button opening a messaging drawer that queries the AI webhook. |
| `page-hero.tsx` | `PageHero` | Universal header template containing badges and custom subtitles. |
| `page-loader.tsx` | `PageLoader` | Loading screen block covering route changes. |
| `page-transition.tsx` | `PageTransition` | Framer-motion/CSS wrapper that applies smooth slide transitions on routing. |
| `seasonal-decor.tsx` | `SeasonalDecor` | Appends winter/holiday decorative indicators optionally. |
| `cta-section.tsx` | `CtaSection` | Section layout encouraging readers to get in touch. |
| `company-logos.tsx` | `CompanyLogos` | Scrolling client brand assets grid. |
| `products-section.tsx` | `ProductsSection` | Feature blocks outlining proprietary tools. |
| `blog-section.tsx` | `BlogSection` | Preview grid showing the latest three blog entries. |
| `projects-section.tsx` | `ProjectsSection` | Carousel showcasing featured project case studies. |
| `expertise-section.tsx` | `ExpertiseSection` | Details grid showcasing technical proficiencies. |
| `testimonials-section.tsx``| `TestimonialsSection`| Renders interactive quote/slider bubbles from customers. |
| `marvelous-items.tsx` | `MarvelousItems` | Multi-card grid highlighting core strengths. |
| `cursor.tsx` | `CustomCursor` | Intercepts default mouse cursors and prints responsive dot trails. |

---

## 6. Utilities & Middleware

These files support core infrastructure (database sessions, authentication verification).

* **[src/lib/db.ts](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/lib/db.ts)**:
  * `getDbConnection()`: Initializes connection pooling configurations to the MSSQL Server database using the environment variables (`DB_USER`, `DB_SERVER`, etc.). Cache-stores the connection pool promise to prevent leakage.
* **[src/middleware.ts](file:///Users/sachiniwijesundara/fida-website%20/FIDA-global-site/src/middleware.ts)**:
  * `middleware(request)`: Inspects incoming client calls. Redirects unauthenticated visitors attempting to open `/admin/*` pages back to `/admin/login`, enforcing dashboard security.
