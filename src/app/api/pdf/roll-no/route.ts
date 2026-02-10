import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import MisRoll from "@/models/MisRoll";
import StudentProfile from "@/models/StudentProfile";
import PDFDocument from "pdfkit";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const misIdParam = searchParams.get("misId");
    if (!misIdParam) return NextResponse.json({ error: "misId required" }, { status: 400 });
    const misId = parseInt(misIdParam, 10);
    await connectDB();
    const rollRecord = await MisRoll.findOne({ misId }).lean();
    if (!rollRecord) return NextResponse.json({ error: "Roll number not assigned" }, { status: 404 });
    const student = await StudentProfile.findOne({ misId }).lean();
    const name = student ? `${(student as { fname?: string }).fname} ${(student as { lname?: string }).lname}` : "";
    const rn = (rollRecord as { roll_no: string }).roll_no;
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.fontSize(18).text("Roll Number Slip", { align: "center" });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`MIS ID: ${misId}`);
    doc.text(`Name: ${name}`);
    doc.text(`Roll No: ${rn}`);
    doc.end();
    const pdf = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="roll-${rn}.pdf"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
