# MIS – Management Information System

Institute/college management system for students, faculty, and admins. Built with Next.js (App Router), Mongoose (MongoDB), and NextAuth.

**Repository:** [github.com/Rupali59/MIS](https://github.com/Rupali59/MIS) (public)

**Run locally:** Port **9006** (dev and production). See [Setup](#setup) below.

## Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **MongoDB** via **Mongoose**
- **NextAuth.js** (Credentials, session-based auth)
- **PDF generation** (pdfkit) for grade reports, payment receipts, roll slips

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `MONGODB_URI` (e.g. `mongodb://localhost:27017/mis` or MongoDB Atlas URI)
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)
   - Set `NEXTAUTH_URL` (default `http://localhost:9006` when using port 9006)

3. **Run**
   ```bash
   npm run dev
   ```
   App runs on **port 9006**. Open [http://localhost:9006](http://localhost:9006).

## Run with Docker

Ensure `.env.local` exists (copy from `.env.example`) with at least `NEXTAUTH_SECRET` and `NEXTAUTH_URL=http://localhost:9006`.

**Using Docker Compose (app + MongoDB):**
```bash
docker compose up --build
```
App: [http://localhost:9006](http://localhost:9006). MongoDB: `localhost:27017`.

**Using Docker only (use your own MongoDB):**
```bash
docker build -t mis .
docker run -p 9006:9006 --env-file .env.local -e MONGODB_URI=mongodb://host.docker.internal:27017/mis mis
```
On Linux use your host IP instead of `host.docker.internal` for `MONGODB_URI` if MongoDB runs on the host.

## Roles

- **Student** (MIS ID 2000–7999): profile, qualifications, course registration, fee payment, grade report, feedback, photo upload
- **Faculty** (8000–11999): profile, qualifications, payroll, timetable upload, attendance, course list PDF
- **Admin** (12000+): admin profile, roll number generation, timetable upload, config

## Scripts

All scripts set `NODE_ENV` appropriately (development for dev, production for build/start).

- `npm run dev` – development server (NODE_ENV=development) on port 9006
- `npm run build` – production build (NODE_ENV=production)
- `npm run start` – production server (NODE_ENV=production) on port 9006
- `npm run lint` – run ESLint
- `npm run log:lint` – run lint and save output to `logs/lint.log`
- `npm run log:build` – run build and save output to `logs/build.log`

**Before running the app**, ensure lint and build pass. Use the log scripts and fix any errors until both succeed:

```bash
npm run log:lint && npm run log:build
```

The `logs/` directory is gitignored; see `logs/README.md` for details.

## Version and releases

- **Repository:** [github.com/Rupali59/MIS](https://github.com/Rupali59/MIS)
- Releases are tagged in Git (e.g. `v0.1.0`). Check [Releases](https://github.com/Rupali59/MIS/releases) for changelogs and source tarballs.
