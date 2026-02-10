import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import FacultyProfile from "@/models/FacultyProfile";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const profile = await FacultyProfile.findOne({ f_id: token.misId }).lean();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit photo from response
    const { photo, ...rest } = profile;
    return NextResponse.json(rest);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const updated = await FacultyProfile.findOneAndUpdate(
      { f_id: token.misId },
      { $set: body },
      { new: true }
    ).lean();
    if (!updated) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit photo from response
    const { photo, ...rest } = updated;
    return NextResponse.json(rest);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
