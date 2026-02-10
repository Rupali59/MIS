import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const dept = searchParams.get("dept");
    const sem = searchParams.get("sem");
    const degree = searchParams.get("degree");
    if (!dept || !sem || !degree) {
      return NextResponse.json({ error: "dept, sem, degree required" }, { status: 400 });
    }
    await connectDB();
    const subjects = await Subject.find({
      dept,
      semester: parseInt(sem, 10),
      degree,
    })
      .sort({ c_id: 1 })
      .lean();
    return NextResponse.json(subjects);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
