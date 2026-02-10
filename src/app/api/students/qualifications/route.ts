import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import StudentQualifyingExam from "@/models/StudentQualifyingExam";
import StudentEntranceExam from "@/models/StudentEntranceExam";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { type, ...data } = body;
    await connectDB();
    const misId = token.misId as number;
    if (type === "qualifying") {
      await StudentQualifyingExam.create({ ...data, misId });
    } else if (type === "entrance") {
      await StudentEntranceExam.create({ ...data, misId });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    return NextResponse.json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const misId = token.misId as number;
    const [qualifying, entrance] = await Promise.all([
      StudentQualifyingExam.find({ misId }).lean(),
      StudentEntranceExam.find({ misId }).lean(),
    ]);
    return NextResponse.json({ qualifying, entrance });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
