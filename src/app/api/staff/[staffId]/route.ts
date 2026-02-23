import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import StaffMember from "@/models/StaffMember";
import StaffQualification from "@/models/StaffQualification";
import StaffCourseHistory from "@/models/StaffCourseHistory";
import Publication from "@/models/Publication";
import TrainingAttended from "@/models/TrainingAttended";
import TrainingConducted from "@/models/TrainingConducted";
import Course from "@/models/Course";

interface Params {
  params: { staffId: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { staffId } = params;
  await connectDB();

  const staff = await StaffMember.findOne({ staffId }).lean();
  if (!staff) {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }

  const [qualifications, teachings, publications, trainingsAtt, trainingsCond] = await Promise.all([
    StaffQualification.find({ staff: staff._id }).lean(),
    StaffCourseHistory.find({ staff: staff._id }).populate("course").lean(),
    Publication.find({ staff: staff._id }).lean(),
    TrainingAttended.find({ staff: staff._id }).lean(),
    TrainingConducted.find({ staff: staff._id }).lean(),
  ]);

  return NextResponse.json({
    staff,
    qualifications,
    teachings,
    publications,
    trainingsAttended: trainingsAtt,
    trainingsConducted: trainingsCond,
  });
}

