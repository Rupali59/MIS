import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const schema = z.object({
  misId: z.number(),
  secQuest: z.string(),
  secAns: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    await connectDB();
    const user = await User.findOne({
      misId: parsed.data.misId,
      secQuest: parsed.data.secQuest,
      secAns: parsed.data.secAns,
    }).lean();
    if (!user) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }
    return NextResponse.json({ valid: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
