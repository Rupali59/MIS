import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import StudentProfile from "@/models/StudentProfile";
import FacultyProfile from "@/models/FacultyProfile";
import AdminProfile from "@/models/AdminProfile";
import type { Role } from "@/models/User";

const studentSchema = z.object({
  role: z.literal("student"),
  password: z.string().min(1),
  secQuest: z.string().optional(),
  secAns: z.string().optional(),
  hint: z.string().optional(),
  fname: z.string().min(1),
  mname: z.string().optional(),
  lname: z.string().min(1),
  dob: z.string(),
  gender: z.string(),
  faname: z.string().optional(),
  focc: z.string().optional(),
  moname: z.string().optional(),
  mocc: z.string().optional(),
  phno: z.string().optional(),
  p_street: z.string().optional(),
  p_city: z.string().optional(),
  p_state: z.string().optional(),
  p_country: z.string().optional(),
  p_pincode: z.string().optional(),
  t_street: z.string().optional(),
  t_city: z.string().optional(),
  t_state: z.string().optional(),
  t_country: z.string().optional(),
  t_pincode: z.string().optional(),
  mno: z.string().optional(),
  lno: z.string().optional(),
  bloodGrp: z.string().optional(),
  email: z.string().optional(),
  religion: z.string().optional(),
  category: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
});

const facultySchema = z.object({
  role: z.literal("faculty"),
  password: z.string().min(1),
  secQuest: z.string().optional(),
  secAns: z.string().optional(),
  hint: z.string().optional(),
  fname: z.string().min(1),
  mname: z.string().optional(),
  lname: z.string().min(1),
  gender: z.string(),
  dob: z.string().optional(),
  parent_name: z.string().optional(),
  parent_ph_no: z.string().optional(),
  p_street: z.string().optional(),
  p_city: z.string().optional(),
  p_state: z.string().optional(),
  p_country: z.string().optional(),
  p_pincode: z.string().optional(),
  t_street: z.string().optional(),
  t_city: z.string().optional(),
  t_state: z.string().optional(),
  t_country: z.string().optional(),
  t_pincode: z.string().optional(),
  blood_grp: z.string().optional(),
  email_id: z.string().optional(),
  religion: z.string().optional(),
  category: z.string().optional(),
  marital_status: z.string().optional(),
  nationality: z.string().optional(),
});

const adminSchema = z.object({
  role: z.literal("admin"),
  password: z.string().min(1),
  secQuest: z.string().optional(),
  secAns: z.string().optional(),
  hint: z.string().optional(),
  fname: z.string().min(1),
  mname: z.string().optional(),
  lname: z.string().min(1),
  dob: z.string().optional(),
  gender: z.string().optional(),
  p_street: z.string().optional(),
  p_city: z.string().optional(),
  p_state: z.string().optional(),
  p_country: z.string().optional(),
  p_pincode: z.string().optional(),
  t_street: z.string().optional(),
  t_city: z.string().optional(),
  t_state: z.string().optional(),
  t_country: z.string().optional(),
  t_pincode: z.string().optional(),
  blood_group: z.string().optional(),
  email_id: z.string().optional(),
  marital_status: z.string().optional(),
  nationality: z.string().optional(),
  mno: z.string().optional(),
  lno: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role = body.role as Role | undefined;
    if (!role || !["student", "faculty", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    await connectDB();

    let misId: number;
    const [minId, maxId] =
      role === "student" ? [2000, 7999] : role === "faculty" ? [8000, 11999] : [12000, 99999];

    const existing = await (role === "student"
      ? StudentProfile.findOne({ misId: { $gte: minId, $lte: maxId } }).sort({ misId: -1 })
      : role === "faculty"
        ? FacultyProfile.findOne({ f_id: { $gte: minId, $lte: maxId } }).sort({ f_id: -1 })
        : AdminProfile.findOne({ id: { $gte: minId, $lte: maxId } }).sort({ id: -1 })).lean();

    const lastId = existing
      ? role === "student"
        ? (existing as { misId: number }).misId
        : role === "faculty"
          ? (existing as { f_id: number }).f_id
          : (existing as { id: number }).id
      : minId - 1;
    misId = lastId + 1;
    if (misId > maxId) {
      return NextResponse.json({ error: "ID range exhausted" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    if (role === "student") {
      const parsed = studentSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const d = parsed.data;
      await StudentProfile.create({
        misId,
        fname: d.fname,
        mname: d.mname,
        lname: d.lname,
        dob: d.dob,
        gender: d.gender,
        faname: d.faname,
        focc: d.focc,
        moname: d.moname,
        mocc: d.mocc,
        phno: d.phno,
        p_street: d.p_street,
        p_city: d.p_city,
        p_state: d.p_state,
        p_country: d.p_country,
        p_pincode: d.p_pincode,
        t_street: d.t_street,
        t_city: d.t_city,
        t_state: d.t_state,
        t_country: d.t_country,
        t_pincode: d.t_pincode,
        mno: d.mno,
        lno: d.lno,
        bloodGrp: d.bloodGrp,
        email: d.email,
        religion: d.religion,
        category: d.category,
        maritalStatus: d.maritalStatus,
        nationality: d.nationality,
      });
    } else if (role === "faculty") {
      const parsed = facultySchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const d = parsed.data;
      await FacultyProfile.create({
        f_id: misId,
        fname: d.fname,
        mname: d.mname,
        lname: d.lname,
        gender: d.gender,
        dob: d.dob,
        parent_name: d.parent_name,
        parent_ph_no: d.parent_ph_no,
        p_street: d.p_street,
        p_city: d.p_city,
        p_state: d.p_state,
        p_country: d.p_country,
        p_pincode: d.p_pincode,
        t_street: d.t_street,
        t_city: d.t_city,
        t_state: d.t_state,
        t_country: d.t_country,
        t_pincode: d.t_pincode,
        blood_grp: d.blood_grp,
        email_id: d.email_id,
        religion: d.religion,
        category: d.category,
        marital_status: d.marital_status,
        nationality: d.nationality,
      });
    } else {
      const parsed = adminSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const d = parsed.data;
      await AdminProfile.create({
        id: misId,
        fname: d.fname,
        mname: d.mname,
        lname: d.lname,
        dob: d.dob,
        gender: d.gender,
        p_street: d.p_street,
        p_city: d.p_city,
        p_state: d.p_state,
        p_country: d.p_country,
        p_pincode: d.p_pincode,
        t_street: d.t_street,
        t_city: d.t_city,
        t_state: d.t_state,
        t_country: d.t_country,
        t_pincode: d.t_pincode,
        blood_group: d.blood_group,
        email_id: d.email_id,
        marital_status: d.marital_status,
        nationality: d.nationality,
        mno: d.mno,
        lno: d.lno,
      });
    }

    await User.create({
      misId,
      password: hashedPassword,
      role,
      secQuest: body.secQuest,
      secAns: body.secAns,
      hint: body.hint,
    });

    return NextResponse.json({ misId, message: "Registered successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
