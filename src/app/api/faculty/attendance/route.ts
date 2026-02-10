import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import StuAttendance from "@/models/StuAttendance";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const c_id = searchParams.get("c_id");
    const date = searchParams.get("date");
    await connectDB();
    const filter: { f_id: number; c_id?: string; date?: string } = { f_id: token.misId as number };
    if (c_id) filter.c_id = c_id;
    if (date) filter.date = date;
    const list = await StuAttendance.find(filter).lean();
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { c_id, roll_no, date, presence } = body;
    if (!c_id || !roll_no || !date || !presence) {
      return NextResponse.json({ error: "Missing c_id, roll_no, date, presence" }, { status: 400 });
    }
    await connectDB();
    await StuAttendance.findOneAndUpdate(
      { f_id: token.misId, c_id, roll_no, date },
      { $set: { presence } },
      { upsert: true }
    );
    return NextResponse.json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
