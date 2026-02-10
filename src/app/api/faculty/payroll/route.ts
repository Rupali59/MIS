import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import FacDesg from "@/models/FacDesg";
import FacAttMonth from "@/models/FacAttMonth";
import WorkingDays from "@/models/WorkingDays";
import SalaryFix from "@/models/SalaryFix";
import MonthlySal from "@/models/MonthlySal";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.misId || token.role !== "faculty") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const f_id = token.misId as number;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const [desg, att, workingDays, salaryFix, monthlySal] = await Promise.all([
      FacDesg.findOne({ f_id }).lean(),
      FacAttMonth.findOne({ f_id, month, year }).lean(),
      WorkingDays.findOne({ month, year }).lean(),
      SalaryFix.find().lean(),
      MonthlySal.find({ f_id }).sort({ year: -1, month: -1 }).limit(12).lean(),
    ]);
    const desgName = (desg as { desg?: string })?.desg;
    const salFix = salaryFix?.find((s: { fac_desg?: string }) => s.fac_desg === desgName) as { fac_sal?: number } | undefined;
    return NextResponse.json({
      desg: desgName,
      att,
      workingDays,
      baseSalary: salFix?.fac_sal,
      monthlySalaries: monthlySal,
    });
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
    await connectDB();
    const f_id = token.misId as number;
    const desgRec = await FacDesg.findOne({ f_id }).lean();
    const desg = (desgRec as { desg?: string })?.desg;
    if (!desg) return NextResponse.json({ error: "Designation not set" }, { status: 400 });
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const [att, workingDays, salaryFix] = await Promise.all([
      FacAttMonth.findOne({ f_id, month, year }).lean(),
      WorkingDays.findOne({ month, year }).lean(),
      SalaryFix.findOne({ fac_desg: desg }).lean(),
    ]);
    const totalDays = (workingDays as { total_days?: number })?.total_days ?? 30;
    const noOfDays = (att as { no_of_days?: number })?.no_of_days ?? 0;
    const baseSal = (salaryFix as { fac_sal?: number })?.fac_sal ?? 0;
    const amount = Math.round((baseSal * noOfDays) / totalDays);
    await MonthlySal.findOneAndUpdate(
      { f_id, month, year },
      { $set: { amount } },
      { upsert: true, new: true }
    );
    return NextResponse.json({ message: "Payroll computed", amount });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Compute failed" }, { status: 500 });
  }
}
