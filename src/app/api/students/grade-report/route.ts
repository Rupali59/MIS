import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import MisRoll from "@/models/MisRoll";
import CurStuDetails from "@/models/CurStuDetails";
import Exam from "@/models/Exam";
import ExamScore from "@/models/ExamScore";
import Subject from "@/models/Subject";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const rollNo = searchParams.get("rollNo");
    await connectDB();
    const misId = token.misId as number;
    const rollRecord = await MisRoll.findOne(rollNo ? { roll_no: rollNo } : { misId }).lean();
    if (!rollRecord) return NextResponse.json({ error: "Roll number not found" }, { status: 404 });
    const rn = (rollRecord as { roll_no: string }).roll_no;
    const details = await CurStuDetails.findOne({ misId }).lean();
    if (!details) return NextResponse.json({ error: "Current details not set" }, { status: 400 });
    const sem = (details as { sem: number }).sem;
    const dept = (details as { dept: string }).dept;
    const degree = (details as { degree: string }).degree;
    const [exams, examScores, subjects] = await Promise.all([
      Exam.find({ roll_no: rn }).lean(),
      ExamScore.find({ roll_no: rn, sem }).lean(),
      Subject.find({ dept, semester: sem, degree }).sort({ c_id: 1 }).lean(),
    ]);
    return NextResponse.json({
      rollNo: rn,
      details: { dept, sem, degree },
      exams,
      examScores,
      subjects,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
