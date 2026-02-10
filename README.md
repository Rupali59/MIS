# MIS – Management Information System

Institute/college management system for students, faculty, and admins. Built with Next.js (App Router), Mongoose (MongoDB), and NextAuth.

**Repository:** [github.com/Rupali59/MIS](https://github.com/Rupali59/MIS) (public)

**Run locally:** Port **9005** (dev and production). See [Setup](#setup) below.

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
   - Set `NEXTAUTH_URL` (default `http://localhost:9005` when using port 9005)

3. **Run**
   ```bash
   npm run dev
   ```
   App runs on **port 9005**. Open [http://localhost:9005](http://localhost:9005).

## Roles

- **Student** (MIS ID 2000–7999): profile, qualifications, course registration, fee payment, grade report, feedback, photo upload
- **Faculty** (8000–11999): profile, qualifications, payroll, timetable upload, attendance, course list PDF
- **Admin** (12000+): admin profile, roll number generation, timetable upload, config

## Scripts

- `npm run dev` – development server on port 9005
- `npm run build` – production build
- `npm run start` – start production server on port 9005
- `npm run lint` – run ESLint
