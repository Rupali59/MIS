import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import MisRoll from "@/models/MisRoll";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { roll_no, ddno, type, date, amt, late } = body;
    if (!roll_no || !ddno || !type || !date || !amt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await connectDB();
    const misId = token.misId as number;
    const rollRecord = await MisRoll.findOne({ roll_no }).lean();
    if (!rollRecord || (rollRecord as { misId: number }).misId !== misId) {
      return NextResponse.json({ error: "Invalid roll number for your account" }, { status: 400 });
    }
    const last = await Payment.findOne().sort({ receiptNo: -1 }).lean();
    const receiptNo = (last ? (last as { receiptNo: number }).receiptNo : 999) + 1;
    await Payment.create({
      misId,
      ddno,
      type,
      date,
      amt,
      late: late ?? "",
      receiptNo,
    });
    return NextResponse.json({ message: "Payment recorded", receiptNo });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const payments = await Payment.find({ misId: token.misId }).sort({ receiptNo: -1 }).lean();
    return NextResponse.json(payments);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
