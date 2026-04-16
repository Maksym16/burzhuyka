<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="React.js" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="Vite" />
    <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=38B2AC" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933" alt="Node.js" />
    <img src="https://img.shields.io/badge/-Express-black?style=for-the-badge&logoColor=white&logo=express&color=000000" alt="Express" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-Cloudinary-black?style=for-the-badge&logoColor=white&logo=cloudinary&color=3448C5" alt="Cloudinary" />
  </div>

  <h3 align="center">Буржуйка — Продаж та монтаж печей і камінів</h3>

  <div align="center">
    Full-stack business website for a fireplace &amp; sauna stove sales and installation company based in Kyiv, Ukraine.
  </div>
</div>

---

## 📋 Table of Contents

1. ⚙️ [Tech Stack](#tech-stack)
2. 🔋 [Features](#features)
3. 🤸 [Quick Start](#quick-start)
4. 🔐 [Environment Variables](#environment-variables)
5. 🚀 [Deployment](#deployment)

---

## <a name="tech-stack">⚙️ Tech Stack</a>

**Frontend**
- [React 18](https://react.dev/) — UI library
- [Vite](https://vitejs.dev/) — build tool & dev server
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [React Router v6](https://reactrouter.com/) — client-side routing
- [TanStack React Query](https://tanstack.com/query) — server state & caching
- [GSAP + ScrollTrigger](https://gsap.com/) — scroll-driven animations
- [React Hook Form](https://react-hook-form.com/) — admin forms

**Backend**
- [Node.js + Express](https://expressjs.com/) — REST API
- [Neon Serverless PostgreSQL](https://neon.tech/) — database
- [Cloudinary](https://cloudinary.com/) — image storage & delivery
- [JWT](https://jwt.io/) — admin authentication
- [Multer](https://github.com/expressjs/multer) — file upload handling

---

## <a name="features">🔋 Features</a>

**Public Site**
- 🏠 **Home page** — animated hero carousel, services section, gallery carousel preview, product catalog categories, contact strip
- 📦 **Product catalog** — filterable by category, with individual product detail pages at `/catalog/:slug`
- 🖼️ **Gallery** — full-page photo grid with lightbox (arrow navigation + keyboard support)
- 📞 **Contacts page** — phone numbers, Telegram, Viber, location
- 📱 Fully responsive — mobile hamburger menu, adaptive layouts throughout

**Admin Dashboard** (`/admin`, JWT protected)
- 🛍️ **Product management** — create, edit, delete products with multi-image upload via Cloudinary, specs table, slug & description fields
- 🖼️ **Gallery management** — upload multiple images at once, delete removes from both Cloudinary and the database
- 🔍 Product list with live search, column sorting, and pagination

**Technical**
- SEO — meta tags, Open Graph, JSON-LD LocalBusiness structured data
- SPA with Express server-side fallback for direct URL access in production
- Cloudinary `public_id` tracking ensures clean deletes with no orphaned files

---

## <a name="quick-start">🤸 Quick Start</a>

**Prerequisites:** Node.js 18+, a [Neon](https://neon.tech) database, a [Cloudinary](https://cloudinary.com) account.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/burzhuyka.git
cd burzhuyka
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend && npm install && cd ..
```

### 3. Configure environment variables

Create `backend/.env` — see [Environment Variables](#environment-variables).

### 4. Set up the database

Run the contents of `backend/db/schema.sql` in your Neon SQL Editor to create all tables.

### 5. Create the first admin account

```bash
cd backend
node scripts/create-admin.js your@email.com yourpassword
```

### 6. Start development servers

```bash
# Terminal 1 — Frontend (http://localhost:5173)
npm run dev

# Terminal 2 — Backend (http://localhost:3001)
cd backend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the site.  
Admin panel: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## <a name="environment-variables">🔐 Environment Variables</a>

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

---

## <a name="deployment">🚀 Deployment</a>

Configured for **Hostinger Managed Node.js**.

### Build

```bash
npm run build
```

Outputs the frontend to `backend/dist/` so Express can serve it as static files.

### Hostinger settings

| Setting | Value |
|---|---|
| Entry file | `backend/server.js` |
| Build command | `npm run build` |
| Output directory | `backend/dist` |
| Node version | 18+ |
| Port | `3000` |

The `postinstall` script automatically installs backend dependencies on each deploy:

```json
"postinstall": "cd backend && npm install"
```
