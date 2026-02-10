import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import MisRoll from "@/models/MisRoll";
import StudentProfile from "@/models/StudentProfile";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const assigned = await MisRoll.find().sort({ roll_no: 1 }).lean();
    const students = await StudentProfile.find({ misId: { $gte: 2000, $lte: 7999 } })
      .select("misId fname lname")
      .lean();
    return NextResponse.json({ assigned, students });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { misId, roll_no } = body;
    if (misId == null || !roll_no) {
      return NextResponse.json({ error: "misId and roll_no required" }, { status: 400 });
    }
    await connectDB();
    const existing = await MisRoll.findOne({ $or: [{ misId }, { roll_no }] });
    if (existing) {
      return NextResponse.json({ error: "MIS ID or roll number already assigned" }, { status: 400 });
    }
    await MisRoll.create({ misId: Number(misId), roll_no });
    return NextResponse.json({ message: "Roll number assigned" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
}
