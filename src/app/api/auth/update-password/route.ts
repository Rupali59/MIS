import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const schema = z.object({
  misId: z.number(),
  newPassword: z.string().min(1),
  secQuest: z.string().optional(),
  secAns: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { misId, newPassword, secQuest, secAns } = parsed.data;
    await connectDB();
    const filter: { misId: number; secQuest?: string; secAns?: string } = { misId };
    if (secQuest != null) filter.secQuest = secQuest;
    if (secAns != null) filter.secAns = secAns;
    const user = await User.findOne(filter);
    if (!user) {
      return NextResponse.json({ error: "User not found or security answer mismatch" }, { status: 400 });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json({ message: "Password updated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
