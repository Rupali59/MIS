import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import CurStuDetails from "@/models/CurStuDetails";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const details = await CurStuDetails.findOne({ misId: token.misId }).lean();
    return NextResponse.json(details || {});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    await CurStuDetails.findOneAndUpdate(
      { misId: token.misId },
      {
        $set: {
          dept: body.dept,
          yearOfJoin: body.yearOfJoin,
          sem: body.sem,
          specialization: body.specialization,
          degree: body.degree,
        },
      },
      { upsert: true, new: true }
    );
    return NextResponse.json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
