import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import TimetableImage from "@/models/TimetableImage";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const f_id = formData.get("f_id"); // optional: admin can upload for a faculty
    if (!file || !file.size) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/jpeg";
    await connectDB();
    const targetId = f_id ? parseInt(String(f_id), 10) : (token.misId as number);
    await TimetableImage.findOneAndUpdate(
      { f_id: targetId },
      { $set: { image: buffer, contentType } },
      { upsert: true }
    );
    return NextResponse.json({ message: "Timetable uploaded" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
