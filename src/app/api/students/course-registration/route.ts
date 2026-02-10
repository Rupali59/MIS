import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import CurStuDetails from "@/models/CurStuDetails";
import Subject from "@/models/Subject";
import CourseRegistration from "@/models/CourseRegistration";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const misId = token.misId as number;
    const details = await CurStuDetails.findOne({ misId }).lean();
    if (!details) {
      return NextResponse.json({ error: "Current details not set. Complete that first." }, { status: 400 });
    }
    const existing = await CourseRegistration.findOne({ misId, sem: details.sem }).lean();
    const subjects = await Subject.find({
      dept: details.dept,
      semester: details.sem,
      degree: details.degree,
    })
      .sort({ c_id: 1 })
      .lean();
    return NextResponse.json({
      details: { dept: details.dept, sem: details.sem, degree: details.degree },
      registered: !!existing,
      subjects,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const misId = token.misId as number;
    const details = await CurStuDetails.findOne({ misId }).lean();
    if (!details) {
      return NextResponse.json({ error: "Current details not set" }, { status: 400 });
    }
    const existing = await CourseRegistration.findOne({ misId, sem: details.sem });
    if (existing) {
      return NextResponse.json({ error: "Already registered for this semester" }, { status: 400 });
    }
    const courseIds = body.courseIds as string[] | undefined;
    await CourseRegistration.create({
      misId,
      sem: details.sem,
      courseIds: courseIds ?? [],
    });
    return NextResponse.json({ message: "Registered" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
