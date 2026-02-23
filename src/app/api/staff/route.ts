import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StaffMember from "@/models/StaffMember";

// GET /api/staff?department=CSE&category=faculty
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  await connectDB();

  const query: Record<string, unknown> = {};
  if (department) query.department = department;
  if (category) query.category = category;

  const staff = await StaffMember.find(query).sort({ department: 1, designation: 1, lastName: 1 }).lean();
  return NextResponse.json(staff);
}

