/**
 * Seed sample users for local/dev use.
 * Run: node scripts/seed.mjs (from project root; requires .env.local with MONGODB_URI)
 *
 * Creates one user per role with password "Password1":
 *   Student  MIS ID 2001  / Password1
 *   Faculty  MIS ID 8001  / Password1
 *   Admin    MIS ID 12001 / Password1
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load .env.local
const envPath = resolve(root, ".env.local");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mis";
const SEED_PASSWORD = "Password1";

const userSchema = new mongoose.Schema(
  {
    misId: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "faculty", "admin"] },
    secQuest: String,
    secAns: String,
    hint: String,
  },
  { timestamps: true }
);

const studentProfileSchema = new mongoose.Schema(
  {
    misId: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

const facultyProfileSchema = new mongoose.Schema(
  {
    f_id: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

const adminProfileSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models?.User ?? mongoose.model("User", userSchema);
const StudentProfile = mongoose.models?.StudentProfile ?? mongoose.model("StudentProfile", studentProfileSchema);
const FacultyProfile = mongoose.models?.FacultyProfile ?? mongoose.model("FacultyProfile", facultyProfileSchema);
const AdminProfile = mongoose.models?.AdminProfile ?? mongoose.model("AdminProfile", adminProfileSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const hashed = await bcrypt.hash(SEED_PASSWORD, 10);

  const samples = [
    { misId: 2001, role: "student", fname: "Sample", lname: "Student", dob: "2000-01-01", gender: "Male", profileModel: StudentProfile, profileKey: "misId" },
    { misId: 8001, role: "faculty", fname: "Sample", lname: "Faculty", dob: "1990-01-01", gender: "Female", profileModel: FacultyProfile, profileKey: "f_id" },
    { misId: 12001, role: "admin", fname: "Sample", lname: "Admin", dob: "1985-01-01", gender: "Male", profileModel: AdminProfile, profileKey: "id" },
  ];

  for (const s of samples) {
    const existing = await User.findOne({ misId: s.misId });
    if (existing) {
      console.log(`User ${s.misId} (${s.role}) already exists, skipped.`);
      continue;
    }
    await User.create({ misId: s.misId, password: hashed, role: s.role });
    const profilePayload = s.profileKey === "misId" ? { misId: s.misId, fname: s.fname, lname: s.lname, dob: s.dob, gender: s.gender }
      : s.profileKey === "f_id" ? { f_id: s.misId, fname: s.fname, lname: s.lname, gender: s.gender }
      : { id: s.misId, fname: s.fname, lname: s.lname };
    await s.profileModel.create(profilePayload);
    console.log(`Created ${s.role} ${s.misId}.`);
  }

  await mongoose.disconnect();
  console.log("\nSample logins (password for all: " + SEED_PASSWORD + "):");
  console.log("  Student  MIS ID 2001  / " + SEED_PASSWORD);
  console.log("  Faculty  MIS ID 8001  / " + SEED_PASSWORD);
  console.log("  Admin    MIS ID 12001 / " + SEED_PASSWORD);
}

seed().catch((err) => { console.error(err); process.exit(1); });
