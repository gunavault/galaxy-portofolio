# Guna Dharma — Portfolio

A galaxy-themed personal portfolio built with Next.js, Three.js, Anime.js, and SQLite.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Initialize the database
```bash
node lib/init-db.js
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

Default password: `guna2026!`

**To change the password:**
Set the environment variable before running:
```bash
ADMIN_PASSWORD=yournewpassword npm run dev
```

Or create a `.env.local` file:
```
ADMIN_PASSWORD=yournewpassword
```

---

## ☁️ Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable: `ADMIN_PASSWORD` = your password
4. Deploy!

> **Note:** SQLite works on Vercel but resets on each deployment.
> For persistent data on Vercel, consider upgrading to:
> - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
> - [PlanetScale](https://planetscale.com) (MySQL)
> - [Turso](https://turso.tech) (SQLite on the edge — best option!)

---

## 📁 Project Structure

```
portfolio/
├── app/
│   ├── page.tsx          # Landing page
│   ├── admin/page.tsx    # Admin panel (hidden from nav)
│   ├── api/
│   │   ├── auth/         # Login/logout
│   │   └── experiences/  # CRUD for work experience
│   └── globals.css
├── components/
│   ├── GalaxyCanvas.tsx  # Three.js 3D galaxy
│   └── Navbar.tsx
├── lib/
│   ├── db.ts             # SQLite connection
│   └── init-db.js        # Database seeding
└── portfolio.db          # SQLite database (auto-created)
```

---

## 🎨 Tech Stack

- **Next.js 14** — App Router
- **Three.js** — 3D galaxy with 120,000 particles
- **Anime.js** — Scroll animations & easing
- **SQLite (better-sqlite3)** — Local database
- **Tailwind CSS** — Styling
- **TypeScript** — Type safety
