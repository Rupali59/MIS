import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import StudentProfile from "@/models/StudentProfile";
import PDFDocument from "pdfkit";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const receiptNo = searchParams.get("receiptNo");
    if (!receiptNo) return NextResponse.json({ error: "receiptNo required" }, { status: 400 });
    await connectDB();
    const payment = await Payment.findOne({
      receiptNo: parseInt(receiptNo, 10),
      ...(token.role === "student" ? { misId: token.misId } : {}),
    }).lean();
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    const p = payment as { misId: number; receiptNo: number; ddno: string; type: string; date: string; amt: string };
    const student = await StudentProfile.findOne({ misId: p.misId }).lean();
    const name = student ? `${(student as { fname?: string }).fname} ${(student as { lname?: string }).lname}` : "";
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.fontSize(18).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Receipt No: ${p.receiptNo}`);
    doc.text(`MIS ID: ${p.misId}  |  Name: ${name}`);
    doc.text(`DD/Challan No: ${p.ddno}  |  Type: ${p.type}`);
    doc.text(`Date: ${p.date}  |  Amount: ${p.amt}`);
    doc.end();
    const pdf = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="payment-${p.receiptNo}.pdf"`,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
