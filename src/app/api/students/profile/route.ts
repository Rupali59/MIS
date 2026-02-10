import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import StudentProfile from "@/models/StudentProfile";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const profile = await StudentProfile.findOne({ misId: token.misId }).lean();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- omit photo from response
    const { photo, ...rest } = profile;
    return NextResponse.json(rest);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const updated = await StudentProfile.findOneAndUpdate(
      { misId: token.misId },
      {
        $set: {
          fname: body.fname,
          mname: body.mname,
          lname: body.lname,
          dob: body.dob,
          gender: body.gender,
          faname: body.faname,
          focc: body.focc,
          moname: body.moname,
          mocc: body.mocc,
          phno: body.phno,
          p_street: body.p_street,
          p_city: body.p_city,
          p_state: body.p_state,
          p_country: body.p_country,
          p_pincode: body.p_pincode,
          t_street: body.t_street,
          t_city: body.t_city,
          t_state: body.t_state,
          t_country: body.t_country,
          t_pincode: body.t_pincode,
          mno: body.mno,
          lno: body.lno,
          bloodGrp: body.bloodGrp,
          email: body.email,
          religion: body.religion,
          category: body.category,
          maritalStatus: body.maritalStatus,
          nationality: body.nationality,
        },
      },
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
