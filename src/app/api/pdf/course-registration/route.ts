import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Subject from "@/models/Subject";
import PDFDocument from "pdfkit";

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
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.fontSize(18).text("Course List", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Dept: ${dept}  |  Sem: ${sem}  |  Degree: ${degree}`);
    doc.moveDown();
    doc.fontSize(10);
    (subjects as { c_name: string; c_id: string; subject_type?: string; credits?: number }[]).forEach((s) => {
      doc.text(`${s.c_name} (${s.c_id}) - ${s.subject_type ?? ""} - Credits: ${s.credits ?? "-"}`);
    });
    doc.end();
    const pdf = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="courses-${dept}-${sem}.pdf"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
