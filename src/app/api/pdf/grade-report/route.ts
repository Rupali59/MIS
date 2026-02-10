import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import MisRoll from "@/models/MisRoll";
import CurStuDetails from "@/models/CurStuDetails";
import Exam from "@/models/Exam";
import Subject from "@/models/Subject";
import StudentProfile from "@/models/StudentProfile";
import PDFDocument from "pdfkit";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId) {
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
    if (!details) return NextResponse.json({ error: "Details not set" }, { status: 400 });
    const student = await StudentProfile.findOne({ misId }).lean();
    const dept = (details as { dept: string }).dept;
    const sem = (details as { sem: number }).sem;
    const degree = (details as { degree: string }).degree;
    const [exams, subjects] = await Promise.all([
      Exam.find({ roll_no: rn }).lean(),
      Subject.find({ dept, semester: sem, degree }).sort({ c_id: 1 }).lean(),
    ]);
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    const name = student ? `${(student as { fname?: string }).fname} ${(student as { lname?: string }).lname}` : "";
    doc.fontSize(18).text("Grade Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Roll No: ${rn}  |  Name: ${name}  |  Dept: ${dept}  |  Sem: ${sem}`);
    doc.moveDown();
    doc.fontSize(10);
    const examMap = new Map((exams as { c_id: string; grade?: string }[]).map((e) => [e.c_id, e.grade]));
    (subjects as { c_name: string; c_id: string; credits?: number }[]).forEach((s) => {
      doc.text(`${s.c_name} (${s.c_id}) - Credits: ${s.credits ?? "-"} - Grade: ${examMap.get(s.c_id) ?? "-"}`);
    });
    doc.end();
    const pdf = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="grade-report-${rn}.pdf"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
